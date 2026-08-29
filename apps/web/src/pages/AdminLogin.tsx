import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { adminLogin } from '../lib/api';
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

        // Route based on role
        if (res.user?.role === 'checkpoint_officer') {
          navigate('/verify');
        } else {
          navigate('/admin');
        }
      } else {
        throw new Error('प्रमाणीकरण असफल भयो / Authentication failed');
      }
    } catch (err: any) {
      setError(
        err.message || 'प्रयोगकर्ता नाम वा पासवर्ड मिलेन / Invalid username or password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 sm:mt-10 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200">
        {/* Header */}
        <div className="text-center mb-6">
          <img
            src="https://giwmscdnone.gov.np/static/assets/image/Emblem_of_Nepal.png"
            alt="Government Emblem"
            className="h-16 w-auto mx-auto mb-3"
          />
          <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block">
            {t('app.subtitle')}
          </span>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">
            {t('admin.login')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t('admin.portalDesc')}
          </p>
        </div>

        {error && (
          <div
            className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2.5 text-xs text-red-800"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 text-[#CC1424] flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('admin.username')} <span className="text-[#CC1424]">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                required
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('admin.usernamePlaceholder')}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF] bg-white font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('admin.password')} <span className="text-[#CC1424]">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                required
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('admin.passwordPlaceholder')}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF] bg-white font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center space-x-2 bg-[#0447AF] hover:bg-[#033685] text-white py-2.5 rounded-lg text-sm font-bold transition-colors shadow-xs disabled:opacity-50 mt-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{loading ? t('admin.loggingIn') : t('admin.loginBtn')}</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center space-x-1.5 text-xs text-slate-500">
          <Shield className="w-3.5 h-3.5 text-[#0447AF]" />
          <span>{t('admin.secureGateway')}</span>
        </div>
      </div>
    </div>
  );
};


