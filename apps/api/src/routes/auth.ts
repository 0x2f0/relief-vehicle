import { Hono } from 'hono';
import { SignJWT } from 'jose';
import { getDbClient } from '../db/client';
import { authMiddleware } from '../middleware/auth';
import type { Bindings, Variables } from '../config';

const auth = new Hono<{ Bindings: Bindings; Variables: Variables }>();

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

export async function hashPassword(password: string, saltHex?: string): Promise<string> {
  const salt = saltHex ? hexToBytes(saltHex) : crypto.getRandomValues(new Uint8Array(16));
  const enc = new TextEncoder().encode(password);

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: toArrayBuffer(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  const derivedHex = Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const saltOut = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return `pbkdf2$100000$${saltOut}$${derivedHex}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!storedHash) return false;

  // PBKDF2 format
  if (storedHash.startsWith('pbkdf2$')) {
    const parts = storedHash.split('$');
    if (parts.length === 4) {
      const saltHex = parts[2];
      const targetHash = parts[3];
      const computed = await hashPassword(password, saltHex);
      const computedTarget = computed.split('$')[3];
      return computedTarget === targetHash;
    }
  }

  // SHA-256 format fallback
  const enc = new TextEncoder().encode(password);
  const hashBuf = await crypto.subtle.digest('SHA-256', enc);
  const sha256Hex = Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return storedHash === sha256Hex || storedHash === password;
}

auth.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const { username, password } = body;

    if (!username || !password) {
      return c.json({ error: 'Username and password are required' }, 400);
    }

    const db = getDbClient(c.env);
    const res = await db.execute({
      sql: 'SELECT * FROM users WHERE username = ?',
      args: [username.trim()],
    });

    if (res.rows.length === 0) {
      return c.json({ error: 'Invalid username or password' }, 401);
    }

    const user = res.rows[0];
    const isPasswordValid = await verifyPassword(password, user.password_hash as string);

    if (!isPasswordValid) {
      return c.json({ error: 'Invalid username or password' }, 401);
    }

    const jwtSecret = c.env?.JWT_SECRET || 'relief-vehicle-jwt-secret-key-2026';
    const secret = new TextEncoder().encode(jwtSecret);

    const token = await new SignJWT({
      id: user.id as string,
      role: user.role as string,
      username: user.username as string,
      full_name: (user.full_name as string) || undefined,
      checkpoint_name: (user.checkpoint_name as string) || undefined,
      badge_number: (user.badge_number as string) || undefined,
      district: (user.district as string) || undefined,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret);

    return c.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        full_name: user.full_name || user.username,
        checkpoint_name: user.checkpoint_name || 'Dolalghat Transit Checkpoint',
        badge_number: user.badge_number || '',
        phone: user.phone || '',
        district: user.district,
      },
    });
  } catch (err: any) {
    return c.json({ error: err.message || 'Authentication failed' }, 500);
  }
});

auth.get('/me', authMiddleware, async (c) => {
  const user = c.get('user');
  return c.json({ user });
});

export default auth;

