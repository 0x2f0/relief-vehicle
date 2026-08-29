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

applications.get('/:id/track', async (c) => {
  const id = (c.req.param('id') || '').trim();
  const token = (c.req.query('token') || '').trim();
  const db = getDbClient(c.env);

  const res = await db.execute({
    sql: `SELECT id, applicant_name, applicant_phone, org_name, org_type,
          vehicle_number, vehicle_type, driver_name, driver_phone,
          departure_location, destination, proposed_route, cargo_type,
          cargo_details, travel_purpose, priority, status, admin_notes,
          info_request_reason, secret_token, created_at, updated_at
          FROM applications
          WHERE id = ? OR UPPER(REPLACE(vehicle_number, ' ', '')) = UPPER(REPLACE(?, ' ', ''))
          ORDER BY datetime(created_at) DESC
          LIMIT 1`,
    args: [id, id],
  });

  if (res.rows.length === 0) {
    return c.json({ error: 'Application not found' }, 404);
  }

  const row = res.rows[0] as Record<string, unknown>;
  if (token && row.secret_token !== token) {
    return c.json({ error: 'Application not found or invalid token' }, 404);
  }

  const appId = String(row.id);
  const passRes = await db.execute({
    sql: `SELECT id, status FROM passes WHERE application_id = ? ORDER BY datetime(created_at) DESC LIMIT 1`,
    args: [appId],
  });
  const pass = passRes.rows[0] as { id?: string; status?: string } | undefined;

  const { secret_token: _ignored, ...publicApp } = row;
  void _ignored;

  return c.json({
    application: {
      ...publicApp,
      pass_id: pass ? id : null,
      pass_status: pass?.status ?? null,
    },
  });
});

export default applications;
