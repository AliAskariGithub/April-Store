// components/ui/Spinner.tsx
import React from 'react';
import { cn } from '@/lib/utils';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'accent';
  className?: string;
}

export function Spinner({ size = 'md', color = 'primary', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  const colorClasses = {
    primary: 'border-[#024E44]/20 border-t-[#024E44]',
    white: 'border-white/20 border-t-white',
    accent: 'border-[#CCEB6C]/30 border-t-[#CCEB6C]',
  };

  return (
    <div
      className={cn(
        'rounded-full animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="loading"
    />
  );
}
