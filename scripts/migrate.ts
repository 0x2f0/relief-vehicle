import { createClient } from '@libsql/client';
import { schema } from '../apps/api/src/db/schema';

function normalizeDbUrl(rawUrl?: string): string {
  let url = (rawUrl || '').trim();
  if (!url) return 'file:local.db';
  if (url.startsWith('turso://')) {
    url = url.replace(/^turso:\/\//, 'libsql://');
  } else if (url.startsWith('turso:')) {
    url = url.replace(/^turso:/, 'libsql:');
  }
  return url;
}

let dbUrl = normalizeDbUrl(process.env.TURSO_URL || process.env.TURSO_DATABASE_URL);
let dbToken = (process.env.TURSO_AUTH_TOKEN || '').trim();

if ((dbUrl.startsWith('libsql:') || dbUrl.startsWith('https:')) && !dbToken) {
  console.warn(`[DB] Remote database URL provided without TURSO_AUTH_TOKEN. Falling back to local database (file:local.db).`);
  dbUrl = 'file:local.db';
}

async function migrate() {
  let activeDb = createClient({ url: dbUrl, authToken: dbToken });
  console.log(`Running migrations against ${dbUrl}...`);

  try {
    try {
      await activeDb.execute('SELECT 1');
    } catch (connErr: any) {
      if (dbUrl !== 'file:local.db') {
        console.warn(`[DB] Connection to ${dbUrl} failed (${connErr.message}). Falling back to local database (file:local.db)...`);
        dbUrl = 'file:local.db';
        activeDb = createClient({ url: 'file:local.db' });
        await activeDb.execute('SELECT 1');
      } else {
        throw connErr;
      }
    }

    const statements = schema
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      await activeDb.execute(statement);
    }

    console.log("Migrations completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();

