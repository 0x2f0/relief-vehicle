
import { Priority, ApplicationStatus, RoadCondition } from '../../lib/types';

export function PriorityBadge({ priority }: { priority: Priority | string }) {
  switch (priority) {
    case 'Critical':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-950/80 text-red-400 border border-red-800/80 shadow-sm shadow-red-950/50">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          CRITICAL RESCUE
        </span>
      );
    case 'High':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-800/60">
          HIGH RELIEF
        </span>
      );
    case 'Medium':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/60">
          MEDIUM AID
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
          NORMAL
        </span>
      );
  }
}

export function StatusBadge({ status }: { status: ApplicationStatus | string }) {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'issued':
    case 'approved':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-700/70">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          {status.toUpperCase()}
        </span>
      );
    case 'under_review':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/90 text-amber-300 border border-amber-700/70">
          UNDER REVIEW
        </span>
      );
    case 'submitted':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950/90 text-blue-300 border border-blue-700/70">
          SUBMITTED
        </span>
      );
    case 'info_requested':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-950/90 text-yellow-300 border border-yellow-700/70">
          INFO REQUIRED
        </span>
      );
    case 'held':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-950/90 text-orange-300 border border-orange-700/70">
          ON HOLD
        </span>
      );
    case 'revoked':
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-950/90 text-red-400 border border-red-800/80">
          {status.toUpperCase()}
        </span>
      );
    case 'expired':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
          EXPIRED
        </span>
      );
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-950/90 text-sky-300 border border-sky-700/70">
          COMPLETED
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
          {status}
        </span>
      );
  }
}

export function RoadBadge({ status }: { status: RoadCondition["status"] | string }) {
  switch (status) {
    case 'open':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          OPEN
        </span>
      );
    case 'restricted':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-800">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          RESTRICTED
        </span>
      );
    case 'emergency_only':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-orange-950 text-orange-300 border border-orange-800">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          EMERGENCY ONLY
        </span>
      );
    case 'closed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-red-950 text-red-400 border border-red-800">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          CLOSED
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-slate-800 text-slate-300">
          {status}
        </span>
      );
  }
}
