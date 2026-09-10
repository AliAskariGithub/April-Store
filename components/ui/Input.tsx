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
            'w-full bg-[#FFFFFF] border border-[#D5CEBF] rounded-none px-4 py-3 text-[14px] font-sans text-[#121212] placeholder:text-[#9B948A] transition-all',
            'focus:outline-none focus:border-[#121212] focus:ring-1 focus:ring-[#121212]',
            error && 'border-[#B33927] focus:border-[#B33927] focus:ring-1 focus:ring-[#B33927]',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-[11px] text-[#B33927] font-sans mt-0.5">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-[#8E8A83] font-sans mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

