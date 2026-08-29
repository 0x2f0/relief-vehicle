import { Hono } from 'hono';
import { getDbClient } from '../db/client';
import type { Bindings } from '../config';

const checkpoints = new Hono<{ Bindings: Bindings }>();

checkpoints.get('/', async (c) => {
  try {
    const db = getDbClient(c.env);
    const res = await db.execute('SELECT * FROM checkpoints ORDER BY name ASC');
    return c.json({ checkpoints: res.rows });
  } catch {
    return c.json({ checkpoints: [] });
  }
});

export default checkpoints;
