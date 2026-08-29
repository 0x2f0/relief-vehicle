import { ReactNode, useEffect } from 'react';
import { useRouterState, Outlet } from '@tanstack/react-router';
import { useI18n } from '../../lib/i18n';
import { Header } from './Header';
import { Footer } from './Footer';
import { GlobalLoadingBar } from '../common/Skeleton';

export const Layout = ({ children }: { children?: ReactNode }) => {
  const { t, locale } = useI18n();
  const routerState = useRouterState();
  const path = routerState.location.pathname;

  useEffect(() => {
    const brand = t('nav.brand');

    let pageTitle = '';
    if (path === '/') {
      pageTitle = t('nav.home');
    } else if (path.startsWith('/apply')) {
      pageTitle = t('nav.apply');
    } else if (path.startsWith('/track')) {
      pageTitle = t('nav.track');
    } else if (path.startsWith('/roads')) {
      pageTitle = t('roads.title');
    } else if (path.startsWith('/verify') || path.startsWith('/scanner')) {
      pageTitle = t('scanner.title');
    } else if (path === '/admin' || path.startsWith('/admin/dashboard')) {
      pageTitle = t('admin.dashboard');
    } else if (path.startsWith('/admin/audit')) {
      pageTitle = t('admin.auditLogs');
    } else if (path.startsWith('/coordination') || path.startsWith('/admin/coordination')) {
      pageTitle = t('admin.coordination');
    } else if (path.startsWith('/admin/login')) {
      pageTitle = t('admin.login');
    } else if (path.startsWith('/pass')) {
      pageTitle = t('nav.verify');
    }

    if (pageTitle) {
      document.title = `${pageTitle} | ${brand}`;
    } else {
      document.title = `${t('app.title')} | ${brand}`;
    }
  }, [path, locale, t]);

  const isAdminView =
    path === '/admin' ||
    path.startsWith('/admin/dashboard') ||
    path.startsWith('/admin/audit') ||
    path.startsWith('/coordination') ||
    path.startsWith('/admin/coordination');

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FC]">
      <GlobalLoadingBar />
      <Header />
      <main
        className={`flex-grow w-full mx-auto ${
          isAdminView
            ? 'max-w-[1600px] px-2 sm:px-4 lg:px-6 py-4 sm:py-6'
            : 'max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10'
        }`}
      >
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};
