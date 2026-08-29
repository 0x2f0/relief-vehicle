import { Hono } from 'hono';
import { getDbClient } from '../db/client';
import { authMiddleware } from '../middleware/auth';
import type { Bindings } from '../config';

const roads = new Hono<{ Bindings: Bindings }>();

roads.get('/', async (c) => {
  const db = getDbClient(c.env);
  const res = await db.execute('SELECT * FROM road_conditions ORDER BY updated_at DESC');
  return c.json({ roads: res.rows });
});

const adminRoads = new Hono<{ Bindings: Bindings }>();
adminRoads.use('*', authMiddleware);

adminRoads.post('/', async (c) => {
  const { road_name, status, description } = await c.req.json();
  const db = getDbClient(c.env);
  const user = c.get('user') as any;
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  
  await db.execute({
    sql: 'INSERT INTO road_conditions (id, road_name, status, description, reported_by, reported_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [id, road_name, status, description, user.id, now, now]
  });
  
  return c.json({ id, message: 'Road condition added' }, 201);
});

adminRoads.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const db = getDbClient(c.env);
  await db.execute({ sql: 'DELETE FROM road_conditions WHERE id = ?', args: [id] });
  return c.json({ message: 'Road condition removed' });
});

export { roads, adminRoads };
