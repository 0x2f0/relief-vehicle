import { Hono } from 'hono';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/error';
import { runMigrations } from './db/migrations';
import type { Bindings } from './config';

import auth from './routes/auth';
import applications from './routes/applications';
import passes from './routes/passes';
import verify from './routes/verify';
import admin from './routes/admin';
import { roads, adminRoads } from './routes/roads';
import coordination from './routes/coordination';

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', corsMiddleware);
app.onError(errorHandler);

app.post('/migrate', async (c) => {
  await runMigrations(c.env);
  return c.json({ message: 'Migrations ran successfully' });
});

app.route('/api/auth', auth);
app.route('/api/applications', applications);
app.route('/api/passes', passes);
app.route('/api/verify', verify);
app.route('/api/admin', admin);
app.route('/api/roads', roads);
app.route('/api/admin/roads', adminRoads);
app.route('/api/public/stats', coordination); 

app.get('/', (c) => {
  return c.json({ message: 'Relief Vehicle E-Pass API' });
});

export default app;
