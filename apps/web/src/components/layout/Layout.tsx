import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../../lib/i18n';
import { Header } from './Header';
import { Footer } from './Footer';

export const Layout = ({ children }: { children: ReactNode }) => {
  const { t, locale } = useI18n();
  const location = useLocation();

  useEffect(() => {
    const brand = t('nav.brand');
    const path = location.pathname;

    let pageTitle = '';
    if (path === '/') {
      pageTitle = t('nav.home');
    } else if (path.startsWith('/apply')) {
      pageTitle = t('nav.apply');
    } else if (path.startsWith('/track')) {
      pageTitle = t('nav.track');
    } else if (path.startsWith('/roads')) {
      pageTitle = t('roads.title');
    } else if (path.startsWith('/verify')) {
      pageTitle = t('scanner.title');
    } else if (path === '/admin') {
      pageTitle = t('admin.dashboard');
    } else if (path.startsWith('/admin/login')) {
      pageTitle = t('admin.login');
    } else if (path.startsWith('/pass')) {
      pageTitle = t('nav.verify');
    } else if (path.startsWith('/coordination')) {
      pageTitle = t('admin.dashboard');
    }

    if (pageTitle) {
      document.title = `${pageTitle} | ${brand}`;
    } else {
      document.title = `${t('app.title')} | ${brand}`;
    }
  }, [location.pathname, locale, t]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {children}
      </main>
      <Footer />
    </div>
  );
};
