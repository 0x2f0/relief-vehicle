import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, AlertOctagon, MapPin, Truck, AlertTriangle, RefreshCw, Layers } from 'lucide-react';
import { api } from '../lib/api';
import { CoordinationDashboardData } from '../lib/types';
import { RoadBadge } from '../components/common/Badge';

export function CoordinationCenter() {
  const [data, setData] = useState<CoordinationDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    api
      .getCoordinationDashboard()
      .then((res) => setData(res))
      .catch((err: unknown) => {
        setErrorMsg(err instanceof Error ? err.message : 'Please log in as an authorized admin to view live matrix.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  if (errorMsg) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
          <AlertOctagon className="w-10 h-10 text-amber-400 mx-auto mb-2" />
          <h2 className="text-lg font-bold text-white mb-1">Restricted Operations Console</h2>
          <p className="text-xs text-slate-300 mb-4">{errorMsg}</p>
          <Link
            to="/admin/login"
            className="inline-block bg-red-700 hover:bg-red-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shadow-md"
          >
            Sign In with Staff Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800 text-[11px] font-bold uppercase">
            <Activity className="w-3.5 h-3.5 text-red-500 animate-pulse" /> Real-Time Relief Fleet Matrix
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Emergency Coordination Center</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            High-level operational visibility: relief trip bottlenecks, duplicate vehicle detection, and destination flows.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Matrix
        </button>
      </div>

      {data && (
        <div className="space-y-8">
          {/* Duplicate Vehicle / Trip Alert Section */}
          {data.duplicateAlerts && data.duplicateAlerts.length > 0 && (
            <div className="bg-amber-950/40 border border-amber-800/80 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>Duplicate Movement & Multi-Pass Alerts ({data.duplicateAlerts.length} Vehicles Flagged)</span>
              </div>
              <p className="text-xs text-slate-300">
                The following vehicles or teams have submitted multiple movement requests within overlapping 48-hour windows:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {data.duplicateAlerts.map((item) => (
                  <div key={item.vehicle_number} className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-amber-300">{item.vehicle_number}</span>
                      <span className="bg-amber-950 text-amber-300 text-[10px] px-2 py-0.5 rounded font-bold border border-amber-800">
                        {item.request_count} Requests
                      </span>
                    </div>
                    <p className="text-slate-300 font-semibold">{item.org_name}</p>
                    <p className="text-slate-400 text-[11px]">Destinations: {item.destinations}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grid 1: Destinations Flow & Corridor Traffic */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Target Destinations Breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
                <MapPin className="w-4 h-4 text-red-400" /> Top Target Destination Hubs
              </h2>

              <div className="space-y-3">
                {data.destinations?.map((dest) => (
                  <div key={dest.destination} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-200 text-sm">{dest.destination}</p>
                      <span className="text-[11px] text-red-400 font-semibold">
                        {(dest as any).critical_count ?? dest.count} Vehicles Scheduled
                      </span>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-lg font-black text-amber-300">{dest.count}</span>
                      <span className="text-[10px] text-slate-400 block">Total Vehicles</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Highway Route Corridor Volumes */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Truck className="w-4 h-4 text-amber-400" /> Highway Corridor Movement Breakdown
              </h2>

              <div className="space-y-3">
                {data.routes?.map((rt) => (
                  <div key={(rt as any).proposed_route || (rt as any).route} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <p className="font-semibold text-slate-200 text-xs pr-4 leading-relaxed">{(rt as any).proposed_route || (rt as any).route}</p>
                    <div className="text-right font-mono shrink-0">
                      <span className="text-base font-bold text-emerald-400">{rt.count}</span>
                      <span className="text-[10px] text-slate-500 block">Convoys</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Road Hazards Reference */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Layers className="w-4 h-4 text-orange-400" /> Active Highway Hazard Advisories
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.roadHazards?.map((rh, index) => (
                <div key={(rh as any).id || index} className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{(rh as any).road_name || rh.road}</span>
                    <RoadBadge status={rh.status} />
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{rh.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
