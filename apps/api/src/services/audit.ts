import { getDbClient } from '../db/client';
import type { Bindings } from '../config';

export async function logAudit(
  env: Bindings,
  action: string,
  entityType: string,
  entityId: string,
  actorId: string,
  actorRole: string,
  details: string
) {
  const db = getDbClient(env);
  const id = crypto.randomUUID();
  await db.execute({
    sql: 'INSERT INTO audit_logs (id, action, entity_type, entity_id, actor_id, actor_role, details, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    args: [id, action, entityType, entityId, actorId, actorRole, details, new Date().toISOString()]
  });
}
