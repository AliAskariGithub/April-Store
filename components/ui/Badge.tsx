// components/ui/Badge.tsx
import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'accent' | 'primary' | 'neutral' | 'outline' | 'success' | 'danger' | 'sale' | 'bestseller' | 'new';
  size?: 'sm' | 'md';
}

export function Badge({ className, variant = 'primary', size = 'sm', children, ...props }: BadgeProps) {
  const base = 'inline-flex items-center font-bold tracking-tight whitespace-nowrap rounded-md select-none';

  const variants = {
    primary: 'bg-[#111827] text-[#FFFFFF]',
    new: 'bg-[#111827] text-[#FFFFFF]',
    accent: 'bg-[#FF5722] text-[#FFFFFF]',
    sale: 'bg-[#FF5722] text-[#FFFFFF]',
    bestseller: 'bg-[#F59E0B] text-[#FFFFFF] rounded-full',
    neutral: 'bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB]',
    outline: 'border border-[#D1D5DB] text-[#374151] bg-white',
    success: 'bg-[#10B981] text-[#FFFFFF]',
    danger: 'bg-[#EF4444] text-[#FFFFFF]',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 font-semibold',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  return (
    <span className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}
