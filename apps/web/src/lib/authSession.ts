import { queryClient } from './queryClient';
import { clearAuthStorage } from './authStorage';

export {
  getAuthToken,
  getStoredAdminUser,
  isStaffSession,
  clearAuthStorage,
} from './authStorage';

export function clearAuthSession() {
  clearAuthStorage();
  queryClient.clear();
}
