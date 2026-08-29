import { Hono } from 'hono';
import { getDbClient } from '../db/client';
import { calculatePriority } from '../services/priority';
import type { Bindings } from '../config';

const applications = new Hono<{ Bindings: Bindings }>();

applications.post('/', async (c) => {
  const body = await c.req.json();
  const db = getDbClient(c.env);
  
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
      body.proposed_route ?? '',
      body.travel_purpose ?? '',
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

applications.get('/:id/track', async (c) => {
  const id = c.req.param('id');
  const token = c.req.query('token');
  
  const db = getDbClient(c.env);
  const res = await db.execute({
    sql: 'SELECT * FROM applications WHERE id = ? AND secret_token = ?',
    args: [id, token || '']
  });

  if (res.rows.length === 0) {
    return c.json({ error: 'Application not found or invalid token' }, 404);
  }

  return c.json({ application: res.rows[0] });
});

export default applications;
