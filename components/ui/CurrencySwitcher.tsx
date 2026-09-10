// components/ui/CurrencySwitcher.tsx
'use client';

import React from 'react';
import { useCurrencyStore, Currency } from '@/store/currencyStore';
import { cn } from '@/lib/utils';
import { DollarSign } from 'lucide-react';

interface CurrencySwitcherProps {
  variant?: 'pills' | 'compact' | 'dropdown' | 'badge';
  className?: string;
}

export function CurrencySwitcher({ variant = 'pills', className }: CurrencySwitcherProps) {
  const { currency, setCurrency } = useCurrencyStore();

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={() => setCurrency(currency === 'USD' ? 'PKR' : 'USD')}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border',
          currency === 'PKR'
            ? 'bg-[#FF5722]/10 text-[#FF5722] border-[#FF5722]/30 hover:bg-[#FF5722]/20'
            : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
          className
        )}
        title="Click to toggle currency between USD and PKR"
      >
        <span className="font-mono text-[11px] font-extrabold">
          {currency === 'USD' ? '$ USD' : '₨ PKR'}
        </span>
      </button>
    );
  }

  if (variant === 'badge') {
    return (
      <div className={cn('inline-flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200', className)}>
        <button
          type="button"
          onClick={() => setCurrency('USD')}
          className={cn(
            'px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
            currency === 'USD'
              ? 'bg-[#FF5722] text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          $ USD
        </button>
        <button
          type="button"
          onClick={() => setCurrency('PKR')}
          className={cn(
            'px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
            currency === 'PKR'
              ? 'bg-[#FF5722] text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          ₨ PKR
        </button>
      </div>
    );
  }

  return (
    <div className={cn('inline-flex items-center bg-gray-900/80 backdrop-blur-xs p-0.5 rounded-full border border-gray-800', className)}>
      <button
        type="button"
        onClick={() => setCurrency('USD')}
        className={cn(
          'px-2.5 py-1 rounded-full text-[11px] font-extrabold tracking-wider transition-all cursor-pointer',
          currency === 'USD'
            ? 'bg-[#FF5722] text-white shadow-xs'
            : 'text-gray-400 hover:text-white'
        )}
      >
        USD ($)
      </button>
      <button
        type="button"
        onClick={() => setCurrency('PKR')}
        className={cn(
          'px-2.5 py-1 rounded-full text-[11px] font-extrabold tracking-wider transition-all cursor-pointer',
          currency === 'PKR'
            ? 'bg-[#FF5722] text-white shadow-xs'
            : 'text-gray-400 hover:text-white'
        )}
      >
        PKR (₨)
      </button>
    </div>
  );
}
