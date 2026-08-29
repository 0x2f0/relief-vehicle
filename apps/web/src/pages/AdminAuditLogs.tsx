import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';
import { AuditLog } from '../lib/types';
import { useAuth } from '../hooks/useAuth';

export function AdminAuditLogs() {
  const {} = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [entityFilter, setEntityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadLogs = () => {
    setLoading(true);
    api
      .getAuditLogs({
        entity_type: entityFilter || undefined,
        search: searchQuery || undefined,
      })
      .then((res) => setLogs(res.logs))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLogs();
  }, [entityFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <Link to="/admin/dashboard" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Application Queue
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Administrative & Security Audit Logs</h1>
          <p className="text-xs text-slate-400">
            Immutable tracking of approvals, rejections, pass revocations, and checkpoint scan entries.
          </p>
        </div>

        <button
          onClick={loadLogs}
          disabled={loading}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Logs
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-wrap gap-4 text-xs">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Search Logs</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadLogs()}
            placeholder="Entity ID, Officer Name, Action..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Entity Type</label>
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
          >
            <option value="">All Entities</option>
            <option value="application">Application</option>
            <option value="pass">Pass</option>
            <option value="checkpoint">Checkpoint Scan</option>
            <option value="road">Road Condition</option>
            <option value="auth">Authentication</option>
          </select>
        </div>
      </div>

      {/* Log list */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity ID</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors font-mono">
                  <td className="py-3 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                    {new Date(log.created_at || (log as any).timestamp || Date.now()).toLocaleString()}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap font-bold text-amber-300">
                    {log.action}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap text-slate-200">
                    {log.entity_id}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap text-slate-300 font-sans">
                    {log.actor_name} ({log.actor_role})
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                    {log.ip_address || 'N/A'}
                  </td>

                  <td className="py-3 px-4 text-slate-400 font-sans truncate max-w-xs text-[11px]">
                    {log.details || '—'}
                  </td>
                </tr>
              ))}

              {logs.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-sans">
                    No audit log records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
