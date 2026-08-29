import React from 'react';
import { Truck } from 'lucide-react';

interface VehicleLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'blue' | 'white' | 'glass';
}

export const VehicleLogo: React.FC<VehicleLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'blue',
}) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8 rounded-lg', icon: 'w-4 h-4' },
    md: { box: 'w-10 h-10 rounded-xl', icon: 'w-5 h-5' },
    lg: { box: 'w-12 h-12 rounded-xl', icon: 'w-6 h-6' },
    xl: { box: 'w-16 h-16 rounded-2xl', icon: 'w-8 h-8' },
  };

  const variantMap = {
    blue: 'bg-[#0447AF] text-white shadow-sm border border-blue-600/30',
    white: 'bg-white text-[#0447AF] shadow-sm border border-slate-200',
    glass: 'bg-white/10 text-white backdrop-blur-xs border border-white/20',
  };

  const currentSize = sizeMap[size];
  const currentVariant = variantMap[variant];

  return (
    <div
      className={`inline-flex items-center justify-center flex-shrink-0 transition-transform ${currentSize.box} ${currentVariant} ${className}`}
      aria-hidden="true"
    >
      <Truck className={`${currentSize.icon} stroke-[2.2]`} />
    </div>
  );
};
