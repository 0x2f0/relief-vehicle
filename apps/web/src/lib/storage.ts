export interface QueuedScan {
  id: string;
  pass_id: string;
  checkpoint_name: string;
  officer_name: string;
  officer_badge?: string;
  direction: 'outbound' | 'inbound' | 'transit';
  latitude?: number | null;
  longitude?: number | null;
  scan_result: 'valid' | 'invalid' | 'expired' | 'revoked';
  notes?: string;
  timestamp: string;
}

const STORAGE_KEY = 'relief_offline_scans';

export function getQueuedScans(): QueuedScan[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveQueuedScan(scan: QueuedScan): void {
  const current = getQueuedScans();
  current.push(scan);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

export function clearQueuedScans(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export async function syncQueuedScans(
  recordFn: (scan: QueuedScan) => Promise<unknown>
): Promise<{ syncedCount: number; failedCount: number }> {
  const scans = getQueuedScans();
  if (scans.length === 0) return { syncedCount: 0, failedCount: 0 };

  const remaining: QueuedScan[] = [];
  let synced = 0;

  for (const scan of scans) {
    try {
      await recordFn(scan);
      synced++;
    } catch {
      remaining.push(scan);
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
  return { syncedCount: synced, failedCount: remaining.length };
}
