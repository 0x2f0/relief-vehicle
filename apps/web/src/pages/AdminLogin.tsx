import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useI18n } from '../lib/i18n';
import { adminLogin } from '../lib/api';
import { prefetchAdminData } from '../lib/queryClient';
import { Lock, User, AlertCircle, Loader2, Shield } from 'lucide-react';

export const AdminLogin = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setLoading(true);
    setError('');

    try {
      const res = await adminLogin(username.trim(), password);
      if (res && res.token) {
        localStorage.setItem('adminToken', res.token);
        localStorage.setItem('token', res.token);
        localStorage.setItem('relief_auth_token', res.token);
        const usernameVal = res.user?.username || username.trim();
        localStorage.setItem('adminUsername', usernameVal);
        localStorage.setItem('adminUser', JSON.stringify(res.user || { username: usernameVal, role: 'superadmin' }));
        localStorage.setItem('relief_user', JSON.stringify(res.user || { username: usernameVal, role: 'superadmin' }));
        window.dispatchEvent(new Event('auth-change'));

        // Prefetch admin cache in background
        prefetchAdminData();

        // Route based on role
        if (res.user?.role === 'checkpoint_officer') {
          navigate({ to: '/admin' });
        } else {
          navigate({ to: '/admin' });
        }
      } else {
        throw new Error('Invalid response');
      }
    } catch (err: any) {
      setError(err.message || t('admin.authFailed'));
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-6 sm:my-10">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
        {/* Header with National Emblem */}
        <div className="text-center space-y-3">
          <img
            src="https://giwmscdnone.gov.np/static/assets/image/Emblem_of_Nepal.png"
            alt="Government of Nepal Emblem"
            className="h-16 w-auto mx-auto object-contain"
          />
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
              {t('admin.dept')}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('admin.title')}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {t('admin.subTitle')}
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl flex items-start space-x-2.5 text-xs text-[#CC1424]">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('admin.username')} <span className="text-[#CC1424]">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('admin.usernamePlaceholder')}
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF] bg-white font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('admin.password')} <span className="text-[#CC1424]">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('admin.passwordPlaceholder')}
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF] bg-white font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center space-x-2 bg-[#0447AF] hover:bg-[#033685] text-white py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-2xs disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Shield className="w-4 h-4" />
            )}
            <span>{loading ? t('admin.loggingIn') : t('admin.loginBtn')}</span>
          </button>
        </form>

        {/* Official Security Advisory */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
          <span className="text-[11px] font-semibold text-slate-600 block">
            🔒 {t('admin.securityAdvisory')}
          </span>
          <p className="text-[10px] text-slate-400 leading-normal">
            {t('admin.securityWarning')}
          </p>
        </div>
      </div>
    </div>
  );
};
