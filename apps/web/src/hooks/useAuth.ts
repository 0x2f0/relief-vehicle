import { useState, useEffect, useCallback } from 'react';
import { User } from '../lib/types';
import { api } from '../lib/api';
import { clearAuthSession, getAuthToken } from '../lib/authSession';

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('relief_user') || localStorage.getItem('adminUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => getAuthToken());
  const [loading, setLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    clearAuthSession();
    setToken(null);
    setUser(null);
  }, []);

  const checkAuth = useCallback(async () => {
    const currentToken = getAuthToken();
    if (!currentToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.getMe();
      setUser(res);
      setToken(currentToken);
      localStorage.setItem('relief_user', JSON.stringify(res));
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    checkAuth();
    const sync = () => {
      const currentToken = getAuthToken();
      if (!currentToken) {
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }
      void checkAuth();
    };
    window.addEventListener('auth-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('auth-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, [checkAuth]);

  const loginSuccess = (newToken: string, newUser: User) => {
    localStorage.setItem('relief_auth_token', newToken);
    localStorage.setItem('relief_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  return {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    isAdmin: user?.role === 'superadmin' || user?.role === 'district_admin',
    isOfficer: user?.role === 'checkpoint_officer' || user?.role === 'superadmin',
    loginSuccess,
    logout,
    refreshUser: checkAuth,
  };
}
