import { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { useI18n } from '../lib/i18n';
import { CheckCircle2, Copy, Check, Search, Home as HomeIcon, AlertTriangle } from 'lucide-react';

export const ApplicationSuccess = () => {
  const params = useParams({ strict: false }) as { id?: string };
  const id = params?.id || '';
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (id) {
      navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xs border border-slate-200 p-6 sm:p-10 text-center space-y-6">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-black text-slate-900">
          {t('applied.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
          {t('applied.desc')}
        </p>
      </div>

      <div className="bg-[#F4F8FF] border border-blue-200 rounded-xl p-5 text-left max-w-md mx-auto space-y-2">
        <div className="flex justify-between items-start">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {t('applied.idLabel')}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-[#0447AF] hover:text-[#033685]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? t('applied.copied') : t('applied.copy')}</span>
          </button>
        </div>
        <div className="text-xl sm:text-2xl font-mono font-bold text-[#0447AF] tracking-wide break-all">
          {id}
        </div>
        <p className="text-xs text-slate-500">
          {t('applied.idHint')}
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left max-w-md mx-auto flex items-start space-x-3 text-xs text-amber-900">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">{t('applied.advisoryTitle')}</span>
          <span>{t('applied.advisory')}</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Link
          to="/track"
          search={{ code: id }}
          preload="intent"
          className="inline-flex items-center space-x-2 bg-[#0447AF] hover:bg-[#033685] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <Search className="w-4 h-4" />
          <span>{t('nav.track')}</span>
        </Link>
        <Link
          to="/"
          preload="intent"
          className="inline-flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors"
        >
          <HomeIcon className="w-4 h-4 text-slate-500" />
          <span>{t('nav.home')}</span>
        </Link>
      </div>
    </div>
  );
};
