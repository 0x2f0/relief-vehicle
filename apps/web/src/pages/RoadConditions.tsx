import React, { useEffect, useState } from 'react';
import { useI18n } from '../lib/i18n';
import { getRoads, addRoadCondition, deleteRoadCondition } from '../lib/api';
import { RoadCondition } from '../lib/types';
import {
  MapPin,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Siren,
  Search,
  Clock,
  Plus,
  Trash2,
  X,
  Loader2,
} from 'lucide-react';

export const RoadConditions = () => {
  const { t } = useI18n();
  const [roads, setRoads] = useState<RoadCondition[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'restricted' | 'emergency_only' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newRoad, setNewRoad] = useState({
    road_name: '',
    status: 'restricted',
    description: '',
  });

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('relief_auth_token') || localStorage.getItem('token');
    setIsAuthorized(Boolean(token));
  };

  const fetchRoads = async () => {
    setLoading(true);
    try {
      const data = await getRoads();
      setRoads(data || []);
    } catch {
      setRoads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    fetchRoads();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoad.road_name.trim()) return;

    setSubmitting(true);
    try {
      await addRoadCondition(newRoad as any);
      setNewRoad({ road_name: '', status: 'restricted', description: '' });
      setShowAddModal(false);
      await fetchRoads();
    } catch (err: any) {
      alert(err.message || 'Failed to publish road advisory');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this road advisory? / के यो सडक सूचना हटाउन चाहनुहुन्छ?')) return;
    try {
      await deleteRoadCondition(id);
      await fetchRoads();
    } catch (err: any) {
      alert(err.message || 'Failed to delete road advisory');
    }
  };

  const filteredRoads = roads.filter((r) => {
    const matchesFilter = filter === 'all' || r.status === filter;
    const matchesSearch =
      searchQuery === '' ||
      r.road_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            <span>{t('roads.statusOpen')}</span>
          </span>
        );
      case 'restricted':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase">
            <AlertTriangle className="w-3 h-3 mr-1" />
            <span>{t('roads.statusRestricted')}</span>
          </span>
        );
      case 'emergency_only':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 uppercase">
            <Siren className="w-3 h-3 mr-1 text-[#0447AF]" />
            <span>{t('roads.statusEmergency')}</span>
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200 uppercase">
            <XCircle className="w-3 h-3 mr-1 text-[#CC1424]" />
            <span>{t('roads.statusClosed')}</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xs border border-slate-200 space-y-6">
      {/* Title, Actions & Refresh */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-[#CC1424]" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t('roads.title')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t('roads.subtitle')}
          </p>
        </div>

        <div>
          {isAuthorized && (
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-[#CC1424] hover:bg-[#B00F1E] text-white text-xs font-bold transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('roads.addBtn')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-stretch sm:items-center">
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-lg">
          {(['all', 'open', 'restricted', 'emergency_only', 'closed'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                filter === f
                  ? 'bg-white text-[#0447AF] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f === 'all' && t('roads.filterAll')}
              {f === 'open' && t('roads.filterOpen')}
              {f === 'restricted' && t('roads.filterRestricted')}
              {f === 'emergency_only' && t('roads.filterEmergency')}
              {f === 'closed' && t('roads.filterClosed')}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('roads.searchPlaceholder')}
            className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs w-full sm:w-64 focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF]"
          />
        </div>
      </div>

      {/* Roads Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse" aria-label="Highway Status Table">
          <thead>
            <tr className="bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
              <th className="p-3.5">{t('roads.thHighway')}</th>
              <th className="p-3.5">{t('roads.thStatus')}</th>
              <th className="p-3.5">{t('roads.thDetails')}</th>
              <th className="p-3.5">{t('roads.thUpdated')}</th>
              {isAuthorized && <th className="p-3.5 text-right">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
            {filteredRoads.map((road) => (
              <tr key={road.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5 font-semibold text-slate-900">
                  {road.road_name}
                </td>
                <td className="p-3.5 whitespace-nowrap">
                  {getStatusBadge(road.status)}
                </td>
                <td className="p-3.5 text-slate-600 text-xs leading-relaxed max-w-sm">
                  {road.description || road.reason || '-'}
                </td>
                <td className="p-3.5 text-xs text-slate-500 whitespace-nowrap font-mono">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{new Date(road.updated_at || road.reported_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </span>
                </td>
                {isAuthorized && (
                  <td className="p-3.5 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleDelete(road.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                      title="Delete road advisory"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {loading && (
              <tr>
                <td colSpan={isAuthorized ? 5 : 4} className="p-8 text-center text-slate-500">
                  <div className="flex items-center justify-center space-x-2 text-xs font-semibold text-[#CC1424]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>सडक विवरण लोड हुँदैछ...</span>
                  </div>
                </td>
              </tr>
            )}
            {!loading && filteredRoads.length === 0 && (
              <tr>
                <td colSpan={isAuthorized ? 5 : 4} className="p-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-1" />
                    <p className="text-sm font-semibold text-slate-800">
                      {t('roads.emptyTitle')}
                    </p>
                    <p className="text-xs text-slate-500">
                      {t('roads.emptyDesc')}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Road Advisory Modal (For Authorized Personnel) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#CC1424]" />
                <span>{t('roads.addModalTitle')}</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('roads.roadNameLabel')} <span className="text-[#CC1424]">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={newRoad.road_name}
                  onChange={(e) => setNewRoad((prev) => ({ ...prev, road_name: e.target.value }))}
                  placeholder={t('roads.roadNamePlaceholder')}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs sm:text-sm focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('roads.roadStatusLabel')} <span className="text-[#CC1424]">*</span>
                </label>
                <select
                  value={newRoad.status}
                  onChange={(e) => setNewRoad((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs sm:text-sm focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF]"
                >
                  <option value="open">{t('roads.statusOpen')} (Open)</option>
                  <option value="restricted">{t('roads.statusRestricted')} (Restricted / Single Lane)</option>
                  <option value="emergency_only">{t('roads.statusEmergency')} (Emergency Convoy Only)</option>
                  <option value="closed">{t('roads.statusClosed')} (Closed)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('roads.roadDescLabel')} <span className="text-[#CC1424]">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={newRoad.description}
                  onChange={(e) => setNewRoad((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder={t('roads.roadDescPlaceholder')}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs sm:text-sm focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF]"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {t('roads.cancelBtn')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-[#CC1424] hover:bg-[#B00F1E] text-white text-xs font-bold transition-colors disabled:opacity-50 shadow-2xs"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{submitting ? t('roads.submitting') : t('roads.submitBtn')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
