import { Hono } from 'hono';
import { getDbClient } from '../db/client';
import type { Bindings } from '../config';

const passes = new Hono<{ Bindings: Bindings }>();

passes.get('/:id/public', async (c) => {
  const id = c.req.param('id');
  const db = getDbClient(c.env);
  
  const res = await db.execute({
    sql: 'SELECT * FROM passes WHERE id = ?',
    args: [id]
  });

  if (res.rows.length === 0) {
    return c.json({ error: 'Pass not found' }, 404);
  }

  const pass = res.rows[0];
  if (pass.status !== 'active') {
    return c.json({ error: 'Pass is not active', status: pass.status }, 400);
  }

  return c.json({ pass });
});

export default passes;
