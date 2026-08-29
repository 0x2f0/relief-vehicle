import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../../lib/i18n';
import { isUserAuthorizedForTracking } from '../../lib/authTracker';
import { Menu, X, ShieldCheck, AlertCircle } from 'lucide-react';

export const Header = () => {
  const { t, locale, setLocale } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ username: string; role?: string } | null>(null);
  const [hasTrackingAccess, setHasTrackingAccess] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('relief_auth_token') || localStorage.getItem('token');
      const username = localStorage.getItem('adminUsername');
      const storedUser = localStorage.getItem('adminUser') || localStorage.getItem('relief_user');
      if (token) {
        if (storedUser) {
          try {
            setAdminUser(JSON.parse(storedUser));
          } catch {
            setAdminUser({ username: username || 'admin' });
          }
        } else {
          setAdminUser({ username: username || 'admin' });
        }
      } else {
        setAdminUser(null);
      }
      setHasTrackingAccess(isUserAuthorizedForTracking());
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('auth-change', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, [location.pathname]);

  const navLinks = adminUser
    ? [
        { to: '/', label: t('nav.home') },
        { to: '/roads', label: t('nav.roads') },
        { to: '/admin', label: t('admin.dashboard') },
      ]
    : [
        { to: '/', label: t('nav.home') },
        { to: '/apply', label: t('nav.apply') },
        ...(hasTrackingAccess ? [{ to: '/track', label: t('nav.track') }] : []),
        { to: '/roads', label: t('nav.roads') },
      ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
      {/* Unified Primary Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand & Emblem */}
          <Link to="/" className="flex items-center space-x-3 text-left focus:outline-none flex-shrink-0">
            <img
              src="https://giwmscdnone.gov.np/static/assets/image/Emblem_of_Nepal.png"
              alt="Government of Nepal Emblem"
              className="h-11 sm:h-12 w-auto object-contain flex-shrink-0"
            />
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive(link.to)
                    ? 'bg-blue-50 text-[#0447AF] font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
                    : 'text-slate-600 hover:text-slate-900'
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
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-label="English Language"
              >
                ENG
              </button>
            </div>

            {/* Admin Avatar or Login */}
            {adminUser ? (
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center space-x-2 px-2.5 py-1 text-xs font-semibold text-slate-800 bg-white border border-blue-200 rounded-full hover:border-[#0447AF] hover:bg-blue-50/60 transition-all shadow-2xs group"
                title="Admin Dashboard"
              >
                <div className="w-5 h-5 rounded-full bg-[#0447AF] text-white flex items-center justify-center text-[10px] font-black uppercase shadow-xs">
                  {adminUser.username.charAt(0)}
                </div>
                <span className="max-w-[90px] truncate text-slate-800 font-medium hidden sm:inline">
                  {adminUser.username}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
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
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
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
            <div className="pt-2 border-t border-slate-100 mt-2">
              <Link
                to="/admin/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-900 bg-blue-50/70"
              >
                <div className="w-5 h-5 rounded-full bg-[#0447AF] text-white flex items-center justify-center text-xs font-bold uppercase">
                  {adminUser.username.charAt(0)}
                </div>
                <span>{adminUser.username} ({t('nav.admin')})</span>
              </Link>
            </div>
          ) : (
            <Link
              to="/admin/login"
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

