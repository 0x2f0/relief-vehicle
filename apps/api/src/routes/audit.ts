import { Hono } from 'hono';
import type { Bindings, Variables } from '../config';
import { getDbClient } from '../db/client';
import { authMiddleware } from '../middleware/auth';

export const auditRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

auditRouter.get('/', authMiddleware, async (c) => {
  const client = getDbClient(c.env);
  const entityType = c.req.query('entity_type');
  const search = c.req.query('search')?.trim().toLowerCase();
  const limit = parseInt(c.req.query('limit') || '100', 10);

  let query = 'SELECT * FROM audit_logs WHERE 1=1';
  const args: (string | number)[] = [];

  if (entityType) {
    query += ' AND entity_type = ?';
    args.push(entityType);
  }

  if (search) {
    query += ' AND (LOWER(entity_id) LIKE ? OR LOWER(actor_name) LIKE ? OR LOWER(action) LIKE ?)';
    args.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY timestamp DESC LIMIT ?';
  args.push(limit);

  const result = await client.execute({ sql: query, args });
  return c.json({ logs: result.rows });
});
