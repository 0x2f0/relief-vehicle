import { getDbClient } from './client';
import { schema } from './schema';
import { hashPassword } from '../routes/auth';
import type { Bindings } from '../config';

export async function runMigrations(env: Bindings) {
  const db = getDbClient(env);
  const statements = schema
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  
  for (const stmt of statements) {
    try {
      await db.execute(stmt);
    } catch {}
  }

  // Ensure user columns exist
  const userColumns = ['full_name', 'checkpoint_name', 'badge_number', 'phone'];
  for (const col of userColumns) {
    try {
      await db.execute(`ALTER TABLE users ADD COLUMN ${col} TEXT`);
    } catch {}
  }

  // Seed default checkpoints if empty
  try {
    const cpRes = await db.execute('SELECT COUNT(*) as count FROM checkpoints');
    const cpCount = Number(cpRes.rows[0]?.count || 0);
    if (cpCount === 0) {
      const now = new Date().toISOString();
      const defaultCheckpoints = [
        { id: 'CP-DOLALGHAT', name: 'Dolalghat Transit Checkpoint', location: 'Dolalghat Bridge', district: 'Kavrepalanchok', highway: 'Araniko Highway (H03)' },
        { id: 'CP-NAGDHUNGA', name: 'Nagdhunga Main Checkpoint', location: 'Nagdhunga Pass', district: 'Kathmandu', highway: 'Tribhuvan Highway (H02)' },
        { id: 'CP-MELAMCHI', name: 'Melamchi Relief Post', location: 'Melamchi Bazar', district: 'Sindhupalchok', highway: 'Helambu Corridor' },
        { id: 'CP-MALEKHU', name: 'Malekhu Highway Station', location: 'Malekhu Junction', district: 'Dhading', highway: 'Prithvi Highway (H04)' },
        { id: 'CP-BAHRABISE', name: 'Bahrabise Transit Station', location: 'Bahrabise Town', district: 'Sindhupalchok', highway: 'Kodari Highway (H03)' },
      ];
      for (const cp of defaultCheckpoints) {
        await db.execute({
          sql: 'INSERT INTO checkpoints (id, name, location, district, highway, is_active, created_at) VALUES (?, ?, ?, ?, ?, 1, ?)',
          args: [cp.id, cp.name, cp.location, cp.district, cp.highway, now],
        });
      }
    }
  } catch {}

  // Seed default superadmin and default duty officer if users table is empty or missing admin
  try {
    const adminCheck = await db.execute({
      sql: 'SELECT * FROM users WHERE username = ?',
      args: ['admin'],
    });
    if (adminCheck.rows.length === 0) {
      const pwd = await hashPassword('admin123');
      await db.execute({
        sql: 'INSERT INTO users (id, username, password_hash, role, full_name, checkpoint_name, badge_number, phone, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        args: ['USR-ADMIN-01', 'admin', pwd, 'superadmin', 'National Emergency Controller', 'Central Command Center', 'HQ-001', '1149', new Date().toISOString()],
      });
    }

    const officerCheck = await db.execute({
      sql: 'SELECT * FROM users WHERE username = ?',
      args: ['officer_dolalghat'],
    });
    if (officerCheck.rows.length === 0) {
      const pwd = await hashPassword('officer123');
      await db.execute({
        sql: 'INSERT INTO users (id, username, password_hash, role, full_name, checkpoint_name, badge_number, phone, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        args: ['USR-OFFICER-01', 'officer_dolalghat', pwd, 'checkpoint_officer', 'Insp. B. Thapa', 'Dolalghat Transit Checkpoint', 'NP-POL-4410', '9851000001', new Date().toISOString()],
      });
    }

    const govCheck = await db.execute({
      sql: 'SELECT * FROM users WHERE username = ?',
      args: ['gov_officer1'],
    });
    if (govCheck.rows.length === 0) {
      const pwd = await hashPassword('gov123');
      await db.execute({
        sql: 'INSERT INTO users (id, username, password_hash, role, full_name, checkpoint_name, badge_number, phone, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        args: ['USR-GOV-01', 'gov_officer1', pwd, 'gov_officer', 'Under Secretary K. Sharma', 'Ministry Operations Desk', 'GOV-7701', '9851122334', new Date().toISOString()],
      });
    }
  } catch {}
}
