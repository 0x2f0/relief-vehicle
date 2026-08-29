import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { getPublicStats } from '../lib/api';
import { PublicStats } from '../lib/types';
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
  const [stats, setStats] = useState<PublicStats>({
    activePasses: 0,
    approvedApplications: 0,
    roadUpdates: 0,
    checkpointScans: 0,
  });
  const [hasTrackingAccess, setHasTrackingAccess] = useState(false);
  const [isOfficer, setIsOfficer] = useState(false);
  const [storedCount, setStoredCount] = useState(0);

  useEffect(() => {
    getPublicStats()
      .then((data) => setStats(data))
      .catch(() => {});

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
        {/* Subtle Ambient Depth Glow and Emblem Watermark */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <img
          src="https://giwmscdnone.gov.np/static/assets/image/Emblem_of_Nepal.png"
          alt=""
          className="absolute -right-6 -bottom-6 w-60 h-60 object-contain opacity-5 pointer-events-none hidden md:block"
        />

        <div className="p-6 sm:p-9 md:p-10 relative z-10 space-y-6">
          {/* Live Status Pill */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-blue-100 backdrop-blur-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span>{t('home.hero.badge')}</span>
          </div>

          {/* Heading & Value Proposition */}
          <div className="max-w-2xl space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {t('home.hero.title')}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-blue-100/90 leading-relaxed">
              {t('home.hero.desc')}
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Link
              to="/apply"
              className="inline-flex items-center space-x-2 bg-[#CC1424] hover:bg-[#B00F1E] text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{t('home.hero.cta_apply')}</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Link>

            {hasTrackingAccess && (
              <Link
                to="/track"
                className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all backdrop-blur-xs hover:border-white/40"
              >
                <Search className="w-4 h-4 text-blue-200" />
                <span>
                  {t('home.hero.cta_track')} {storedCount > 1 ? `(${storedCount})` : ''}
                </span>
              </Link>
            )}

            <Link
              to="/roads"
              className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all backdrop-blur-xs hover:border-white/40"
            >
              <MapPin className="w-4 h-4 text-amber-300" />
              <span>{t('roads.title')}</span>
            </Link>
          </div>
        </div>

        {/* Live Operational Metrics Counter Strip */}
        <div className="border-t border-white/15 bg-black/20 backdrop-blur-xs px-6 py-4 relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10 text-center">
            <div className="pt-2 sm:pt-0">
              <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                {stats.activePasses}
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold text-blue-200 uppercase tracking-wider mt-0.5">
                {t('home.stats.active')}
              </div>
            </div>

            <div className="pt-2 sm:pt-0 sm:pl-4">
              <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono tracking-tight">
                {stats.approvedApplications}
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold text-blue-200 uppercase tracking-wider mt-0.5">
                {t('home.stats.approved')}
              </div>
            </div>

            <div className="pt-2 sm:pt-0 sm:pl-4">
              <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight">
                {stats.roadUpdates}
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold text-blue-200 uppercase tracking-wider mt-0.5">
                {t('home.stats.roads')}
              </div>
            </div>

            <div className="pt-2 sm:pt-0 sm:pl-4">
              <div className="text-2xl sm:text-3xl font-black text-sky-200 font-mono tracking-tight">
                {stats.checkpointScans}
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold text-blue-200 uppercase tracking-wider mt-0.5">
                {t('home.stats.checkpoints')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FIELD OPERATIONS & SERVICES */}
      <section className="space-y-4" aria-label="Field Operations">
        <div className="px-1">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#0447AF]"></span>
            <span>{t('home.roads.title')} & {hasTrackingAccess ? t('track.title') : t('nav.apply')}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time highway transit advisories and emergency fleet coordination services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Highway & Road Conditions */}
          <Link
            to="/roads"
            className="group bg-white rounded-xl border border-slate-200 p-6 shadow-2xs hover:shadow-sm hover:border-red-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-lg bg-red-50 text-[#CC1424] group-hover:bg-[#CC1424] group-hover:text-white transition-all shadow-2xs">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-red-700 bg-red-50 border border-red-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Live Updates</span>
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
              to="/verify"
              className="group bg-white rounded-xl border border-slate-200 p-6 shadow-2xs hover:shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-lg bg-blue-50 text-[#0447AF] group-hover:bg-[#0447AF] group-hover:text-white transition-all shadow-2xs">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-[#0447AF] bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                    <span>Officer Portal</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0447AF] transition-colors">
                    {t('home.verify.title')}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1.5">
                    {t('home.verify.desc')}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0447AF]">
                <span>Open Checkpoint Scanner</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ) : hasTrackingAccess ? (
            <Link
              to="/track"
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

