import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { trackApplication } from '../lib/api';
import { Application } from '../lib/types';
import { getStoredPasses, StoredPass } from '../lib/authTracker';
import {
  Search,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  QrCode,
  ArrowRight,
  User,
  Truck,
  Package,
  ShieldAlert,
  Lock,
  KeyRound,
  FilePlus,
  LogIn,
} from 'lucide-react';

export const TrackStatus = () => {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlId = searchParams.get('id') || '';
  const urlToken = searchParams.get('token') || '';

  const [storedPasses, setStoredPasses] = useState<StoredPass[]>([]);
  const [selectedPassId, setSelectedPassId] = useState<string>(urlId);
  const [inputAppId, setInputAppId] = useState<string>(urlId);
  const [inputToken, setInputToken] = useState<string>(urlToken);
  const [result, setResult] = useState<Application | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Check auth and stored passes on mount
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('relief_auth_token') || localStorage.getItem('token');
    setIsAdmin(Boolean(adminToken));

    const passes = getStoredPasses();
    setStoredPasses(passes);

    if (!urlId && passes.length > 0) {
      setSelectedPassId(passes[0].id);
      setInputAppId(passes[0].id);
      setInputToken(passes[0].token);
    }
  }, [urlId]);

  const fetchStatus = useCallback(async (idToSearch: string, tokenToUse?: string) => {
    if (!idToSearch.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Find token from params, state, or localStorage
      const matchingStored = storedPasses.find((p) => p.id.toLowerCase() === idToSearch.trim().toLowerCase());
      const effectiveToken = tokenToUse || inputToken || matchingStored?.token || localStorage.getItem(`token_${idToSearch.trim()}`) || '';

      const data = await trackApplication(idToSearch.trim(), effectiveToken);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'आवेदन फेला परेन वा प्रमाणीकरण टोकन अमान्य छ / Application not found or invalid token');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [inputToken, storedPasses]);

  // Handle URL param or default pass loading
  useEffect(() => {
    if (urlId) {
      setInputAppId(urlId);
      setInputToken(urlToken);
      fetchStatus(urlId, urlToken || undefined);
    } else if (storedPasses.length > 0 && !result && !loading) {
      const firstPass = storedPasses[0];
      setSelectedPassId(firstPass.id);
      setInputAppId(firstPass.id);
      setInputToken(firstPass.token);
      fetchStatus(firstPass.id, firstPass.token);
    }
  }, [urlId, urlToken, storedPasses.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputAppId.trim()) return;
    setSearchParams({ id: inputAppId.trim(), ...(inputToken.trim() ? { token: inputToken.trim() } : {}) });
    fetchStatus(inputAppId.trim(), inputToken.trim() || undefined);
  };

  const handleSelectPass = (pass: StoredPass) => {
    setSelectedPassId(pass.id);
    setInputAppId(pass.id);
    setInputToken(pass.token);
    setSearchParams({ id: pass.id, token: pass.token });
    fetchStatus(pass.id, pass.token);
  };

  // Determine if the user is authorized to access tracking
  const isAuthorized = isAdmin || storedPasses.length > 0 || Boolean(urlId && urlToken);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
      case 'issued':
      case 'active':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            {t(`status.${status}`)}
          </span>
        );
      case 'rejected':
      case 'revoked':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
            <XCircle className="w-3.5 h-3.5 mr-1" />
            {t(`status.${status}`)}
          </span>
        );
      case 'under_review':
      case 'info_requested':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {t(`status.${status}`)}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {t(`status.${status}`)}
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-red-600 text-white uppercase">{t('priority.Critical')}</span>;
      case 'High':
        return <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500 text-white uppercase">{t('priority.High')}</span>;
      case 'Medium':
        return <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-600 text-white uppercase">{t('priority.Medium')}</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-200 text-slate-700 uppercase">{t('priority.Normal')}</span>;
    }
  };

  // 1. UNAUTHORIZED ACCESS GUARD SCREEN
  if (!isAuthorized) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-10 text-center space-y-6">
        <div className="w-16 h-16 bg-red-50 text-[#CC1424] rounded-2xl flex items-center justify-center mx-auto border border-red-200/80 shadow-2xs">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-red-50 border border-red-200 text-[11px] font-bold text-[#CC1424] uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{t('track.restrictedTitle')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t('track.restrictedTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            {t('track.restrictedDesc')}
          </p>
        </div>

        {/* Manual Key Verification Form */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
            <KeyRound className="w-4 h-4 text-[#0447AF]" />
            <span>Have an Application Token? (टोकन प्रमाणीकरण)</span>
          </div>

          <form onSubmit={handleSearch} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Application ID
              </label>
              <input
                type="text"
                value={inputAppId}
                onChange={(e) => setInputAppId(e.target.value)}
                placeholder="EP-20260829-XXXX"
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-mono focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF] bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Secret Token Key
              </label>
              <input
                type="text"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                placeholder="64-character security token"
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-mono focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF] bg-white"
                required
              />
            </div>

            {error && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center space-x-2 bg-[#0447AF] hover:bg-[#033685] text-white py-2.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Verify & Track Status</span>
            </button>
          </form>
        </div>

        {/* Action Links */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/apply"
            className="inline-flex items-center space-x-1.5 bg-[#CC1424] hover:bg-[#B00F1E] text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            <FilePlus className="w-4 h-4" />
            <span>{t('track.applyBtn')}</span>
          </Link>
          <Link
            to="/admin/login"
            className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all"
          >
            <LogIn className="w-4 h-4 text-slate-500" />
            <span>{t('track.loginToSearch')}</span>
          </Link>
        </div>
      </div>
    );
  }

  // 2. AUTHORIZED TRACKING INTERFACE
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Application Selector (If user has multiple stored passes) */}
      {storedPasses.length > 0 && (
        <div className="bg-white p-4 sm:p-5 rounded-xl shadow-2xs border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Truck className="w-4 h-4 text-[#0447AF]" />
              <span>{t('track.myApplications')} ({storedPasses.length})</span>
            </h2>
            <span className="text-[11px] text-slate-500">{t('track.selectApplication')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {storedPasses.map((pass) => {
              const isSelected = selectedPassId === pass.id;
              return (
                <button
                  key={pass.id}
                  type="button"
                  onClick={() => handleSelectPass(pass)}
                  className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-50/70 border-[#0447AF] ring-1 ring-[#0447AF]'
                      : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#0447AF]">{pass.id}</span>
                    {pass.vehicle && (
                      <span className="text-[10px] font-bold bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700 font-mono">
                        {pass.vehicle}
                      </span>
                    )}
                  </div>
                  {pass.route && (
                    <p className="text-[11px] text-slate-600 mt-1 truncate">
                      {pass.route}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Admin / Officer Search Bar */}
      {isAdmin && (
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-2xs border border-blue-200 space-y-3 bg-blue-50/20">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-[#0447AF]" />
            <h2 className="text-xs font-bold text-[#0447AF] uppercase tracking-wider">
              {t('track.adminSearch')}
            </h2>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={inputAppId}
              onChange={(e) => setInputAppId(e.target.value)}
              placeholder={t('track.placeholder')}
              className="flex-1 border border-slate-300 rounded-lg p-2.5 text-xs font-mono focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF] bg-white"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center space-x-1.5 bg-[#0447AF] hover:bg-[#033685] text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 shadow-2xs"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{loading ? t('track.searching') : t('track.search')}</span>
            </button>
          </form>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#0447AF] animate-spin mx-auto" />
          <p className="text-xs text-slate-600 font-medium">
            सरकारी डाटाबेसबाट स्थिति प्राप्त गरिँदैछ... / Fetching pass status...
          </p>
        </div>
      )}

      {/* Error Alert */}
      {error && !loading && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 text-xs sm:text-sm text-red-800">
          <AlertCircle className="w-5 h-5 text-[#CC1424] flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result View */}
      {result && !loading && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 sm:p-8 space-y-6">
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <span className="text-lg sm:text-xl font-bold font-mono text-[#0447AF]">
                  {result.id}
                </span>
                {getPriorityBadge(result.priority)}
              </div>
              <p className="text-xs text-slate-500">
                दर्ता मिति / Submitted: {new Date(result.created_at).toLocaleString()}
              </p>
            </div>

            <div>{getStatusBadge(result.status)}</div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
            {/* Applicant & Org */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                <User className="w-4 h-4 text-[#0447AF]" />
                <span>{t('track.applicantInfo')}</span>
              </div>
              <div className="space-y-2 text-slate-700">
                <div><span className="text-slate-500">नाम / Name:</span> <span className="font-semibold">{result.applicant_name}</span></div>
                <div><span className="text-slate-500">संस्था / Org:</span> <span className="font-semibold">{result.org_name} ({result.org_type})</span></div>
                <div><span className="text-slate-500">सम्पर्क / Phone:</span> <span className="font-mono">{result.applicant_phone}</span></div>
                {result.emergency_contact && <div><span className="text-slate-500">Emergency:</span> <span className="font-mono">{result.emergency_contact}</span></div>}
              </div>
            </div>

            {/* Vehicle & Journey */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                <Truck className="w-4 h-4 text-[#0447AF]" />
                <span>{t('track.vehicleInfo')}</span>
              </div>
              <div className="space-y-2 text-slate-700">
                <div><span className="text-slate-500">सवारी / Vehicle:</span> <span className="font-mono font-bold text-[#0447AF]">{result.vehicle_number}</span> ({result.vehicle_type})</div>
                <div><span className="text-slate-500">चालक / Driver:</span> <span>{result.driver_name} ({result.driver_phone})</span></div>
                <div><span className="text-slate-500">रुट / Route:</span> <span className="font-semibold">{result.departure_location} → {result.destination}</span></div>
                <div><span className="text-slate-500">राजमार्ग / Highway:</span> <span>{result.proposed_route}</span></div>
              </div>
            </div>
          </div>

          {/* Cargo Details */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs sm:text-sm">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              <Package className="w-4 h-4 text-[#0447AF]" />
              <span>ढुवानी सामग्री तथा उद्देश्य (Cargo & Mission)</span>
            </div>
            <p className="text-slate-700">
              <span className="font-semibold text-slate-900">{result.cargo_type}:</span> {result.cargo_details}
            </p>
            <p className="text-slate-600 mt-1">
              <span className="font-semibold text-slate-900">उद्देश्य:</span> {result.travel_purpose}
            </p>
          </div>

          {/* Pass Available Action */}
          {(result.status === 'issued' || result.status === 'active' || result.status === 'approved') && (
            <div className="pt-4 border-t border-slate-200 text-center">
              <Link
                to={`/pass/${encodeURIComponent(result.id)}`}
                className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                <QrCode className="w-5 h-5" />
                <span>{t('track.viewPass')}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


