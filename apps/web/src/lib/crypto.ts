export interface OfflineDecodedToken {
  passId: string;
  appId: string;
  vehicle: string;
  driver: string;
  org: string;
  route: string;
  validFrom: string;
  validUntil: string;
  priority: string;
  issuingAuth: string;
}

export function parseOfflineQrToken(tokenString: string): {
  validFormat: boolean;
  isExpired: boolean;
  data?: OfflineDecodedToken;
  error?: string;
} {
  try {
    const trimmed = tokenString.trim();
    if (!trimmed.includes('.')) {
      return { validFormat: false, isExpired: false, error: 'Standard plain ID (requires online lookup)' };
    }

    const [payloadB64] = trimmed.split('.');
    let base64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }

    const jsonStr = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const data: OfflineDecodedToken = JSON.parse(jsonStr);
    const now = new Date().toISOString();
    const isExpired = Boolean(data.validUntil && data.validUntil < now);

    return {
      validFormat: true,
      isExpired,
      data,
    };
  } catch (err) {
    return {
      validFormat: false,
      isExpired: false,
      error: 'Could not parse cryptographic payload',
    };
  }
}
