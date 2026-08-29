import { useState, useEffect, useCallback } from 'react';
import { User } from '../lib/types';
import { api } from '../lib/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('relief_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('relief_auth_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    localStorage.removeItem('relief_auth_token');
    localStorage.removeItem('relief_user');
    setToken(null);
    setUser(null);
  }, []);

  const checkAuth = useCallback(async () => {
    const currentToken = localStorage.getItem('relief_auth_token');
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.getMe();
      setUser(res);
      localStorage.setItem('relief_user', JSON.stringify(res));
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    checkAuth();
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
