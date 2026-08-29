import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { queryClient } from './lib/queryClient';
import { getAuthToken } from './lib/authStorage';
import { router } from './router';

function App() {
  useEffect(() => {
    const dropStaffCache = () => {
      if (!getAuthToken()) {
        queryClient.clear();
      }
    };
    window.addEventListener('auth-change', dropStaffCache);
    return () => window.removeEventListener('auth-change', dropStaffCache);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
