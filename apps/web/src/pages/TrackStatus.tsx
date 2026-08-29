import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useI18n } from '../lib/i18n';
import { applicationTrackQueryOptions } from '../lib/queryClient';
import { getStoredPasses, StoredPass } from '../lib/authTracker';
import { TimelineSkeleton } from '../components/common/Skeleton';
import {
  Search,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  QrCode,
  ArrowRight,
  Lock,
  KeyRound,
  FilePlus,
  LogIn,
} from 'lucide-react';

export const TrackStatus = () => {
  const { t } = useI18n();

  const [storedPasses, setStoredPasses] = useState<StoredPass[]>([]);
  const [selectedPassId, setSelectedPassId] = useState<string>('');
  const [inputAppId, setInputAppId] = useState<string>('');
  const [inputToken, setInputToken] = useState<string>('');
  const [searchQueryId, setSearchQueryId] = useState<string>('');
  const [searchQueryToken, setSearchQueryToken] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Check auth and stored passes on mount
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('relief_auth_token') || localStorage.getItem('token');
    setIsAdmin(Boolean(adminToken));

    const passes = getStoredPasses();
    setStoredPasses(passes);

    if (passes.length > 0) {
      setSelectedPassId(passes[0].id);
      setInputAppId(passes[0].id);
      setInputToken(passes[0].token);
      setSearchQueryId(passes[0].id);
      setSearchQueryToken(passes[0].token);
    }
  }, []);

  // TanStack Query for tracking
  const {
    data: result,
    isLoading: loading,
    isError,
    error: queryError,
  } = useQuery(applicationTrackQueryOptions(searchQueryId, searchQueryToken));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputAppId.trim()) return;
    setSearchQueryId(inputAppId.trim());
    setSearchQueryToken(inputToken.trim());
  };

  const handleSelectStoredPass = (pass: StoredPass) => {
    setSelectedPassId(pass.id);
    setInputAppId(pass.id);
    setInputToken(pass.token);
    setSearchQueryId(pass.id);
    setSearchQueryToken(pass.token);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span>{t('track.status.submitted')}</span>
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>{t('track.status.under_review')}</span>
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t('track.status.approved')}</span>
          </span>
        );
      case 'issued':
      case 'active':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <QrCode className="w-3.5 h-3.5" />
            <span>{t('track.status.issued')}</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            <span>{t('track.status.rejected')}</span>
          </span>
        );
      case 'revoked':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-900 border border-red-300">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{t('track.status.revoked')}</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  // Unauthorized Gatekeeper
  const isUnauthorized = !isAdmin && storedPasses.length === 0;

  if (isUnauthorized) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-6">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto text-[#CC1424]">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">
            {t('track.unauthTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t('track.unauthDesc')}
          </p>
        </div>
        <div className="flex flex-col gap-3 pt-2">
          <Link
            to="/apply"
            preload="intent"
            className="w-full inline-flex items-center justify-center space-x-2 bg-[#CC1424] hover:bg-[#B00F1E] text-white py-3 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all"
          >
            <FilePlus className="w-4 h-4" />
            <span>{t('home.hero.applyBtn')}</span>
          </Link>
          <Link
            to="/admin/login"
            preload="intent"
            className="w-full inline-flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>{t('nav.admin')}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* 1. HEADER */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Search className="w-6 h-6 text-[#0447AF]" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('track.title')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            {t('track.subtitle')}
          </p>
        </div>

        {/* Stored Passes Quick Bar */}
        {storedPasses.length > 0 && (
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              यस डिभाइसमा सुरक्षित गरिएका आवेदनहरू (Stored Passes):
            </span>
            <div className="flex flex-wrap gap-2">
              {storedPasses.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectStoredPass(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center space-x-1.5 ${
                    selectedPassId === p.id
                      ? 'bg-[#0447AF] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <KeyRound className="w-3 h-3" />
                  <span>{p.id}</span>
                  {p.vehicle && (
                    <span className="opacity-80">({p.vehicle})</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Inputs Form */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              value={inputAppId}
              onChange={(e) => setInputAppId(e.target.value)}
              placeholder="Application ID (APP-2026-XXXX)"
              className="w-full pl-8 pr-3 py-2.5 text-xs font-mono border border-slate-300 rounded-xl focus:border-[#0447AF] bg-white"
            />
          </div>

          <div className="relative">
            <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              placeholder="Secret Security Token (वैकल्पिक)"
              className="w-full pl-8 pr-3 py-2.5 text-xs font-mono border border-slate-300 rounded-xl focus:border-[#0447AF] bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0447AF] hover:bg-[#033685] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center space-x-1.5"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>{loading ? 'खोजी हुँदैछ...' : 'स्थिति हेर्नुहोस् (Track)'}</span>
          </button>
        </form>
      </div>

      {/* 2. LOADING STATE SKELETON */}
      {loading && <TimelineSkeleton />}

      {/* 3. ERROR STATE */}
      {isError && (
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-[#CC1424] mx-auto" />
          <h3 className="font-bold text-sm text-red-900">
            आवेदन विवरण फेला परेन
          </h3>
          <p className="text-xs text-red-700">
            {(queryError as any)?.message || 'कृपया Application ID र Security Token ठीक छ/छैन पुनः जाँच गर्नुहोस्।'}
          </p>
        </div>
      )}

      {/* 4. TRACKING RESULT MANIFEST */}
      {result && !loading && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-mono font-bold text-[#0447AF] block">
                {result.id}
              </span>
              <h2 className="text-base font-bold text-slate-900">
                {result.org_name || result.applicant_name}
              </h2>
            </div>
            {getStatusBadge(result.status)}
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl text-xs">
            <div>
              <span className="text-slate-500 font-medium block">गाडी नम्बर:</span>
              <span className="font-mono font-bold text-slate-900">{result.vehicle_number}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">चालकको नाम:</span>
              <span className="font-semibold text-slate-900">{result.driver_name}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">प्रस्थान ➡️ गन्तव्य:</span>
              <span className="font-semibold text-slate-900">{result.departure_location} ➡️ {result.destination}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">राहत सामग्री:</span>
              <span className="font-semibold text-slate-900">{result.cargo_type}</span>
            </div>
          </div>

          {/* Open E-Pass Trigger */}
          {(result.status === 'issued' || result.status === 'active' || result.status === 'approved') && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center space-x-3 text-emerald-950">
                <QrCode className="w-8 h-8 text-emerald-700 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm">
                    डिजिटल ई-पास जारी भएको छ (Official E-Pass Ready)
                  </h4>
                  <p className="text-[11px] text-emerald-800">
                    मार्ग सुरक्षा जाँच तथा चेकपोइन्ट क्लियरन्सका लागि डिजिटल पास प्रयोग गर्नुहोस्।
                  </p>
                </div>
              </div>
              <Link
                to="/pass/$id"
                params={{ id: result.id }}
                preload="intent"
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs whitespace-nowrap"
              >
                <span>ई-पास कार्ड खोल्नुहोस्</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
