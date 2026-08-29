
import { PhoneCall } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function EmergencyBanner() {
  return (
    <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-red-100 border-b border-red-800/60 px-4 py-2 text-xs md:text-sm font-medium no-print">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="font-bold tracking-wide uppercase text-red-300">Nepal Flood Emergency Operations Active:</span>
          <span>Only verified vehicles with approved E-Pass permitted across active checkpoints.</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <Link to="/roads" className="underline hover:text-white transition-colors">
            View Road Closures & Hazards &rarr;
          </Link>
          <div className="flex items-center gap-1.5 bg-red-950/80 px-2 py-0.5 rounded border border-red-700/60">
            <PhoneCall className="w-3.5 h-3.5 text-red-400" />
            <span>Emergency Hotline: 1155 / 100</span>
          </div>
        </div>
      </div>
    </div>
  );
}
