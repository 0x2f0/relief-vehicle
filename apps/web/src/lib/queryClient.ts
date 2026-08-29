import { QueryClient, queryOptions } from '@tanstack/react-query';
import {
  getPublicStats,
  getRoads,
  getAdminApplications,
  getCheckpoints,
  getAdminUsers,
  trackApplication,
  getPublicPass,
} from './api';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes stale time for instant snappy navigation
      gcTime: 1000 * 60 * 10, // 10 minutes cache retention
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});

// Type-Safe Query Keys & Options Factory
export const queryKeys = {
  publicStats: ['public', 'stats'] as const,
  roads: ['roads'] as const,
  checkpoints: ['checkpoints'] as const,
  adminApplications: (status?: string) => ['admin', 'applications', status || 'all'] as const,
  adminUsers: ['admin', 'users'] as const,
  applicationTrack: (id: string, token?: string) => ['applications', 'track', id, token || ''] as const,
  pass: (id: string) => ['passes', id] as const,
};

export const publicStatsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.publicStats,
    queryFn: () => getPublicStats(),
  });

export const roadsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.roads,
    queryFn: () => getRoads(),
  });

export const checkpointsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.checkpoints,
    queryFn: () => getCheckpoints(),
  });

export const adminApplicationsQueryOptions = (status?: string) =>
  queryOptions({
    queryKey: queryKeys.adminApplications(status),
    queryFn: () => getAdminApplications(status),
  });

export const adminUsersQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.adminUsers,
    queryFn: () => getAdminUsers(),
  });

export const applicationTrackQueryOptions = (id: string, token?: string) =>
  queryOptions({
    queryKey: queryKeys.applicationTrack(id, token),
    queryFn: () => trackApplication(id, token),
    enabled: Boolean(id && id.trim().length > 0),
  });

export const passQueryOptions = (id: string) =>
  queryOptions({
    queryKey: queryKeys.pass(id),
    queryFn: () => getPublicPass(id),
    enabled: Boolean(id && id.trim().length > 0),
  });

// Progressive prefetching utilities
export const prefetchPublicData = async () => {
  try {
    await Promise.allSettled([
      queryClient.prefetchQuery(publicStatsQueryOptions()),
      queryClient.prefetchQuery(roadsQueryOptions()),
      queryClient.prefetchQuery(checkpointsQueryOptions()),
    ]);
  } catch {}
};

export const prefetchAdminData = async () => {
  try {
    await Promise.allSettled([
      queryClient.prefetchQuery(adminApplicationsQueryOptions()),
      queryClient.prefetchQuery(checkpointsQueryOptions()),
      queryClient.prefetchQuery(roadsQueryOptions()),
      queryClient.prefetchQuery(adminUsersQueryOptions()),
    ]);
  } catch {}
};
