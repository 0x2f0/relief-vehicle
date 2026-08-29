import { useState, useEffect } from 'react';
import { Link, useRouterState, useNavigate, useRouter } from '@tanstack/react-router';
import { useI18n } from '../../lib/i18n';
import { clearAuthSession, getStoredAdminUser } from '../../lib/authSession';
import { Menu, X, ShieldCheck, AlertCircle, LogOut } from 'lucide-react';
import { VehicleLogo } from '../common/VehicleLogo';

export const Header = () => {
  const { t, locale, setLocale } = useI18n();
  const navigate = useNavigate();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ username: string; role?: string } | null>(() => getStoredAdminUser());
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  useEffect(() => {
    const checkAuth = () => {
      setAdminUser(getStoredAdminUser());
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('auth-change', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, [currentPath]);

  const handleSignOut = () => {
    clearAuthSession();
    setAdminUser(null);
    setMenuOpen(false);
    void router.invalidate();
    navigate({ to: '/admin/login', replace: true });
  };

  const navLinks = adminUser
    ? [
        { to: '/', label: t('nav.home') },
        { to: '/roads', label: t('nav.roads') },
        { to: '/admin', label: t('admin.dashboard') },
      ]
    : [
        { to: '/', label: t('nav.home') },
        { to: '/apply', label: t('nav.apply') },
        { to: '/track', label: t('nav.track') },
        { to: '/roads', label: t('nav.roads') },
      ];

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
      {/* Unified Primary Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand & Vehicle Logo */}
          <Link to="/" preload="intent" className="flex items-center space-x-3 text-left focus:outline-none flex-shrink-0">
            <VehicleLogo size="md" />
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider leading-none">
                {t('app.subtitle')}
              </span>
              <span className="text-sm sm:text-base font-bold text-[#0447AF] leading-tight">
                {t('app.title')}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                preload="intent"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive(link.to)
                    ? 'bg-blue-50 text-[#0447AF] font-bold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Controls: Language Switcher, Admin & Mobile Trigger */}
          <div className="flex items-center space-x-2.5">
            {/* Language Switcher */}
            <div className="inline-flex rounded-md border border-slate-200 p-0.5 bg-slate-50">
              <button
                type="button"
                onClick={() => setLocale('ne')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-sm transition-colors ${
                  locale === 'ne'
                    ? 'bg-[#0447AF] text-white shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
                aria-label="नेपाली भाषा"
              >
                नेपाली
              </button>
              <button
                type="button"
                onClick={() => setLocale('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-sm transition-colors ${
                  locale === 'en'
                    ? 'bg-[#0447AF] text-white shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
                aria-label="English Language"
              >
                ENG
              </button>
            </div>

            {/* Admin Avatar or Login */}
            {adminUser ? (
              <div className="hidden sm:flex items-center space-x-1.5">
                <Link
                  to="/admin/dashboard"
                  preload="intent"
                  className="inline-flex items-center space-x-2 px-2.5 py-1 text-xs font-semibold text-[#033685] bg-white border border-blue-200 rounded-full hover:border-[#0447AF] hover:bg-blue-50 transition-all shadow-2xs group"
                  title="Admin Dashboard"
                >
                  <div className="w-5 h-5 rounded-full bg-[#0447AF] text-white flex items-center justify-center text-[10px] font-black uppercase shadow-xs">
                    {(adminUser.username || 'A').replace(/[{}"\\]/g, '').trim().charAt(0) || 'A'}
                  </div>
                  <span className="max-w-[100px] truncate text-[#033685] font-medium hidden sm:inline">
                    {(adminUser.username || 'Admin').replace(/[{}"\\]/g, '').trim() || 'Admin'}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-bold text-white bg-[#CC1424] hover:bg-[#A50E1B] rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t('admin.logout')}</span>
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                preload="intent"
                className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-[#0447AF] transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#0447AF]" />
                <span>{t('nav.admin')}</span>
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5 text-slate-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-md">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              preload="intent"
              onClick={() => setMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                isActive(link.to)
                  ? 'bg-blue-50 text-[#0447AF]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {adminUser ? (
            <div className="pt-2 border-t border-slate-100 mt-2 space-y-1">
              <Link
                to="/admin/dashboard"
                preload="intent"
                onClick={() => setMenuOpen(false)}
                className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-[#033685] bg-blue-50"
              >
                <div className="w-5 h-5 rounded-full bg-[#0447AF] text-white flex items-center justify-center text-xs font-bold uppercase">
                  {(adminUser.username || 'A').replace(/[{}"\\]/g, '').trim().charAt(0) || 'A'}
                </div>
                <span>{(adminUser.username || 'Admin').replace(/[{}"\\]/g, '').trim() || 'Admin'} ({t('nav.admin')})</span>
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-bold text-white bg-[#CC1424]"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('admin.logout')}</span>
              </button>
            </div>
          ) : (
            <Link
              to="/admin/login"
              preload="intent"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {t('nav.admin')}
            </Link>
          )}
        </div>
      )}

      {/* Prominent High-Visibility Emergency Notice */}
      <div className="bg-[#CC1424] text-white py-2.5 shadow-xs border-y border-red-700/50" role="region" aria-label="Emergency Notice">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 text-xs sm:text-sm">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-black bg-white text-[#CC1424] flex-shrink-0 tracking-wider uppercase shadow-2xs">
              <AlertCircle className="w-3.5 h-3.5 mr-1 text-[#CC1424]" />
              {t('home.notice')}
            </span>
            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-white font-medium">
              {t('home.notice.text')}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
