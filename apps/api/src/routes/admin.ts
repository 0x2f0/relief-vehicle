import { Hono } from 'hono';
import { getDbClient } from '../db/client';
import { authMiddleware } from '../middleware/auth';
import { hashPassword } from './auth';
import { logAudit } from '../services/audit';
import type { Bindings } from '../config';

const admin = new Hono<{ Bindings: Bindings }>();

admin.use('*', authMiddleware);

admin.get('/applications', async (c) => {
  const db = getDbClient(c.env);
  const status = c.req.query('status');
  
  let sql = 'SELECT * FROM applications';
  const args = [];
  
  if (status) {
    sql += ' WHERE status = ?';
    args.push(status);
  }
  
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
  const db = getDbClient(c.env);
  
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = crypto.randomUUID().slice(0, 4).toUpperCase();
  const id = `NP-PASS-${dateStr}-${randomStr}`;
  const qrToken = `https://relief-vehicle.pages.dev/pass/${id}`;
  const user = c.get('user') as any;
  
  await db.execute({
    sql: 'INSERT INTO passes (id, application_id, qr_token, issued_by, issuing_authority, valid_from, valid_until, approved_route, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    args: [id, application_id, qrToken, user.id, 'Relief Coordination Center', valid_from, valid_until, approved_route, new Date().toISOString()]
  });
  
  await logAudit(c.env, 'ISSUE_PASS', 'pass', id, user.id, user.role, `Issued pass for application ${application_id}`);
  
  return c.json({ id, qr_token: qrToken, message: 'Pass issued successfully' }, 201);
});

admin.post('/passes/:id/revoke', async (c) => {
  const id = c.req.param('id');
  const { revocation_reason } = await c.req.json();
  const db = getDbClient(c.env);
  const user = c.get('user') as any;
  
  await db.execute({
    sql: 'UPDATE passes SET status = ?, revocation_reason = ?, revoked_at = ?, revoked_by = ? WHERE id = ?',
    args: ['revoked', revocation_reason, new Date().toISOString(), user.id, id]
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

admin.get('/coordination', async (c) => {
  const db = getDbClient(c.env);
  const res = await db.execute('SELECT COUNT(*) as count, status FROM applications GROUP BY status');
  return c.json({ stats: res.rows });
});

admin.get('/audit-logs', async (c) => {
  const db = getDbClient(c.env);
  const res = await db.execute('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100');
  return c.json({ logs: res.rows });
});

export default admin;
