import { useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Lock, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { VehicleLogo } from '../common/VehicleLogo';

export function Navbar() {
  const routerState = useRouterState();
  const location = routerState.location;
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Apply E-Pass', path: '/apply' },
    { name: 'Track Status', path: '/track' },
    { name: 'Roads & Hazards', path: '/roads' },
    { name: 'Checkpoint Scanner', path: '/scanner' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <VehicleLogo size="md" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-red-400">DISASTER RELIEF</span>
              </div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                Nepal Disaster Relief Vehicle E-Pass
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
                  isActive(link.path)
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Admin / Officer / Auth Area */}
          <div className="hidden lg:flex items-center gap-2.5">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={isAdmin ? '/admin/dashboard' : '/scanner'}
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-md text-xs font-medium text-slate-200 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{user?.username?.split(' ')[0]} ({user?.role === 'superadmin' ? 'SuperAdmin' : user?.role === 'district_admin' ? 'District Admin' : 'Officer'})</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="bg-red-700 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
                  >
                    Admin Console
                  </Link>
                )}
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-md text-xs font-semibold transition-all hover:border-slate-600"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Authorized Staff Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-400 hover:text-white p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu modal */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 pt-2 pb-4 space-y-1 shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-semibold ${
                isActive(link.path)
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-800">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-red-700 text-white py-2 rounded-md text-xs font-bold"
                >
                  Admin Console ({user?.username})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-center bg-slate-900 border border-slate-700 text-slate-300 py-2 rounded-md text-xs font-semibold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center bg-slate-900 border border-slate-700 text-slate-200 py-2 rounded-md text-xs font-bold"
              >
                Authorized Staff Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
