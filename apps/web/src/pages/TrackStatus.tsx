import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
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
  KeyRound,
} from 'lucide-react';

function isPassReady(status?: string, passId?: string | null, passStatus?: string | null) {
  if (!passId) return false;
  if (passStatus && passStatus !== 'active') return false;
  return status === 'issued' || status === 'active' || passStatus === 'active';
}

export const TrackStatus = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const search = useSearch({ from: '/track' });

  const [storedPasses, setStoredPasses] = useState<StoredPass[]>([]);
  const [selectedPassId, setSelectedPassId] = useState<string>('');
  const [inputCode, setInputCode] = useState(search.code ?? '');
  const [queryCode, setQueryCode] = useState(search.code ?? '');
  const redirected = useRef(false);

  useEffect(() => {
    const passes = getStoredPasses();
    setStoredPasses(passes);
  }, []);

  useEffect(() => {
    if (search.code) {
      setInputCode(search.code);
      setQueryCode(search.code);
      redirected.current = false;
    }
  }, [search.code]);

  const {
    data: result,
    isLoading: loading,
    isError,
    error: queryError,
  } = useQuery(applicationTrackQueryOptions(queryCode));

  useEffect(() => {
    if (!result || redirected.current) return;
    if (!isPassReady(result.status, result.pass_id, result.pass_status)) return;
    redirected.current = true;
    const passId = result.id;
    navigate({ to: '/pass/$id', params: { id: passId } });
  }, [result, navigate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const code = inputCode.trim();
    if (!code) return;
    redirected.current = false;
    setQueryCode(code);
    navigate({ to: '/track', search: { code }, replace: true });
  };

  const handleSelectStoredPass = (pass: StoredPass) => {
    setSelectedPassId(pass.id);
    setInputCode(pass.id);
    redirected.current = false;
    setQueryCode(pass.id);
    navigate({ to: '/track', search: { code: pass.id }, replace: true });
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

  const passReady = result
    ? isPassReady(result.status, result.pass_id, result.pass_status)
    : false;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
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

        {storedPasses.length > 0 && (
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {t('track.storedLabel')}
            </span>
            <div className="flex flex-wrap gap-2">
              {storedPasses.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectStoredPass(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center space-x-1.5 ${
                    selectedPassId === p.id || queryCode === p.id
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

        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2.5 pt-2">
          <label className="relative block">
            <span className="sr-only">{t('track.codeLabel')}</span>
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder={t('track.placeholder')}
              autoCapitalize="characters"
              autoComplete="off"
              className="w-full pl-8 pr-3 py-2.5 text-xs font-mono border border-slate-300 rounded-xl focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF] bg-white"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-[#0447AF] hover:bg-[#033685] text-white py-2.5 px-5 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center space-x-1.5 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>{loading ? t('track.searching') : t('track.search')}</span>
          </button>
        </form>
      </div>

      {loading && <TimelineSkeleton />}

      {isError && queryCode && (
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-[#CC1424] mx-auto" />
          <h3 className="font-bold text-sm text-red-900">
            {t('track.notFound')}
          </h3>
          <p className="text-xs text-red-700">
            {(queryError as Error)?.message || t('track.notFoundHint')}
          </p>
        </div>
      )}

      {result && !loading && passReady && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-950">
          <Loader2 className="w-5 h-5 animate-spin text-emerald-700 flex-shrink-0" />
          <p className="text-sm font-semibold">{t('track.redirecting')}</p>
        </div>
      )}

      {result && !loading && !passReady && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl text-xs">
            <div>
              <span className="text-slate-500 font-medium block">{t('track.vehicle')}</span>
              <span className="font-mono font-bold text-slate-900">{result.vehicle_number}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">{t('track.driver')}</span>
              <span className="font-semibold text-slate-900">{result.driver_name}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">{t('track.route')}</span>
              <span className="font-semibold text-slate-900">{result.departure_location} → {result.destination}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">{t('track.cargo')}</span>
              <span className="font-semibold text-slate-900">{result.cargo_type}</span>
            </div>
          </div>

          <p className="text-xs text-slate-600">{t('track.pendingHint')}</p>
        </div>
      )}
    </div>
  );
};
