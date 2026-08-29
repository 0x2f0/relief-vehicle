import { createClient, Client } from '@libsql/client/web';
import type { Bindings } from '../config';

export function normalizeDbUrl(rawUrl?: string): string {
  let url = (rawUrl || '').trim();
  if (!url) return 'https://relief-vehicle-srjreg.aws-ap-south-1.turso.io';
  if (url.startsWith('turso://')) {
    url = url.replace(/^turso:\/\//, 'https://');
  } else if (url.startsWith('turso:')) {
    url = url.replace(/^turso:/, 'https:');
  } else if (url.startsWith('libsql://')) {
    url = url.replace(/^libsql:\/\//, 'https://');
  }
  return url;
}

export function getDbClient(env?: Bindings): Client {
  const url = normalizeDbUrl(env?.TURSO_URL || env?.TURSO_DATABASE_URL);
  const authToken = (env?.TURSO_AUTH_TOKEN || '').trim();
  return createClient({
    url,
    authToken,
  });
}
