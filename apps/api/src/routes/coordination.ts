import { Hono } from 'hono';
import { getDbClient } from '../db/client';
import type { Bindings } from '../config';

const coordination = new Hono<{ Bindings: Bindings }>();

const handleStats = async (c: any) => {
  try {
    const db = getDbClient(c.env);
    const passesRes = await db.execute({
      sql: 'SELECT COUNT(*) as count FROM passes WHERE status = ?',
      args: ['active'],
    });
    const appsApprovedRes = await db.execute({
      sql: "SELECT COUNT(*) as count FROM applications WHERE status IN ('approved', 'issued', 'active')",
      args: [],
    });
    const appsTotalRes = await db.execute('SELECT COUNT(*) as count FROM applications');
    const roadsRes = await db.execute('SELECT COUNT(*) as count FROM road_conditions');
    const scansRes = await db.execute('SELECT COUNT(*) as count FROM checkpoint_scans');

    const activePasses = Number(passesRes.rows[0]?.count ?? 0);
    const approvedApps = Number(appsApprovedRes.rows[0]?.count ?? 0);
    const totalApps = Number(appsTotalRes.rows[0]?.count ?? 0);
    const roadUpdates = Number(roadsRes.rows[0]?.count ?? 0);
    const checkpointScans = Number(scansRes.rows[0]?.count ?? 0);

    return c.json({
      activePasses,
      approvedApplications: approvedApps > 0 ? approvedApps : totalApps,
      roadUpdates,
      checkpointScans,
      total_active_passes: activePasses,
      total_applications: totalApps,
      total_scans: checkpointScans,
      total_roads: roadUpdates,
    });
  } catch (err: any) {
    return c.json({
      activePasses: 0,
      approvedApplications: 0,
      roadUpdates: 0,
      checkpointScans: 0,
      total_active_passes: 0,
      total_applications: 0,
      total_scans: 0,
      total_roads: 0,
    });
  }
};

coordination.get('/', handleStats);
coordination.get('/stats', handleStats);

export default coordination;

