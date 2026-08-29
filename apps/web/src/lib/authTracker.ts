export interface StoredPass {
  id: string;
  token: string;
  vehicle?: string;
  route?: string;
  timestamp?: string;
}

const PASSES_KEY = 'my_relief_passes';

export function getStoredPasses(): StoredPass[] {
  try {
    const list = JSON.parse(localStorage.getItem(PASSES_KEY) || '[]');
    if (Array.isArray(list) && list.length > 0) return list;
  } catch {}

  // Fallback: scan any token_* keys in localStorage
  const passes: StoredPass[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('token_')) {
      const id = key.replace('token_', '');
      const token = localStorage.getItem(key) || '';
      if (id && token) {
        passes.push({ id, token });
      }
    }
  }
  return passes;
}

export function saveStoredPass(pass: StoredPass): void {
  const current = getStoredPasses();
  const filtered = current.filter((p) => p.id !== pass.id);
  filtered.unshift(pass);
  localStorage.setItem(PASSES_KEY, JSON.stringify(filtered));
  localStorage.setItem(`token_${pass.id}`, pass.token);
  window.dispatchEvent(new Event('auth-change'));
  window.dispatchEvent(new Event('storage'));
}

export function isUserAuthorizedForTracking(): boolean {
  // 1. Is user an authenticated admin/officer?
  const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('relief_auth_token') || localStorage.getItem('token');
  if (adminToken) return true;

  // 2. Does user have valid application credentials in localStorage?
  const passes = getStoredPasses();
  if (passes.length > 0) return true;

  return false;
}
