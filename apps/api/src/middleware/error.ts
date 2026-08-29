import { Context } from 'hono';

export async function errorHandler(err: Error, c: Context) {
  console.error(err);
  return c.json({ error: 'Internal Server Error', message: err.message }, 500);
}
