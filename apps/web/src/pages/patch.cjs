const fs = require('fs');

const path = '/home/saroj/Documents/projects/relief-vehicle/apps/web/src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

const replacements = [
  // 2a
  {
    find: `              {/* KPI Metrics Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-slate-500 text-[11px] font-semibold uppercase">{t('admin.metricTotalApplied')}</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalAppsCount}</span>
                    <FileText className="w-5 h-5 text-[#0447AF]" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block">कुल राहत तथा उद्धार दर्ता</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-red-200 bg-red-50/20 shadow-2xs space-y-1">
                  <span className="text-red-700 text-[11px] font-bold uppercase">{t('admin.metricUrgentPriority')}</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl sm:text-3xl font-black text-red-600">{urgentCount}</span>
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="text-[10px] text-red-600 font-medium block">P1 Critical / P2 High</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-2xs space-y-1">
                  <span className="text-emerald-700 text-[11px] font-bold uppercase">{t('admin.metricActivePasses')}</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl sm:text-3xl font-black text-emerald-700">{activePassesCount}</span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium block">जारी तथा स्वीकृत ई-पास</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-2xs space-y-1">
                  <span className="text-amber-700 text-[11px] font-bold uppercase">{t('admin.metricPending')}</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl sm:text-3xl font-black text-amber-700">{pendingCount}</span>
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-[10px] text-amber-600 font-medium block">प्रतीक्षारत समीक्षा</span>
                </div>
              </div>`,
    replace: `              {/* KPI Metrics Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="h-1 bg-[#0447AF]" />
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{t('admin.metricTotalApplied')}</span>
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                        <FileText className="w-3.5 h-3.5 text-[#0447AF]" />
                      </div>
                    </div>
                    <span className="text-3xl font-black text-slate-900 tabular-nums block">{totalAppsCount}</span>
                    <span className="text-[10px] text-slate-400 font-medium block">कुल राहत तथा उद्धार दर्ता</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="h-1 bg-[#CC1424]" />
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-red-700 uppercase tracking-wide">{t('admin.metricUrgentPriority')}</span>
                      <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#CC1424]" />
                      </div>
                    </div>
                    <span className="text-3xl font-black text-red-600 tabular-nums block">{urgentCount}</span>
                    <span className="text-[10px] text-red-500 font-medium block">P1 Critical / P2 High</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="h-1 bg-emerald-500" />
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">{t('admin.metricActivePasses')}</span>
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                    </div>
                    <span className="text-3xl font-black text-emerald-700 tabular-nums block">{activePassesCount}</span>
                    <span className="text-[10px] text-emerald-600 font-medium block">जारी तथा स्वीकृत ई-पास</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="h-1 bg-amber-400" />
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">{t('admin.metricPending')}</span>
                      <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                      </div>
                    </div>
                    <span className="text-3xl font-black text-amber-700 tabular-nums block">{pendingCount}</span>
                    <span className="text-[10px] text-amber-600 font-medium block">प्रतीक्षारत समीक्षा</span>
                  </div>
                </div>
              </div>`
  },
  // 2b
  {
    find: `          {/* Header Identity */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <img
                src="https://giwmscdnone.gov.np/static/assets/image/Emblem_of_Nepal.png"
                alt="Emblem of Nepal"
                className="h-10 w-auto object-contain flex-shrink-0"
              />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-red-400 block">
                  {t('admin.title')}
                </span>
                <h2 className="text-sm font-bold text-white leading-tight">
                  {t('app.title')}
                </h2>
              </div>
            </div>`,
    replace: `          {/* Header Identity */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 ring-1 ring-white/10 flex items-center justify-center flex-shrink-0">
                <img
                  src="https://giwmscdnone.gov.np/static/assets/image/Emblem_of_Nepal.png"
                  alt="Emblem of Nepal"
                  className="h-7 w-auto object-contain"
                />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold tracking-[0.18em] text-[#CC1424] block">
                  {t('admin.title')}
                </span>
                <h2 className="text-sm font-bold text-white leading-tight">
                  {t('app.title')}
                </h2>
              </div>
            </div>`
  },
  // 2c
  {
    find: `                    ? 'bg-[#0447AF] text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'`,
    replace: `                    ? 'bg-[#0447AF] text-white shadow-md shadow-[#0447AF]/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'`,
    global: true
  },
  // 2d
  {
    find: `<header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">`,
    replace: `<header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0 relative">`
  },
  // 2e
  {
    find: `<span className="font-bold text-slate-900 capitalize">`,
    replace: `<span className="font-bold text-[#0447AF] capitalize">`
  },
  // 2f
  {
    find: `            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800">
              <Clock className="w-3.5 h-3.5 text-red-600" />
              <span>{currentTime || 'NPT'}</span>
              <span className="text-[10px] text-slate-500 font-sans font-semibold">NPT (नेपाल समय)</span>
            </div>`,
    replace: `            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono font-bold text-white">
              <Clock className="w-3 h-3 text-[#CC1424]" />
              <span className="tabular-nums">{currentTime || 'NPT'}</span>
              <span className="text-[9px] text-slate-400 font-sans font-semibold tracking-wide">NPT</span>
            </div>`
  },
  // 2g part 1
  {
    find: `className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold transition-colors"`,
    replace: `className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0447AF] hover:bg-[#033685] text-white border border-[#0447AF] rounded-lg text-xs font-bold transition-colors shadow-sm"`
  },
  // 2g part 2
  {
    find: `<Download className="w-3.5 h-3.5 text-slate-600" />`,
    replace: `<Download className="w-3.5 h-3.5 text-white" />`
  },
  // 2h
  {
    find: `<main className="flex-1 flex flex-col bg-slate-50 min-w-0 overflow-hidden">`,
    replace: `<main className="flex-1 flex flex-col bg-[#F4F8FF] min-w-0 overflow-hidden">`
  },
  // 2i
  {
    find: `className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 px-3 rounded-lg text-xs font-bold shadow-md transition-all"`,
    replace: `className="w-full flex items-center justify-center space-x-2 bg-violet-600 hover:bg-violet-700 text-white py-2 px-3 rounded-lg text-xs font-bold shadow-sm transition-colors"`
  },
  // 2j
  {
    find: `<div className="p-4 bg-slate-950/80 border-t border-slate-800 space-y-2">`,
    replace: `<div className="p-4 bg-slate-950 border-t border-slate-800/60 space-y-2">`
  },
  // 2k
  {
    find: `<div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 space-y-2">`,
    replace: `<div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/40 space-y-2">`
  },
  // 2l
  {
    find: `<div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-3 shadow-2xs">`,
    replace: `<div className="bg-red-50 border border-red-300 rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-3 shadow-sm">`
  },
  // 2m
  {
    find: `className="hover:bg-slate-50/80 transition-colors"`,
    replace: `className="hover:bg-blue-50/50 transition-colors cursor-pointer"`,
    global: true
  },
  // 2n
  {
    find: `<tr className="bg-slate-50 text-slate-700 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">`,
    replace: `<tr className="bg-[#F4F8FF] text-slate-600 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200">`
  },
  // 2o
  {
    find: `<div className="flex flex-col lg:flex-row min-h-[88vh] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">`,
    replace: `<div className="flex flex-col lg:flex-row min-h-[88vh] bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">`
  }
];

let failed = [];

replacements.forEach((r, i) => {
  if (r.global) {
    if (!content.includes(r.find)) {
      failed.push('Rule ' + i + ' (global)');
    } else {
      content = content.split(r.find).join(r.replace);
    }
  } else {
    if (!content.includes(r.find)) {
      failed.push('Rule ' + i);
    } else {
      content = content.replace(r.find, r.replace);
    }
  }
});

fs.writeFileSync(path, content, 'utf8');

if (failed.length > 0) {
  console.log("Failed to find and replace:", failed.join(", "));
} else {
  console.log("All replacements successful!");
}
