import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useI18n } from '../lib/i18n';
import { adminLogin } from '../lib/api';
import { prefetchAdminData } from '../lib/queryClient';
import { Lock, User, AlertCircle, Loader2, Shield } from 'lucide-react';
import { VehicleLogo } from '../components/common/VehicleLogo';

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
        prefetchAdminData();
        navigate({ to: '/admin' });
      } else {
        throw new Error('Invalid response');
      }
    } catch (err: any) {
      setError(err.message || t('admin.authFailed'));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FF] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Sovereignty Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <VehicleLogo size="xl" className="shadow-lg" />
          </div>
          <p className="text-[11px] font-bold text-[#CC1424] uppercase tracking-[0.18em] mb-1">
            {t('admin.dept')}
          </p>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            {t('admin.title')}
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">
            {t('admin.subTitle')}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-7 space-y-5">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-[#CC1424]">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                {t('admin.username')} <span className="text-[#CC1424]">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('admin.usernamePlaceholder')}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-[#0447AF] focus:ring-2 focus:ring-[#0447AF]/15 bg-white font-medium transition-shadow outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                {t('admin.password')} <span className="text-[#CC1424]">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('admin.passwordPlaceholder')}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-[#0447AF] focus:ring-2 focus:ring-[#0447AF]/15 bg-white font-medium transition-shadow outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#0447AF] hover:bg-[#033685] active:bg-[#022d6e] text-white py-3 rounded-xl text-sm font-bold transition-all shadow-sm shadow-[#0447AF]/25 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
              <span>{loading ? t('admin.loggingIn') : t('admin.loginBtn')}</span>
            </button>
          </form>

          {/* Security Advisory */}
          <div className="pt-1">
            <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-xs mt-0.5">🔒</span>
              <div>
                <p className="text-[11px] font-semibold text-slate-600">{t('admin.securityAdvisory')}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{t('admin.securityWarning')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-slate-400 mt-5 font-medium">
          Disaster Relief Vehicle E-Pass System
        </p>
      </div>
    </div>
  );
};
