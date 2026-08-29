
import { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { CheckCircle2, Copy, Check, Search, Home as HomeIcon, AlertTriangle } from 'lucide-react';

export const ApplicationSuccess = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || localStorage.getItem(`token_${id}`) || '';
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
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xs border border-slate-200 p-6 sm:p-10 text-center">
      {/* Success Badge */}
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        आवेदन सफलतापूर्वक दर्ता भयो / Application Submitted
      </h1>
      <p className="text-sm text-slate-600 mb-6 max-w-lg mx-auto leading-relaxed">
        तपाईंको राहत सवारी ई-पास आवेदन सरकारी समन्वय प्रणालीमा दर्ता भएको छ। आवश्यक प्रशासनिक प्रमाणीकरण पश्चात् पास जारी गरिनेछ।
      </p>

      {/* Application ID Card */}
      <div className="bg-[#F4F8FF] border border-blue-200 rounded-xl p-5 mb-6 text-left max-w-md mx-auto">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Application ID / आवेदन नम्बर
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-[#0447AF] hover:text-[#033685]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <div className="text-xl sm:text-2xl font-mono font-bold text-[#0447AF] tracking-wide">
          {id}
        </div>
        <p className="text-xs text-slate-500 mt-2">
          स्थिति जाँच गर्न वा पास प्रिन्ट गर्न यो आवेदन नम्बर सुरक्षित राख्नुहोस्।
        </p>
      </div>

      {/* Important Advisory */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 text-left max-w-md mx-auto flex items-start space-x-3 text-xs text-amber-900">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">महत्त्वपूर्ण जानकारी:</span>
          <span>बाढी प्रभावित क्षेत्रमा सुरक्षा चेकपोइन्टहरूमा डिजिटल QR पास अनिवार्य जाँच गरिनेछ। पास जारी भएपछि मात्र यात्रा सुरु गर्नुहोस्।</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          to={`/track?id=${encodeURIComponent(id || '')}${token ? `&token=${encodeURIComponent(token)}` : ''}`}
          className="inline-flex items-center space-x-2 bg-[#0447AF] hover:bg-[#033685] text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-colors shadow-xs"
        >
          <Search className="w-4 h-4" />
          <span>{t('nav.track')}</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors"
        >
          <HomeIcon className="w-4 h-4 text-slate-500" />
          <span>{t('nav.home')}</span>
        </Link>
      </div>
    </div>
  );
};

