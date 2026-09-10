// components/ui/Button.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'icon' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer select-none rounded-lg text-center';

    const variants = {
      primary: 'bg-[#FF5722] text-[#FFFFFF] hover:bg-[#F4511E] border border-transparent shadow-sm hover:shadow',
      accent: 'bg-[#FF5722] text-[#FFFFFF] hover:bg-[#F4511E] border border-transparent',
      dark: 'bg-[#111827] text-[#FFFFFF] hover:bg-[#1F2937] border border-transparent',
      secondary: 'bg-[#F3F4F6] text-[#111827] hover:bg-[#E5E7EB] border border-[#E5E7EB]',
      outline: 'bg-transparent text-[#111827] border border-[#D1D5DB] hover:border-[#111827] hover:bg-[#F9FAFB]',
      ghost: 'bg-transparent text-[#111827] hover:bg-[#F3F4F6] border border-transparent',
      icon: 'bg-[#FFFFFF] border border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F9FAFB] text-[#111827] rounded-full',
    };

    const sizes = {
      sm: variant === 'icon' ? 'w-8 h-8 p-0' : 'text-xs px-3.5 py-1.5',
      md: variant === 'icon' ? 'w-10 h-10 p-0' : 'text-sm px-5 py-2.5',
      lg: variant === 'icon' ? 'w-12 h-12 p-0' : 'text-base px-7 py-3.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <Spinner size="sm" color={variant === 'primary' || variant === 'dark' ? 'white' : 'primary'} />
            <span>Processing...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
