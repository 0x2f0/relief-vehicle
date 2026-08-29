import type { JWTPayload } from 'jose';

export type Bindings = {
  TURSO_URL?: string;
  TURSO_DATABASE_URL?: string;
  TURSO_AUTH_TOKEN?: string;
  JWT_SECRET?: string;
  HMAC_SECRET?: string;
  QR_SECRET_KEY?: string;
  CORS_ORIGIN?: string;
  ENVIRONMENT?: string;
};

export type Variables = {
  user: JWTPayload & {
    id?: string;
    role?: string;
    username?: string;
    full_name?: string;
    checkpoint_name?: string;
    badge_number?: string;
    district?: string;
  };
};

export const DEFAULT_JWT_SECRET = 'relief-vehicle-jwt-secret-key-2026';
export const DEFAULT_HMAC_SECRET = 'relief-vehicle-hmac-secret-key-2026';
