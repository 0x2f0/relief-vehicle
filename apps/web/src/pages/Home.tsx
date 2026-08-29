import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useI18n } from '../lib/i18n';
import { publicStatsQueryOptions } from '../lib/queryClient';
import { HeroStatCardSkeleton } from '../components/common/Skeleton';
import { isUserAuthorizedForTracking, getStoredPasses } from '../lib/authTracker';
import {
  Search,
  MapPin,
  QrCode,
  ShieldAlert,
  ArrowRight,
  Zap,
  Shield,
  Truck,
  AlertTriangle,
  FilePlus,
  Clock,
} from 'lucide-react';

export const Home = () => {
  const { t } = useI18n();
  const { data: stats, isLoading: statsLoading } = useQuery(publicStatsQueryOptions());

  const [hasTrackingAccess, setHasTrackingAccess] = useState(() => isUserAuthorizedForTracking());
  const [isOfficer, setIsOfficer] = useState(() => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('relief_auth_token') || localStorage.getItem('token');
    return Boolean(token);
  });
  const [storedCount, setStoredCount] = useState(() => getStoredPasses().length);

  useEffect(() => {
    const check = () => {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('relief_auth_token') || localStorage.getItem('token');
      setIsOfficer(Boolean(token));
      const passes = getStoredPasses();
      setStoredCount(passes.length);
      setHasTrackingAccess(isUserAuthorizedForTracking());
    };

    check();
    window.addEventListener('storage', check);
    window.addEventListener('auth-change', check);
    return () => {
      window.removeEventListener('storage', check);
      window.removeEventListener('auth-change', check);
    };
  }, []);

  return (
    <div className="space-y-10 sm:space-y-12 max-w-6xl mx-auto">
      {/* 1. PRIMARY HERO & COMMAND CENTER */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#052458] via-[#043B93] to-[#094EA7] text-white shadow-md border border-blue-900/40">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative p-6 sm:p-10 z-10 space-y-8">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-white/15">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="uppercase text-[11px] text-blue-100">{t('app.dept')}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight sm:leading-snug text-white">
              {t('home.hero.title')}
            </h1>

            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-normal">
              {t('home.hero.subtitle')}
            </p>
          </div>

          {/* Primary Quick-Action Buttons */}
          <div className="flex flex-wrap gap-3.5 pt-2">
            {!isOfficer && (
              <Link
                to="/apply"
                preload="intent"
                className="inline-flex items-center justify-center space-x-2 bg-[#CC1424] hover:bg-[#B00F1E] text-white font-bold px-6 py-3.5 rounded-xl text-sm shadow-md transition-all active:scale-[0.98] border border-red-500/30"
              >
                <FilePlus className="w-4 h-4 text-white" />
                <span>{t('home.hero.applyBtn')}</span>
              </Link>
            )}

            <Link
              to="/track"
              preload="intent"
              className="inline-flex items-center justify-center space-x-2 bg-white text-[#0447AF] hover:bg-blue-50 font-bold px-6 py-3.5 rounded-xl text-sm shadow-md transition-all active:scale-[0.98] group"
            >
              <Search className="w-4 h-4 text-[#0447AF]" />
              <span>{t('home.hero.trackBtn')}</span>
            </Link>

            <Link
              to="/roads"
              preload="intent"
              className="inline-flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3.5 rounded-xl text-sm backdrop-blur-md transition-all border border-white/20"
            >
              <MapPin className="w-4 h-4 text-amber-300" />
              <span>{t('home.hero.roadsBtn')}</span>
            </Link>

            {isOfficer && (
              <Link
                to="/admin"
                preload="intent"
                className="inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-xl text-sm shadow-md transition-all active:scale-[0.98]"
              >
                <QrCode className="w-4 h-4" />
                <span>{t('admin.dashboard')}</span>
              </Link>
            )}
          </div>

          {/* Live Operational Metrics Ribbon with Skeletons */}
          {statsLoading ? (
            <HeroStatCardSkeleton />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/15">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10 space-y-1">
                <span className="text-blue-200 text-xs font-medium uppercase tracking-wider block">
                  {t('home.stats.activePasses')}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white block">
                  {stats?.activePasses ?? 0}
                </span>
                <span className="text-[11px] text-blue-200/70 font-medium">सक्रिय ई-पासहरू</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10 space-y-1">
                <span className="text-blue-200 text-xs font-medium uppercase tracking-wider block">
                  {t('home.stats.approved')}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white block">
                  {stats?.approvedApplications ?? 0}
                </span>
                <span className="text-[11px] text-blue-200/70 font-medium">स्वीकृत राहत सवारी</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10 space-y-1">
                <span className="text-blue-200 text-xs font-medium uppercase tracking-wider block">
                  {t('home.stats.scans')}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white block">
                  {stats?.checkpointScans ?? 0}
                </span>
                <span className="text-[11px] text-blue-200/70 font-medium">चेकपोइन्ट स्क्यान</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10 space-y-1">
                <span className="text-blue-200 text-xs font-medium uppercase tracking-wider block">
                  {t('home.stats.roads')}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-amber-300 block">
                  {stats?.roadUpdates ?? 0}
                </span>
                <span className="text-[11px] text-blue-200/70 font-medium">राजमार्ग स्थिति सूचना</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. DYNAMIC WORKFLOW & ACCESS HUB */}
      <section className="space-y-4" aria-label="Quick Access Portals">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Highway Conditions */}
          <Link
            to="/roads"
            preload="intent"
            className="group bg-white rounded-xl border border-slate-200 p-6 shadow-2xs hover:shadow-sm hover:border-red-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-lg bg-red-50 text-[#CC1424] group-hover:bg-[#CC1424] group-hover:text-white transition-all shadow-2xs">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>{t('home.roads.liveUpdates')}</span>
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#CC1424] transition-colors">
                  {t('home.roads.title')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1.5">
                  {t('home.roads.desc')}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#CC1424]">
              <span>View Highway Clearance Map</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Dynamic Role/Storage Card */}
          {isOfficer ? (
            <Link
              to="/admin"
              preload="intent"
              className="group bg-white rounded-xl border border-slate-200 p-6 shadow-2xs hover:shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-lg bg-blue-50 text-[#0447AF] group-hover:bg-[#0447AF] group-hover:text-white transition-all shadow-2xs">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-[#0447AF] bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                    <span>Command Center</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0447AF] transition-colors">
                    {t('admin.dashboard')}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1.5">
                    Manage all applied passes, inspect cargo manifests, verify QR passes at checkpoints, and monitor routes.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0447AF]">
                <span>Open Command Center</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ) : hasTrackingAccess ? (
            <Link
              to="/track"
              preload="intent"
              className="group bg-white rounded-xl border border-slate-200 p-6 shadow-2xs hover:shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-lg bg-blue-50 text-[#0447AF] group-hover:bg-[#0447AF] group-hover:text-white transition-all shadow-2xs">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-[#0447AF] bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                    <span>{storedCount} Active Application{storedCount > 1 ? 's' : ''}</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0447AF] transition-colors">
                    {t('track.title')}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1.5">
                    View official approval status, route authorization, and access your digital QR movement pass.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0447AF]">
                <span>Track Registered Vehicles</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ) : (
            <Link
              to="/apply"
              preload="intent"
              className="group bg-white rounded-xl border border-slate-200 p-6 shadow-2xs hover:shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-lg bg-blue-50 text-[#0447AF] group-hover:bg-[#0447AF] group-hover:text-white transition-all shadow-2xs">
                    <FilePlus className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                    <span>Fast-Track Portal</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0447AF] transition-colors">
                    {t('nav.apply')}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1.5">
                    Submit vehicle documents, driver details, and relief cargo manifest for expedited disaster corridor transit.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0447AF]">
                <span>Begin E-Pass Application</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* 3. CLEARANCE PRIORITY GUIDELINES */}
      <section className="space-y-4" aria-label="Clearance Guidelines">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-1">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-[#0447AF]" />
              <span>{t('home.guidelines.title')}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('home.guidelines.subtitle')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tier 1: Critical */}
          <div className="bg-white rounded-xl border border-red-200 p-5 shadow-2xs hover:shadow-xs transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200/80 px-2.5 py-0.5 rounded-full">
                  <Zap className="w-3 h-3 text-red-600 fill-red-600" />
                  <span>{t('home.guidelines.criticalTitle')}</span>
                </span>
                <span className="text-[10px] font-bold text-red-600 font-mono tracking-wider">TIER 1</span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                {t('home.guidelines.criticalVehicles')}
              </h3>
            </div>
            <div className="pt-2.5 text-[11px] font-medium text-red-700 bg-red-50/60 rounded-lg p-2.5 border border-red-100">
              ⚡ {t('home.guidelines.criticalClearance')}
            </div>
          </div>

          {/* Tier 2: High */}
          <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-2xs hover:shadow-xs transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full">
                  <Shield className="w-3 h-3 text-amber-600" />
                  <span>{t('home.guidelines.highTitle')}</span>
                </span>
                <span className="text-[10px] font-bold text-amber-700 font-mono tracking-wider">TIER 2</span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                {t('home.guidelines.highVehicles')}
              </h3>
            </div>
            <div className="pt-2.5 text-[11px] font-medium text-amber-800 bg-amber-50/60 rounded-lg p-2.5 border border-amber-100">
              🛡️ {t('home.guidelines.highClearance')}
            </div>
          </div>

          {/* Tier 3: Medium */}
          <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-2xs hover:shadow-xs transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#0447AF] bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full">
                  <Truck className="w-3 h-3 text-[#0447AF]" />
                  <span>{t('home.guidelines.mediumTitle')}</span>
                </span>
                <span className="text-[10px] font-bold text-[#0447AF] font-mono tracking-wider">TIER 3</span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                {t('home.guidelines.mediumVehicles')}
              </h3>
            </div>
            <div className="pt-2.5 text-[11px] font-medium text-[#0447AF] bg-blue-50/60 rounded-lg p-2.5 border border-blue-100">
              🚚 {t('home.guidelines.mediumClearance')}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
