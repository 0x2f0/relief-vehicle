
import { QRCodeSVG } from 'qrcode.react';
import { Pass } from '../../lib/types';
import { PriorityBadge } from '../common/Badge';
import { ShieldCheck, MapPin, Calendar, Clock, Printer, Share2, CheckCircle2, AlertOctagon } from 'lucide-react';

interface PassCardProps {
  pass: Pass;
  showPrintButton?: boolean;
}

export function PassCard({ pass, showPrintButton = true }: PassCardProps) {
  const isRevoked = pass.status === 'revoked';
  const isExpired = pass.status === 'expired';
  

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Emergency E-Pass: ${pass.vehicle_number || pass.application_id || pass.id}`,
        text: `Official Emergency Movement E-Pass for ${pass.vehicle_number} (${pass.approved_route})`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Pass link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Top action controls */}
      {showPrintButton && (
        <div className="flex items-center justify-end gap-2 mb-4 no-print">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 transition-colors"
          >
            <Share2 className="w-4 h-4 text-slate-400" /> Share Pass
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-red-700 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-md transition-colors"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>
      )}

      {/* Official Pass Container */}
      <div className={`relative bg-slate-900 border-2 ${
        isRevoked ? 'border-red-600' : isExpired ? 'border-amber-600' : 'border-emerald-500/80'
      } rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden print:bg-white print:text-black print:border-black print:p-4`}>
        
        {/* Security Watermark background for print & display */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none print:opacity-[0.06]">
          <ShieldCheck className="w-96 h-96 text-white print:text-black" />
        </div>

        {/* Header Ribbon */}
        <div className="border-b border-slate-800 pb-4 mb-6 print:border-black">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-700 flex items-center justify-center text-white shadow-lg print:border print:border-black">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-red-400 print:text-black">
                  NEPAL DISASTER RELIEF VEHICLE E-PASS SYSTEM
                </p>
                <h2 className="text-base sm:text-xl font-black text-white tracking-tight print:text-black">
                  EMERGENCY VEHICLE E-PASS
                </h2>
                <p className="text-xs text-slate-400 print:text-black">
                  Disaster Response & Relief Movement Authorization
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block mb-1">
                {pass.priority && <PriorityBadge priority={pass.priority} />}
              </div>
              <p className="text-xs font-mono font-bold text-slate-400 print:text-black">
                {pass.application_id || pass.id}
              </p>
            </div>
          </div>

          {/* Status banner */}
          <div className={`mt-4 py-2 px-3 rounded-lg text-center font-extrabold text-sm tracking-wider uppercase ${
            isRevoked
              ? 'bg-red-950 text-red-300 border border-red-800 print:bg-gray-200 print:text-red-600'
              : isExpired
              ? 'bg-amber-950 text-amber-300 border border-amber-800 print:bg-gray-200 print:text-black'
              : 'bg-emerald-950 text-emerald-300 border border-emerald-800 print:bg-gray-100 print:text-black'
          }`}>
            {isRevoked ? (
              <span className="flex items-center justify-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-red-400" /> REVOKED PASS — TRANSIT PROHIBITED
              </span>
            ) : isExpired ? (
              <span>EXPIRED E-PASS — VALIDITY PERIOD CONCLUDED</span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> OFFICIAL EMERGENCY E-PASS — VERIFIED ACTIVE
              </span>
            )}
          </div>
        </div>

        {/* Main Body: Details & QR Code */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          {/* QR Code Column */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-950/80 rounded-xl border border-slate-800 print:bg-white print:border-black">
            <div className="p-2 bg-white rounded-lg shadow-inner">
              <QRCodeSVG
                value={
                  `https://relief-vehicle.pages.dev/pass/${pass.application_id || pass.id}`
                }
                size={140}
                level="M"
                includeMargin={true}
              />
            </div>
            <p className="text-[10px] text-center font-mono text-slate-400 mt-2 font-bold print:text-black">
              SCAN AT CHECKPOINT
            </p>
            <p className="text-[9px] text-slate-500 text-center uppercase tracking-tighter">
              https://relief-vehicle.pages.dev/pass/{pass.application_id || pass.id}
            </p>
          </div>

          {/* Vehicle & Organization Details */}
          <div className="sm:col-span-2 space-y-3 text-xs">
            {/* Vehicle license plate display */}
            <div className="inline-block bg-slate-800 border-2 border-slate-700 px-4 py-1.5 rounded-lg shadow-inner print:bg-gray-100 print:border-black">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest print:text-black">VEHICLE REGISTRATION</span>
              <span className="text-base sm:text-lg font-mono font-black text-amber-300 tracking-wider print:text-black">
                {pass.vehicle_number || 'N/A'}
              </span>
              <span className="text-xs text-slate-300 ml-2 font-medium print:text-black">
                ({pass.vehicle_type || 'Vehicle'})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold print:text-black">Organization</span>
                <span className="font-semibold text-slate-200 text-xs print:text-black">{pass.org_name || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold print:text-black">Driver Full Name</span>
                <span className="font-semibold text-slate-200 text-xs print:text-black">{pass.driver_name || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold print:text-black">Driver Contact</span>
                <span className="font-mono text-slate-300 text-xs print:text-black">{pass.driver_phone || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold print:text-black">Personnel on Board</span>
                <span className="font-semibold text-slate-300 text-xs print:text-black">{pass.passenger_count || 1} Persons</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold print:text-black">Purpose of Movement</span>
              <p className="text-slate-300 italic text-xs print:text-black">{pass.travel_purpose || 'Flood disaster emergency transportation'}</p>
            </div>
          </div>
        </div>

        {/* Route and Validity Section */}
        <div className="mt-6 pt-4 border-t border-slate-800 space-y-3 text-xs print:border-black">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 print:bg-gray-100 print:border-black">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-red-400 mt-0.5 shrink-0 print:text-black" />
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 print:text-black">Approved Emergency Route</span>
                <p className="font-bold text-slate-100 text-xs sm:text-sm print:text-black">
                  {pass.approved_route || `${pass.departure_location || 'Origin'} → ${pass.destination || 'Destination'}`}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800 print:bg-white print:border-black">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1 print:text-black">
                <Calendar className="w-3.5 h-3.5 text-emerald-400 print:text-black" />
                <span className="text-[10px] font-bold uppercase">Valid From</span>
              </div>
              <p className="font-semibold text-slate-200 text-xs print:text-black">
                {new Date(pass.valid_from).toLocaleString()}
              </p>
            </div>

            <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800 print:bg-white print:border-black">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1 print:text-black">
                <Clock className="w-3.5 h-3.5 text-amber-400 print:text-black" />
                <span className="text-[10px] font-bold uppercase">Valid Until</span>
              </div>
              <p className="font-semibold text-slate-200 text-xs print:text-black">
                {new Date(pass.valid_until).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer / Authority signature */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 print:border-black print:text-black">
          <div>
            <span className="font-bold block text-slate-300 print:text-black">{pass.issuing_authority || 'Nepal Disaster Relief Vehicle E-Pass Coordination'}</span>
            <span>Issued by authorized officer: {pass.issued_by}</span>
          </div>
          <div className="text-right font-mono text-[10px]">
            Security Token ID: {pass.application_id || pass.id}
          </div>
        </div>
      </div>
    </div>
  );
}
