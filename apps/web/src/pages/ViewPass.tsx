import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { useI18n } from '../lib/i18n';
import { passQueryOptions } from '../lib/queryClient';
import { PassSkeleton } from '../components/common/Skeleton';
import { Printer, Share2, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { VehicleLogo } from '../components/common/VehicleLogo';

export const ViewPass = () => {
  const params = useParams({ strict: false }) as { id?: string };
  const id = params?.id || '';
  const { t } = useI18n();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const { data: passRes, isLoading, isError } = useQuery(passQueryOptions(id));
  const passData = passRes?.pass;

  useEffect(() => {
    const code = passData?.application_id || passData?.id;
    if (!code || code === id) return;
    navigate({ to: '/pass/$id', params: { id: code }, replace: true });
  }, [passData, id, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Relief E-Pass: ${passData?.application_id || passData?.id || id}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading && !isError) {
    return (
      <div className="space-y-4 max-w-xl mx-auto">
        <PassSkeleton />
      </div>
    );
  }

  if (!passData) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-[#CC1424] mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">{t('viewpass.notFound')}</h2>
        <p className="text-xs text-slate-600">
          {t('viewpass.notFoundHint')}
        </p>
        <Link
          to="/"
          preload="intent"
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#0447AF] text-white text-xs font-bold rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('viewpass.home')}</span>
        </Link>
      </div>
    );
  }

  const code = passData.application_id || passData.id;
  const qrValue = `${window.location.origin}/pass/${code}`;

  return (
    <div className="space-y-6 max-w-xl mx-auto print:max-w-none print:m-0 print:p-0">
      {/* Non-printed Toolbar */}
      <div className="flex justify-between items-center print:hidden">
        <Link
          to="/"
          preload="intent"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-[#0447AF]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('viewpass.back')}</span>
        </Link>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? t('viewpass.shared') : t('viewpass.share')}</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#0447AF] hover:bg-[#033685] text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t('viewpass.print')}</span>
          </button>
        </div>
      </div>

      {/* Official Government Pass Card */}
      <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-md p-6 space-y-5 print:border print:shadow-none">
        {/* Pass Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-slate-200">
          <div className="flex items-center space-x-3">
            <VehicleLogo size="lg" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                {t('app.dept')}
              </span>
              <h1 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                आपतकालीन राहत सवारी ई-पास
              </h1>
              <span className="text-[11px] font-mono text-[#0447AF] font-bold">
                {t('viewpass.codeLabel')}: {code}
              </span>
            </div>
          </div>

          <div className="text-right space-y-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              {t('viewpass.active')}
            </span>
          </div>
        </div>

        {/* QR Code Security Frame */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <QRCodeSVG value={qrValue} size={180} level="H" includeMargin={true} />
          </div>
          <span className="text-[11px] font-mono text-slate-500 font-semibold">
            {t('viewpass.scanHint')}
          </span>
        </div>

        {/* Manifest Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50/70 p-4 rounded-xl border border-slate-200">
          <div>
            <span className="text-slate-500 font-medium block">संस्था / निकाय:</span>
            <span className="font-bold text-slate-900 block">{passData.org_name || passData.applicant_name}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">सवारी नम्बर:</span>
            <span className="font-mono font-bold text-slate-900 block text-sm">{passData.vehicle_number}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">चालक:</span>
            <span className="font-semibold text-slate-900 block">{passData.driver_name} ({passData.driver_phone})</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">राहत सामग्री:</span>
            <span className="font-semibold text-slate-900 block">{passData.cargo_type}</span>
          </div>
          <div className="col-span-2">
            <span className="text-slate-500 font-medium block">प्रस्थान ➡️ गन्तव्य:</span>
            <span className="font-bold text-slate-900 block">
              {passData.departure_location} ➡️ {passData.destination}
            </span>
            <span className="text-[11px] text-slate-600 block mt-0.5">{passData.approved_route}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">मान्य मिति (From):</span>
            <span className="font-mono text-slate-800">{new Date(passData.valid_from).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">समाप्ति मिति (Until):</span>
            <span className="font-mono font-bold text-red-600">{new Date(passData.valid_until).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Security Seal */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Digital Government Verification Seal</span>
          </span>
          <span className="font-mono">{passData.issuing_authority}</span>
        </div>
      </div>
    </div>
  );
};
