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

export function getStoredAdminUser(): { username: string; role?: string } | null {
  if (typeof window === 'undefined') return null;
  const token = getAuthToken();
  if (!token) return null;
  const username = localStorage.getItem('adminUsername');
  const storedUser = localStorage.getItem('adminUser') || localStorage.getItem('relief_user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch {
      return { username: username || 'admin' };
    }
  }
  return { username: username || 'admin' };
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
