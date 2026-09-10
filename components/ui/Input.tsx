// components/ui/Input.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, type = 'text', ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[11px] uppercase tracking-[0.08em] font-bold text-[#121212] font-sans"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          type={type}
          className={cn(
            'w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-sans text-gray-900 placeholder:text-gray-400 transition-all',
            'focus:outline-none focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20',
            error && 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-red-600 font-sans mt-0.5">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-gray-500 font-sans mt-0.5">{helperText}</p>
        ) : null}

      </div>
    );
  }
);

Input.displayName = 'Input';

