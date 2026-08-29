import { Hono } from 'hono';
import { getDbClient } from '../db/client';
import { authMiddleware } from '../middleware/auth';
import { hashPassword } from './auth';
import { logAudit } from '../services/audit';
import type { Bindings, Variables } from '../config';

const admin = new Hono<{ Bindings: Bindings; Variables: Variables }>();

admin.use('*', authMiddleware);

admin.get('/applications', async (c) => {
  const db = getDbClient(c.env);
  const status = c.req.query('status');
  
  let sql = `
    SELECT * FROM applications
    ${status ? 'WHERE status = ?' : ''}
    ORDER BY 
      CASE 
        WHEN priority = 'Critical' THEN 1
        WHEN priority = 'High' THEN 2
        WHEN priority = 'Medium' THEN 3
        ELSE 4
      END ASC,
      datetime(created_at) DESC,
      created_at DESC
  `;
  const args = status ? [status] : [];
  
  try {
    const res = await db.execute({ sql, args });
    return c.json({ applications: res.rows });
  } catch (err: any) {
    return c.json({ applications: [] });
  }
});

admin.get('/applications/:id', async (c) => {
  const id = c.req.param('id');
  const db = getDbClient(c.env);
  
  try {
    const res = await db.execute({
      sql: 'SELECT * FROM applications WHERE id = ?',
      args: [id]
    });
    
    if (res.rows.length === 0) {
      return c.json({ error: 'Application not found' }, 404);
    }
    
    return c.json({ application: res.rows[0] });
  } catch (err: any) {
    return c.json({ error: 'Application not found' }, 404);
  }
});

admin.patch('/applications/:id/status', async (c) => {
  const id = c.req.param('id');
  const { status, admin_notes } = await c.req.json();
  const db = getDbClient(c.env);
  
  await db.execute({
    sql: 'UPDATE applications SET status = ?, admin_notes = ?, updated_at = ? WHERE id = ?',
    args: [status, admin_notes || null, new Date().toISOString(), id]
  });
  
  const user = c.get('user') as any;
  await logAudit(c.env, 'UPDATE_APPLICATION_STATUS', 'application', id, user.id, user.role, `Status updated to ${status}`);
  
  return c.json({ message: 'Application status updated' });
});

admin.post('/passes/issue', async (c) => {
  const { application_id, approved_route, valid_from, valid_until } = await c.req.json();
  const appId = String(application_id || '').trim();
  if (!appId) {
    return c.json({ error: 'application_id required' }, 400);
  }

  const db = getDbClient(c.env);
  const user = c.get('user') as any;
  const now = new Date().toISOString();
  const qrToken = `https://relief-vehicle.pages.dev/pass/${appId}`;

  const appRes = await db.execute({
    sql: 'SELECT id FROM applications WHERE id = ?',
    args: [appId],
  });
  if (appRes.rows.length === 0) {
    return c.json({ error: 'Application not found' }, 404);
  }

  const existing = await db.execute({
    sql: 'SELECT id FROM passes WHERE application_id = ? ORDER BY created_at DESC LIMIT 1',
    args: [appId],
  });

  if (existing.rows.length > 0) {
    await db.execute({
      sql: `UPDATE passes SET qr_token = ?, valid_from = ?, valid_until = ?, approved_route = ?, status = 'active',
            revocation_reason = NULL, revoked_at = NULL, revoked_by = NULL WHERE application_id = ?`,
      args: [qrToken, valid_from, valid_until, approved_route, appId],
    });
  } else {
    await db.execute({
      sql: 'INSERT INTO passes (id, application_id, qr_token, issued_by, issuing_authority, valid_from, valid_until, approved_route, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      args: [appId, appId, qrToken, user.id, 'Relief Coordination Center', valid_from, valid_until, approved_route, now]
    });
  }

  await db.execute({
    sql: 'UPDATE applications SET status = ?, updated_at = ? WHERE id = ?',
    args: ['issued', now, appId]
  });
  
  await logAudit(c.env, 'ISSUE_PASS', 'pass', appId, user.id, user.role, `Issued pass for application ${appId}`);
  
  return c.json({ id: appId, qr_token: qrToken, message: 'Pass issued successfully' }, 201);
});

admin.post('/passes/:id/revoke', async (c) => {
  const id = c.req.param('id');
  const { revocation_reason } = await c.req.json();
  const db = getDbClient(c.env);
  const user = c.get('user') as any;
  
  await db.execute({
    sql: 'UPDATE passes SET status = ?, revocation_reason = ?, revoked_at = ?, revoked_by = ? WHERE id = ? OR application_id = ?',
    args: ['revoked', revocation_reason, new Date().toISOString(), user.id, id, id]
  });
  
  await logAudit(c.env, 'REVOKE_PASS', 'pass', id, user.id, user.role, `Revoked pass with reason: ${revocation_reason}`);
  
  return c.json({ message: 'Pass revoked' });
});

// Checkpoint Stations Management
admin.get('/checkpoints', async (c) => {
  try {
    const db = getDbClient(c.env);
    const res = await db.execute('SELECT * FROM checkpoints ORDER BY name ASC');
    return c.json({ checkpoints: res.rows });
  } catch (err: any) {
    return c.json({ checkpoints: [] });
  }
});

admin.post('/checkpoints', async (c) => {
  const { name, location, district, highway } = await c.req.json();
  if (!name || !location) {
    return c.json({ error: 'Station name and location are required' }, 400);
  }
  try {
    const db = getDbClient(c.env);
    const id = `CP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const now = new Date().toISOString();
    await db.execute({
      sql: 'INSERT INTO checkpoints (id, name, location, district, highway, is_active, created_at) VALUES (?, ?, ?, ?, ?, 1, ?)',
      args: [id, name.trim(), location.trim(), district || null, highway || null, now],
    });
    return c.json({ id, message: 'Checkpoint station created successfully' }, 201);
  } catch (err: any) {
    return c.json({ error: err.message || 'Failed to create checkpoint' }, 400);
  }
});

admin.delete('/checkpoints/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const db = getDbClient(c.env);
    await db.execute({ sql: 'DELETE FROM checkpoints WHERE id = ?', args: [id] });
    return c.json({ message: 'Checkpoint station removed' });
  } catch (err: any) {
    return c.json({ error: err.message || 'Failed to remove checkpoint' }, 400);
  }
});

// Users Management (Superuser only)
admin.get('/users', async (c) => {
  const currentUser = c.get('user') as any;
  if (currentUser?.role !== 'superadmin') {
    return c.json({ error: 'Unauthorized: Only the Superuser can view all system users' }, 403);
  }
  try {
    const db = getDbClient(c.env);
    const res = await db.execute('SELECT id, username, role, full_name, checkpoint_name, badge_number, phone, created_at FROM users ORDER BY created_at DESC');
    return c.json({ users: res.rows });
  } catch (err: any) {
    return c.json({ users: [] });
  }
});

admin.post('/users', async (c) => {
  const currentUser = c.get('user') as any;
  if (currentUser?.role !== 'superadmin') {
    return c.json({ error: 'Unauthorized: Only the Superuser can add members' }, 403);
  }

  const { username, password, role, full_name, checkpoint_name, badge_number, phone } = await c.req.json();
  if (!username || !password) {
    return c.json({ error: 'Username and password are required' }, 400);
  }

  // Only allowed roles for added members: checkpoint_officer and gov_officer
  const assignedRole = role === 'gov_officer' ? 'gov_officer' : 'checkpoint_officer';

  const db = getDbClient(c.env);
  const id = `USR-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const pwd = await hashPassword(password);
  const now = new Date().toISOString();

  try {
    await db.execute({
      sql: 'INSERT INTO users (id, username, password_hash, role, full_name, checkpoint_name, badge_number, phone, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      args: [id, username.trim(), pwd, assignedRole, full_name || username.trim(), checkpoint_name || null, badge_number || null, phone || null, now],
    });
    return c.json({ id, message: `Member account (${assignedRole}) created successfully` }, 201);
  } catch (err: any) {
    return c.json({ error: err.message || 'Failed to create user (username may already exist)' }, 400);
  }
});

admin.delete('/users/:id', async (c) => {
  const currentUser = c.get('user') as any;
  if (currentUser?.role !== 'superadmin') {
    return c.json({ error: 'Unauthorized: Only the Superuser can remove members' }, 403);
  }

  const id = c.req.param('id');
  if (currentUser?.id === id) {
    return c.json({ error: 'Cannot delete current logged-in superuser' }, 400);
  }

  const db = getDbClient(c.env);
  const targetUser = await db.execute({ sql: 'SELECT role FROM users WHERE id = ?', args: [id] });
  if (targetUser.rows.length > 0 && targetUser.rows[0].role === 'superadmin') {
    return c.json({ error: 'Cannot delete the Superuser account' }, 400);
  }

  await db.execute({ sql: 'DELETE FROM users WHERE id = ?', args: [id] });
  return c.json({ message: 'User account removed' });
});

admin.patch('/applications/:id/hold', async (c) => {
  const id = c.req.param('id');
  const { admin_notes } = await c.req.json().catch(() => ({}));
  const db = getDbClient(c.env);
  
  await db.execute({
    sql: 'UPDATE applications SET status = ?, admin_notes = ?, updated_at = ? WHERE id = ?',
    args: ['held', admin_notes || 'Application held for route clearance verification', new Date().toISOString(), id]
  });
  
  const user = c.get('user') as any;
  await logAudit(c.env, 'HOLD_APPLICATION', 'application', id, user.id, user.role, `Application put on hold: ${admin_notes || 'Pending check'}`);
  
  return c.json({ message: 'Application held' });
});

admin.patch('/applications/:id/request-info', async (c) => {
  const id = c.req.param('id');
  const { info_request_reason } = await c.req.json();
  const db = getDbClient(c.env);
  
  await db.execute({
    sql: 'UPDATE applications SET status = ?, info_request_reason = ?, updated_at = ? WHERE id = ?',
    args: ['info_requested', info_request_reason || 'Additional identity or cargo documentation required', new Date().toISOString(), id]
  });
  
  const user = c.get('user') as any;
  await logAudit(c.env, 'REQUEST_INFO', 'application', id, user.id, user.role, `Requested info: ${info_request_reason}`);
  
  return c.json({ message: 'Information requested from applicant' });
});

admin.get('/coordination', async (c) => {
  try {
    const db = getDbClient(c.env);

    // 1. Status summary
    const statusRes = await db.execute('SELECT status, COUNT(*) as count FROM applications GROUP BY status');
    const statusSummary: Record<string, number> = {};
    for (const r of statusRes.rows) {
      statusSummary[r.status as string] = Number(r.count);
    }

    // 2. Duplicate vehicle / overlapping request detection
    const duplicatesRes = await db.execute(`
      SELECT vehicle_number, org_name, COUNT(*) as request_count, 
             GROUP_CONCAT(destination, ', ') as destinations
      FROM applications
      WHERE status NOT IN ('rejected', 'revoked')
      GROUP BY vehicle_number
      HAVING COUNT(*) > 1
      ORDER BY request_count DESC
      LIMIT 10
    `);

    // 3. Top destination hubs
    const destRes = await db.execute(`
      SELECT destination, COUNT(*) as count,
             SUM(CASE WHEN priority = 'Critical' THEN 1 ELSE 0 END) as critical_count
      FROM applications
      WHERE status IN ('approved', 'issued', 'active', 'submitted')
      GROUP BY destination
      ORDER BY count DESC
      LIMIT 8
    `);

    // 4. Highway corridor volumes
    const routesRes = await db.execute(`
      SELECT proposed_route as route, COUNT(*) as count
      FROM applications
      WHERE proposed_route IS NOT NULL AND proposed_route != ''
      GROUP BY proposed_route
      ORDER BY count DESC
      LIMIT 8
    `);

    // 5. Active Road Hazards
    const roadsRes = await db.execute(`
      SELECT road_name as road, status, description as reason
      FROM road_conditions
      WHERE status != 'open'
      ORDER BY updated_at DESC
      LIMIT 10
    `);

    return c.json({
      stats: statusRes.rows,
      statusSummary,
      duplicateAlerts: duplicatesRes.rows,
      destinations: destRes.rows,
      routes: routesRes.rows,
      roadHazards: roadsRes.rows,
    });
  } catch (err: any) {
    return c.json({
      stats: [],
      statusSummary: {},
      duplicateAlerts: [],
      destinations: [],
      routes: [],
      roadHazards: [],
    });
  }
});

admin.get('/audit-logs', async (c) => {
  try {
    const db = getDbClient(c.env);
    const entityType = c.req.query('entity_type');
    const search = c.req.query('search')?.trim().toLowerCase();
    const limit = Math.min(parseInt(c.req.query('limit') || '100', 10), 500);

    let sql = 'SELECT * FROM audit_logs WHERE 1=1';
    const args: any[] = [];

    if (entityType) {
      sql += ' AND entity_type = ?';
      args.push(entityType);
    }

    if (search) {
      sql += ' AND (LOWER(entity_id) LIKE ? OR LOWER(action) LIKE ? OR LOWER(actor_id) LIKE ? OR LOWER(details) LIKE ?)';
      args.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY created_at DESC LIMIT ?';
    args.push(limit);

    const res = await db.execute({ sql, args });
    return c.json({ logs: res.rows });
  } catch (err: any) {
    return c.json({ logs: [] });
  }
});

export default admin;
