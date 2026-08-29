import { Hono } from 'hono';
import { getDbClient } from '../db/client';
import type { Bindings } from '../config';

const passes = new Hono<{ Bindings: Bindings }>();

function maskPhone(phone: unknown): string {
  if (!phone) return '';
  const str = String(phone).trim();
  if (str.length <= 4) return '****';
  if (str.length === 10) {
    return str.slice(0, 3) + '****' + str.slice(-3);
  }
  return str.slice(0, Math.min(3, Math.floor(str.length / 2))) + '****' + str.slice(-2);
}

passes.get('/:id/public', async (c) => {
  const id = (c.req.param('id') || '').trim();
  const queryToken = (c.req.query('token') || '').trim();
  const headerToken = (c.req.header('x-applicant-token') || c.req.header('x-application-token') || '').trim();
  const authHeader = (c.req.header('Authorization') || '').trim();
  const clientToken = queryToken || headerToken;
  const db = getDbClient(c.env);

  const res = await db.execute({
    sql: `SELECT
            p.id, p.application_id, p.qr_token, p.issued_by, p.issuing_authority,
            p.valid_from, p.valid_until, p.approved_route, p.status,
            p.revocation_reason, p.revoked_at, p.revoked_by, p.created_at,
            a.applicant_name, a.org_name, a.vehicle_number, a.vehicle_type,
            a.driver_name, a.driver_phone, a.passenger_count, a.travel_purpose,
            a.cargo_type, a.departure_location, a.destination, a.priority, a.proposed_route,
            a.secret_token
          FROM passes p
          JOIN applications a ON a.id = p.application_id
          WHERE p.id = ? OR p.application_id = ? OR UPPER(REPLACE(a.vehicle_number, ' ', '')) = UPPER(REPLACE(?, ' ', ''))
          ORDER BY datetime(p.created_at) DESC
          LIMIT 1`,
    args: [id, id, id],
  });

  if (res.rows.length === 0) {
    return c.json({ error: 'Pass not found' }, 404);
  }

  const row = res.rows[0] as Record<string, unknown>;
  if (row.status !== 'active') {
    return c.json({ error: 'Pass is not active', status: row.status }, 400);
  }

  let isAuthorized = false;
  if (clientToken && String(row.secret_token) === clientToken) {
    isAuthorized = true;
  }
  if (!isAuthorized && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.replace('Bearer ', '').trim();
    if (bearerToken) {
      try {
        const adminCheck = await db.execute({
          sql: `SELECT id FROM admin_users WHERE token = ? OR id = ? LIMIT 1`,
          args: [bearerToken, bearerToken],
        });
        if (adminCheck.rows.length > 0) isAuthorized = true;
      } catch {}
    }
  }

  const { secret_token: _ignored, ...passData } = row;
  void _ignored;

  const sanitizedPass = isAuthorized
    ? passData
    : {
        ...passData,
        driver_phone: maskPhone(row.driver_phone),
      };

  const code = String(row.application_id || row.id);
  return c.json({ pass: { ...sanitizedPass, id: code } });
});

export default passes;
