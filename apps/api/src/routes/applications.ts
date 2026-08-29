import { Hono } from 'hono';
import { getDbClient } from '../db/client';
import { calculatePriority } from '../services/priority';
import type { Bindings } from '../config';

const applications = new Hono<{ Bindings: Bindings }>();

applications.post('/', async (c) => {
  const body = await c.req.json();
  const db = getDbClient(c.env);

  // Server-side validation
  const requiredFields: Array<{ key: string; label: string }> = [
    { key: 'applicant_name', label: 'Applicant Name' },
    { key: 'applicant_phone', label: 'Applicant Phone' },
    { key: 'org_name', label: 'Organization Name' },
    { key: 'vehicle_number', label: 'Vehicle Number' },
    { key: 'driver_name', label: 'Driver Name' },
    { key: 'driver_phone', label: 'Driver Phone' },
    { key: 'departure_location', label: 'Departure Location' },
    { key: 'destination', label: 'Destination' },
    { key: 'cargo_details', label: 'Cargo Details' },
  ];

  for (const field of requiredFields) {
    if (!body[field.key] || !String(body[field.key]).trim()) {
      return c.json({ error: `Please provide ${field.label}` }, 400);
    }
  }

  const proposedRoute = (body.proposed_route || `${body.departure_location} → ${body.destination}`).trim();
  const travelPurpose = (body.travel_purpose || `Emergency relief delivery: ${body.cargo_type || 'Relief Goods'}`).trim();
  
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = crypto.randomUUID().slice(0, 4).toUpperCase();
  const id = `EP-${dateStr}-${randomStr}`;
  
  const priority = calculatePriority(body.org_type, body.cargo_type, body.vehicle_type);
  const secretToken = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  await db.execute({
    sql: `INSERT INTO applications (
      id, applicant_name, applicant_phone, applicant_email, org_name, org_type, org_id,
      vehicle_number, vehicle_type, vehicle_owner, driver_name, driver_phone, passenger_count,
      vehicle_capacity, emergency_contact, departure_location, destination, intermediate_checkpoints,
      departure_time, return_time, proposed_route, travel_purpose, cargo_type, cargo_details,
      supporting_documents, priority, status, secret_token, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      body.applicant_name ?? '',
      body.applicant_phone ?? '',
      body.applicant_email ?? '',
      body.org_name ?? '',
      body.org_type ?? '',
      body.org_id ?? null,
      body.vehicle_number ?? '',
      body.vehicle_type ?? '',
      body.vehicle_owner ?? '',
      body.driver_name ?? '',
      body.driver_phone ?? '',
      body.passenger_count ?? 1,
      body.vehicle_capacity ?? '',
      body.emergency_contact ?? '',
      body.departure_location ?? '',
      body.destination ?? '',
      body.intermediate_checkpoints ?? null,
      body.departure_time ?? '',
      body.return_time ?? '',
      proposedRoute,
      travelPurpose,
      body.cargo_type ?? '',
      body.cargo_details ?? '',
      body.supporting_documents ? (typeof body.supporting_documents === 'string' ? body.supporting_documents : JSON.stringify(body.supporting_documents)) : null,
      priority,
      'submitted',
      secretToken,
      createdAt,
      createdAt
    ]
  });

  return c.json({ id, secret_token: secretToken, message: 'Application submitted successfully' }, 201);
});

function maskPhone(phone: unknown): string {
  if (!phone) return '';
  const str = String(phone).trim();
  if (str.length <= 4) return '****';
  if (str.length === 10) {
    return str.slice(0, 3) + '****' + str.slice(-3);
  }
  return str.slice(0, Math.min(3, Math.floor(str.length / 2))) + '****' + str.slice(-2);
}

function maskEmail(email: unknown): string {
  if (!email) return '';
  const str = String(email).trim();
  const parts = str.split('@');
  if (parts.length !== 2) return '***@***';
  const name = parts[0];
  const domain = parts[1];
  const maskedName = name.length > 2 ? name.charAt(0) + '***' + name.charAt(name.length - 1) : '***';
  return `${maskedName}@${domain}`;
}

applications.get('/:id/track', async (c) => {
  const id = (c.req.param('id') || '').trim();
  const queryToken = (c.req.query('token') || '').trim();
  const headerToken = (c.req.header('x-applicant-token') || c.req.header('x-application-token') || '').trim();
  const authHeader = (c.req.header('Authorization') || '').trim();
  const clientToken = queryToken || headerToken;
  const db = getDbClient(c.env);

  const res = await db.execute({
    sql: `SELECT id, applicant_name, applicant_phone, applicant_email, org_name, org_type,
          vehicle_number, vehicle_type, driver_name, driver_phone, emergency_contact,
          passenger_count, vehicle_capacity,
          departure_location, destination, intermediate_checkpoints,
          departure_time, return_time, proposed_route, cargo_type,
          cargo_details, travel_purpose, priority, status, admin_notes,
          info_request_reason, secret_token, created_at, updated_at
          FROM applications
          WHERE id = ? OR UPPER(REPLACE(vehicle_number, ' ', '')) = UPPER(REPLACE(?, ' ', '')) OR secret_token = ?
          ORDER BY datetime(created_at) DESC
          LIMIT 1`,
    args: [id, id, id],
  });

  if (res.rows.length === 0) {
    return c.json({ error: 'Application not found' }, 404);
  }

  const row = res.rows[0] as Record<string, unknown>;
  const appId = String(row.id);

  // Determine if viewer is the creator or an authorized administrator
  let isAuthorized = false;

  // 1. Check if token matches application secret_token
  if (clientToken && String(row.secret_token) === clientToken) {
    isAuthorized = true;
  }

  // 2. Check if admin token is valid
  if (!isAuthorized && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.replace('Bearer ', '').trim();
    if (bearerToken) {
      try {
        const adminCheck = await db.execute({
          sql: `SELECT id, username, role FROM admin_users WHERE token = ? OR id = ? LIMIT 1`,
          args: [bearerToken, bearerToken],
        });
        if (adminCheck.rows.length > 0) {
          isAuthorized = true;
        }
      } catch {}
    }
  }

  const passRes = await db.execute({
    sql: `SELECT id, status FROM passes WHERE application_id = ? ORDER BY datetime(created_at) DESC LIMIT 1`,
    args: [appId],
  });
  const pass = passRes.rows[0] as { id?: string; status?: string } | undefined;

  const { secret_token: _ignored, ...publicFields } = row;
  void _ignored;

  // Mask sensitive information if not the same applicant or admin
  const sanitizedApp = isAuthorized
    ? { ...publicFields }
    : {
        ...publicFields,
        applicant_phone: maskPhone(row.applicant_phone),
        applicant_email: maskEmail(row.applicant_email),
        driver_phone: maskPhone(row.driver_phone),
        emergency_contact: maskPhone(row.emergency_contact),
      };

  return c.json({
    application: {
      ...sanitizedApp,
      pass_id: pass ? appId : null,
      pass_status: pass?.status ?? null,
      is_owner: isAuthorized,
    },
  });
});

export default applications;
