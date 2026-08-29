const AUTH_STORAGE_KEYS = [
  'adminToken',
  'relief_auth_token',
  'token',
  'adminUser',
  'adminUsername',
  'relief_user',
] as const;

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token =
    localStorage.getItem('adminToken') ||
    localStorage.getItem('relief_auth_token') ||
    localStorage.getItem('token');
  const trimmed = token?.trim();
  return trimmed ? trimmed : null;
}

export function getStoredAdminUser(): { username: string; full_name?: string; role?: string } | null {
  if (typeof window === 'undefined') return null;
  const token = getAuthToken();
  if (!token) return null;

  let rawUsername = localStorage.getItem('adminUsername') || '';
  const storedUser = localStorage.getItem('adminUser') || localStorage.getItem('relief_user');

  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      if (parsed && typeof parsed === 'object') {
        const u = parsed.user || parsed;
        let uname = u.username || u.full_name || rawUsername || 'admin';
        if (typeof uname === 'string' && uname.trim().startsWith('{')) {
          try {
            const nested = JSON.parse(uname);
            uname = nested.username || nested.full_name || 'admin';
          } catch {}
        }
        return {
          username: String(uname).replace(/[{}"\\]/g, '').trim() || 'admin',
          full_name: u.full_name,
          role: u.role || parsed.role || 'admin',
        };
      }
    } catch {}
  }

  if (rawUsername.trim().startsWith('{')) {
    try {
      const nested = JSON.parse(rawUsername);
      rawUsername = nested.username || nested.full_name || 'admin';
    } catch {
      rawUsername = 'admin';
    }
  }

  return { username: rawUsername ? rawUsername.replace(/[{}"\\]/g, '').trim() || 'admin' : 'admin' };
}

export function isStaffSession(): boolean {
  return Boolean(getAuthToken());
}

export function clearAuthStorage() {
  if (typeof window === 'undefined') return;
  for (const key of AUTH_STORAGE_KEYS) {
    localStorage.removeItem(key);
  }
  window.dispatchEvent(new Event('auth-change'));
}
