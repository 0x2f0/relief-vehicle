import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useI18n } from '../lib/i18n';
import { roadsQueryOptions, queryKeys } from '../lib/queryClient';
import { addRoadCondition, deleteRoadCondition } from '../lib/api';
import { RoadCondition } from '../lib/types';
import { RoadListSkeleton } from '../components/common/Skeleton';
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
import { LocationCombobox } from '../components/common/LocationCombobox';

export const RoadConditions = () => {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const { data: roads = [], isLoading } = useQuery(roadsQueryOptions());

  const [filter, setFilter] = useState<'all' | 'open' | 'restricted' | 'emergency_only' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoad, setNewRoad] = useState({
    road_name: '',
    status: 'restricted',
    description: '',
  });

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('relief_auth_token') || localStorage.getItem('token');
    setIsAuthorized(Boolean(token));
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('auth-change', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);

  // TanStack Query Mutations
  const addMutation = useMutation({
    mutationFn: addRoadCondition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roads });
      queryClient.invalidateQueries({ queryKey: queryKeys.publicStats });
      setShowAddModal(false);
      setNewRoad({ road_name: '', status: 'restricted', description: '' });
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to publish road advisory');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRoadCondition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roads });
      queryClient.invalidateQueries({ queryKey: queryKeys.publicStats });
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to remove road advisory');
    },
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoad.road_name.trim()) return;
    addMutation.mutate(newRoad);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this road advisory?')) return;
    deleteMutation.mutate(id);
  };

  const filteredRoads = roads.filter((r) => {
    const matchesFilter = filter === 'all' || r.status === filter;
    const matchesSearch =
      searchQuery === '' ||
      r.road_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const openCount = roads.filter((r) => r.status === 'open').length;
  const restrictedCount = roads.filter((r) => r.status === 'restricted' || r.status === 'emergency_only').length;
  const closedCount = roads.filter((r) => r.status === 'closed').length;

  const getStatusBadge = (status: RoadCondition['status']) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wide">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('roads.status.open')}</span>
          </span>
        );
      case 'restricted':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wide">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('roads.status.restricted')}</span>
          </span>
        );
      case 'emergency_only':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-wide">
            <Siren className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('roads.status.emergency_only')}</span>
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200 uppercase tracking-wide">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            <span>{t('roads.status.closed')}</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* 1. HEADER BANNER */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <MapPin className="w-6 h-6 text-[#CC1424]" />
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {t('roads.title')}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              {t('roads.subtitle')}
            </p>
          </div>

          {isAuthorized && (
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-[#CC1424] hover:bg-[#B00F1E] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>{t('roads.addBtn')}</span>
            </button>
          )}
        </div>

        {/* 2. OVERVIEW METRICS */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/60 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-emerald-800 block uppercase">
                {t('roads.status.open')}
              </span>
              <span className="text-xl font-black text-emerald-900">{openCount}</span>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/60 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-amber-800 block uppercase">
                {t('roads.status.restricted')}
              </span>
              <span className="text-xl font-black text-amber-900">{restrictedCount}</span>
            </div>
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>

          <div className="bg-red-50/60 p-3 rounded-xl border border-red-200/60 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-red-800 block uppercase">
                {t('roads.status.closed')}
              </span>
              <span className="text-xl font-black text-red-900">{closedCount}</span>
            </div>
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
        </div>
      </div>

      {/* 3. FILTERS & SEARCH */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row justify-between gap-3 items-stretch sm:items-center">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg">
          {[
            { key: 'all', label: t('roads.filter.all') },
            { key: 'open', label: t('roads.filter.open') },
            { key: 'restricted', label: t('roads.filter.restricted') },
            { key: 'closed', label: t('roads.filter.closed') },
          ].map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key as any)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                filter === f.key
                  ? 'bg-white text-[#0447AF] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('roads.searchPlaceholder')}
            className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-[#0447AF] bg-white"
          />
        </div>
      </div>

      {/* 4. ROAD ADVISORIES LIST */}
      {isLoading ? (
        <RoadListSkeleton count={4} />
      ) : (
        <div className="space-y-3.5">
          {filteredRoads.map((road) => (
            <div
              key={road.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4 group"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0447AF] transition-colors">
                    {road.road_name}
                  </h3>
                  {getStatusBadge(road.status)}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {road.description || 'No additional hazard details reported. Maintain caution.'}
                </p>

                <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center space-x-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>
                      {new Date(road.updated_at || road.reported_at || Date.now()).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </span>
                  {road.reported_by && (
                    <span>• Report Source: {road.reported_by}</span>
                  )}
                </div>
              </div>

              {isAuthorized && (
                <button
                  type="button"
                  onClick={() => handleDelete(road.id)}
                  disabled={deleteMutation.isPending}
                  className="self-end sm:self-center p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  title="Remove advisory"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          {filteredRoads.length === 0 && (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 text-xs sm:text-sm space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-semibold text-slate-800">
                {t('roads.noAlerts')}
              </p>
              <p className="text-slate-400 text-xs">
                सबै प्रमुख राजमार्ग तथा राहत मार्गहरू सामान्य अवस्थामा छन्।
              </p>
            </div>
          )}
        </div>
      )}

      {/* 5. ADD ROAD ADVISORY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#CC1424]" />
                <span>{t('roads.addModalTitle')}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('roads.roadNameLabel')} <span className="text-[#CC1424]">*</span>
                </label>
                <LocationCombobox
                  required
                  value={newRoad.road_name}
                  onChange={(val) => setNewRoad((prev) => ({ ...prev, road_name: val }))}
                  placeholder="उदा: Araniko Highway (Dolalghat - Melamchi Section)"
                  categories={['Highway', 'Checkpoint', 'City / Hub', 'District']}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('roads.statusLabel')}
                </label>
                <select
                  value={newRoad.status}
                  onChange={(e) => setNewRoad({ ...newRoad, status: e.target.value as any })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs sm:text-sm bg-white font-medium focus:border-[#CC1424]"
                >
                  <option value="open">{t('roads.status.open')}</option>
                  <option value="restricted">{t('roads.status.restricted')}</option>
                  <option value="emergency_only">{t('roads.status.emergency_only')}</option>
                  <option value="closed">{t('roads.status.closed')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('roads.descLabel')}
                </label>
                <textarea
                  rows={3}
                  value={newRoad.description}
                  onChange={(e) => setNewRoad({ ...newRoad, description: e.target.value })}
                  placeholder="पहिरो, बाढी वा सडक मर्मत सम्बन्धी थप विवरण..."
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs sm:text-sm focus:border-[#CC1424]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addMutation.isPending}
                  className="px-4 py-2 rounded-lg bg-[#CC1424] hover:bg-[#B00F1E] text-white text-xs font-bold flex items-center space-x-1.5"
                >
                  {addMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{addMutation.isPending ? 'Publishing...' : t('roads.submitBtn')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
