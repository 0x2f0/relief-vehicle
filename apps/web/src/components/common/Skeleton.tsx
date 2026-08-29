import React from 'react';
import { useRouterState } from '@tanstack/react-router';

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', animate = true }) => {
  return (
    <div
      className={`bg-slate-200/80 rounded-md ${animate ? 'animate-pulse' : ''} ${className}`}
      aria-hidden="true"
    />
  );
};

// Global High-Performance Loading Progress Bar
export const GlobalLoadingBar: React.FC = () => {
  const isLoading = useRouterState({ select: (s) => s.isLoading });

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent overflow-hidden pointer-events-none">
      <div className="h-full bg-gradient-to-r from-[#0447AF] via-[#CC1424] to-[#0447AF] animate-[indeterminate_1.2s_infinite_linear]" />
    </div>
  );
};

// Hero Stats Skeleton (Pixel-matched with Home Hero Ribbon to eliminate CLS)
export const HeroStatCardSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/15">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10 space-y-1.5 animate-pulse"
        >
          <div className="h-3.5 w-24 bg-white/20 rounded"></div>
          <div className="h-8 w-16 bg-white/30 rounded"></div>
          <div className="h-3 w-28 bg-white/15 rounded"></div>
        </div>
      ))}
    </div>
  );
};

// Admin Dashboard Stat Cards Skeleton (Pixel-matched with Admin Dashboard to eliminate CLS)
export const StatCardSkeleton: React.FC<{ count?: number }> = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white p-4 rounded-xl border border-slate-200/70 shadow-2xs space-y-2 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 bg-slate-200 rounded"></div>
            <div className="h-5 w-5 bg-slate-200 rounded-full"></div>
          </div>
          <div className="h-7 w-16 bg-slate-300 rounded"></div>
          <div className="h-2.5 w-24 bg-slate-100 rounded"></div>
        </div>
      ))}
    </div>
  );
};

// Data Table Skeleton (Used in Admin Dashboard & Applications List)
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 6,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden w-full animate-pulse">
      {/* Table Header */}
      <div className="bg-slate-50 p-3.5 border-b border-slate-200 flex items-center justify-between gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className={`h-3.5 bg-slate-200 rounded ${i === 0 ? 'w-24' : i === columns - 1 ? 'w-16' : 'w-20'}`} />
        ))}
      </div>
      {/* Table Rows */}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-3.5 flex items-center justify-between gap-4">
            <div className="space-y-1.5 w-28">
              <div className="h-3.5 w-20 bg-slate-200 rounded" />
              <div className="h-2.5 w-14 bg-slate-100 rounded" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="h-3.5 w-32 bg-slate-200 rounded" />
              <div className="h-2.5 w-24 bg-slate-100 rounded" />
            </div>
            <div className="space-y-1.5 w-32 hidden sm:block">
              <div className="h-3.5 w-24 bg-slate-200 rounded" />
              <div className="h-2.5 w-20 bg-slate-100 rounded" />
            </div>
            <div className="space-y-1.5 w-28 hidden md:block">
              <div className="h-3.5 w-20 bg-slate-200 rounded" />
              <div className="h-2.5 w-16 bg-slate-100 rounded" />
            </div>
            <div className="h-6 w-20 bg-slate-200 rounded-full" />
            <div className="h-7 w-16 bg-slate-200 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Road Condition Cards Skeleton
export const RoadListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-3 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row justify-between sm:items-center gap-3 animate-pulse"
        >
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-40 bg-slate-200 rounded" />
              <div className="h-5 w-20 bg-slate-200 rounded-full" />
            </div>
            <div className="h-3 w-64 bg-slate-100 rounded" />
          </div>
          <div className="h-3 w-28 bg-slate-100 rounded" />
        </div>
      ))}
    </div>
  );
};

// Timeline Clearance Skeleton (Used in Track Status)
export const TimelineSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6 w-full animate-pulse">
      {/* Top Banner */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-slate-200 rounded" />
          <div className="h-6 w-48 bg-slate-300 rounded" />
        </div>
        <div className="h-7 w-28 bg-slate-200 rounded-full" />
      </div>

      {/* Grid Manifest */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3 w-16 bg-slate-200 rounded" />
            <div className="h-4 w-24 bg-slate-300 rounded" />
          </div>
        ))}
      </div>

      {/* Timeline Steps */}
      <div className="space-y-4 pt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start space-x-3.5">
            <div className="w-6 h-6 bg-slate-200 rounded-full flex-shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-36 bg-slate-200 rounded" />
              <div className="h-3 w-64 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Pass Card Skeleton (Used in View Pass)
export const PassSkeleton: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl border-2 border-slate-200 p-6 space-y-6 shadow-sm animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-slate-200 rounded-full" />
          <div className="space-y-1.5">
            <div className="h-3 w-28 bg-slate-200 rounded" />
            <div className="h-5 w-44 bg-slate-300 rounded" />
          </div>
        </div>
        <div className="h-7 w-24 bg-slate-200 rounded-full" />
      </div>

      {/* QR Code Frame */}
      <div className="flex justify-center p-4 bg-slate-50 rounded-xl">
        <div className="w-44 h-44 bg-slate-200 rounded-xl" />
      </div>

      {/* Manifest fields */}
      <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3 w-16 bg-slate-200 rounded" />
            <div className="h-4 w-28 bg-slate-300 rounded" />
          </div>
        ))}
      </div>

      {/* Bottom Security Seal */}
      <div className="flex justify-between items-center pt-2">
        <div className="h-3 w-32 bg-slate-200 rounded" />
        <div className="h-8 w-28 bg-slate-300 rounded-lg" />
      </div>
    </div>
  );
};
