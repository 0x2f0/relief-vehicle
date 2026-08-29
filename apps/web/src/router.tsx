import { useEffect } from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  ScrollRestoration,
  redirect,
} from '@tanstack/react-router';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { ApplyPass } from './pages/ApplyPass';
import { ApplicationSuccess } from './pages/ApplicationSuccess';
import { TrackStatus } from './pages/TrackStatus';
import { ViewPass } from './pages/ViewPass';
import { CheckpointScanner } from './pages/CheckpointScanner';
import { RoadConditions } from './pages/RoadConditions';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import {
  queryClient,
  publicStatsQueryOptions,
  roadsQueryOptions,
  checkpointsQueryOptions,
  passQueryOptions,
  prefetchPublicData,
  prefetchAdminData,
} from './lib/queryClient';
import { isStaffSession } from './lib/authSession';

function requireStaffSession() {
  if (!isStaffSession()) {
    throw redirect({ to: '/admin/login' });
  }
}

// Root Route Container with Layout, Preload Hook & Scroll Restoration
const RootComponent = () => {
  useEffect(() => {
    // Non-blocking background prefetch
    prefetchPublicData();
  }, []);

  return (
    <Layout>
      <ScrollRestoration />
      <Outlet />
    </Layout>
  );
};

export const rootRoute = createRootRoute({
  component: RootComponent,
});

// Non-blocking progressive route loaders for instantaneous frame-0 rendering
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
  loader: () => {
    queryClient.prefetchQuery(publicStatsQueryOptions());
    queryClient.prefetchQuery(roadsQueryOptions());
  },
});

export const applyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/apply',
  component: ApplyPass,
  loader: () => {
    queryClient.prefetchQuery(roadsQueryOptions());
    queryClient.prefetchQuery(checkpointsQueryOptions());
  },
});

export const appliedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/applied/$id',
  component: ApplicationSuccess,
});

export const trackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/track',
  component: TrackStatus,
  validateSearch: (search: Record<string, unknown>): { code?: string } => ({
    code: typeof search.code === 'string' && search.code.trim() ? search.code.trim() : undefined,
  }),
});

export const passRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pass/$id',
  component: ViewPass,
  loader: ({ params }) => {
    if (params.id) {
      queryClient.prefetchQuery(passQueryOptions(params.id));
    }
  },
});

export const scannerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/scanner',
  component: CheckpointScanner,
  loader: () => {
    queryClient.prefetchQuery(checkpointsQueryOptions());
  },
});

export const verifyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/verify',
  component: CheckpointScanner,
  loader: () => {
    queryClient.prefetchQuery(checkpointsQueryOptions());
  },
});

export const roadsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/roads',
  component: RoadConditions,
  loader: () => {
    queryClient.prefetchQuery(roadsQueryOptions());
  },
});

export const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/login',
  component: AdminLogin,
});

export const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/dashboard',
  beforeLoad: requireStaffSession,
  staleTime: 0,
  preloadStaleTime: 0,
  component: AdminDashboard,
  loader: () => {
    if (isStaffSession()) prefetchAdminData();
  },
});

export const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  beforeLoad: requireStaffSession,
  staleTime: 0,
  preloadStaleTime: 0,
  component: AdminDashboard,
  loader: () => {
    if (isStaffSession()) prefetchAdminData();
  },
});

// Route Tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  applyRoute,
  appliedRoute,
  trackRoute,
  passRoute,
  scannerRoute,
  verifyRoute,
  roadsRoute,
  adminLoginRoute,
  adminDashboardRoute,
  adminRoute,
]);

// Type-Safe TanStack Router Instance with Snappy Preloading
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
