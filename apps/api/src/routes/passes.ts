import { Hono } from 'hono';
import { getDbClient } from '../db/client';
import type { Bindings } from '../config';

const passes = new Hono<{ Bindings: Bindings }>();

passes.get('/:id/public', async (c) => {
  const id = (c.req.param('id') || '').trim();
  const db = getDbClient(c.env);

  const res = await db.execute({
    sql: `SELECT
            p.id, p.application_id, p.qr_token, p.issued_by, p.issuing_authority,
            p.valid_from, p.valid_until, p.approved_route, p.status,
            p.revocation_reason, p.revoked_at, p.revoked_by, p.created_at,
            a.applicant_name, a.org_name, a.vehicle_number, a.vehicle_type,
            a.driver_name, a.driver_phone, a.passenger_count, a.travel_purpose,
            a.cargo_type, a.departure_location, a.destination, a.priority, a.proposed_route
          FROM passes p
          JOIN applications a ON a.id = p.application_id
          WHERE p.id = ? OR p.application_id = ?
          ORDER BY p.created_at DESC
          LIMIT 1`,
    args: [id, id],
  });

  if (res.rows.length === 0) {
    return c.json({ error: 'Pass not found' }, 404);
  }

  const pass = res.rows[0] as { status?: string };
  if (pass.status !== 'active') {
    return c.json({ error: 'Pass is not active', status: pass.status }, 400);
  }

  return c.json({ pass });
});

export default passes;
