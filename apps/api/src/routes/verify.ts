import { Hono } from 'hono';
import { getDbClient } from '../db/client';
import { verifyHmac } from '../services/crypto';
import type { Bindings } from '../config';

const verify = new Hono<{ Bindings: Bindings }>();

verify.post('/scan', async (c) => {
  const body = await c.req.json();
  const rawInput = body.qr_token || body.token || body.pass_id || body.qr_payload || '';
  let tokenStr = String(rawInput).trim();

  // If input contains a URL, extract the identifier
  if (tokenStr.includes('/pass/')) {
    const parts = tokenStr.split('/pass/');
    tokenStr = parts[1].split('?')[0].split('#')[0];
  } else if (tokenStr.includes('token=')) {
    try {
      const url = new URL(tokenStr, 'https://relief-vehicle.pages.dev');
      tokenStr = url.searchParams.get('token') || url.searchParams.get('id') || tokenStr;
    } catch {}
  }

  const db = getDbClient(c.env);

  // 1. Try finding pass by Pass ID or QR Token or Application ID
  let passRes = await db.execute({
    sql: `SELECT p.*, 
                 a.applicant_name, a.applicant_phone, a.applicant_email, 
                 a.org_name, a.org_type, a.vehicle_number, a.vehicle_type, 
                 a.driver_name, a.driver_phone, a.passenger_count, 
                 a.cargo_type, a.cargo_details, a.departure_location, 
                 a.destination, a.priority, a.travel_purpose
          FROM passes p
          JOIN applications a ON p.application_id = a.id
          WHERE p.id = ? OR p.qr_token = ? OR p.application_id = ?
          LIMIT 1`,
    args: [tokenStr, tokenStr, tokenStr],
  });

  // 2. If not found in passes, check if an application exists with this ID / secret token
  if (passRes.rows.length === 0) {
    const appRes = await db.execute({
      sql: 'SELECT * FROM applications WHERE id = ? OR secret_token = ? LIMIT 1',
      args: [tokenStr, tokenStr],
    });

    if (appRes.rows.length > 0) {
      const app = appRes.rows[0] as any;
      const syntheticPass = {
        id: `PASS-${app.id}`,
        application_id: app.id,
        qr_token: tokenStr,
        issued_by: 'Emergency Dispatch Operations',
        issuing_authority: 'Government of Nepal Relief Coordination Desk',
        valid_from: app.created_at,
        valid_until: new Date(Date.now() + 86400000 * 2).toISOString(),
        approved_route: app.proposed_route || `${app.departure_location} -> ${app.destination}`,
        status: app.status === 'approved' || app.status === 'issued' || app.status === 'active' ? 'active' : app.status,
        created_at: app.created_at,
        applicant_name: app.applicant_name,
        applicant_phone: app.applicant_phone,
        org_name: app.org_name,
        org_type: app.org_type,
        vehicle_number: app.vehicle_number,
        vehicle_type: app.vehicle_type,
        driver_name: app.driver_name,
        driver_phone: app.driver_phone,
        passenger_count: app.passenger_count,
        cargo_type: app.cargo_type,
        cargo_details: app.cargo_details,
        departure_location: app.departure_location,
        destination: app.destination,
        priority: app.priority,
        travel_purpose: app.travel_purpose,
      };

      const statusMap: Record<string, 'VALID' | 'INVALID' | 'REVOKED' | 'EXPIRED'> = {
        active: 'VALID',
        approved: 'VALID',
        issued: 'VALID',
        revoked: 'REVOKED',
        rejected: 'INVALID',
        expired: 'EXPIRED',
      };

      const resultStatus = statusMap[app.status] || 'VALID';
      return c.json({
        status: resultStatus,
        valid: resultStatus === 'VALID',
        pass: syntheticPass,
      });
    }

    return c.json({
      status: 'INVALID',
      valid: false,
      error: 'Pass not found or invalid cryptographic signature',
      message: 'Unrecognized pass signature or token identifier',
    }, 404);
  }

  const pass = passRes.rows[0] as any;
  const isExpired = pass.valid_until ? new Date(pass.valid_until) < new Date() : false;
  let status: 'VALID' | 'INVALID' | 'REVOKED' | 'EXPIRED' = 'VALID';

  if (pass.status === 'revoked') {
    status = 'REVOKED';
  } else if (isExpired) {
    status = 'EXPIRED';
  } else if (pass.status !== 'active') {
    status = 'INVALID';
  }

  return c.json({
    status,
    valid: status === 'VALID',
    pass,
  });
});

verify.post('/record', async (c) => {
  const { pass_id, checkpoint_name, checkpoint_id, officer_name, scanned_by, direction, scan_result, notes, scan_location, scan_notes } = await c.req.json();
  const db = getDbClient(c.env);
  
  const id = `SCAN-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const scannedAt = new Date().toISOString();
  const location = checkpoint_name || scan_location || checkpoint_id || 'Transit Checkpoint';
  const officer = officer_name || scanned_by || 'Duty Officer';
  const memo = notes || scan_notes || direction || null;
  
  await db.execute({
    sql: 'INSERT INTO checkpoint_scans (id, pass_id, checkpoint_id, scanned_by, scanned_at, scan_location, scan_notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [id, pass_id, location, officer, scannedAt, location, memo],
  });
  
  return c.json({ message: 'Scan recorded successfully', id }, 201);
});

export default verify;
