// store/currencyStore.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSyncExternalStore } from 'react';

export type Currency = 'USD' | 'PKR';

export interface CurrencyState {
  currency: Currency;
  exchangeRate: number; // 1 USD = X PKR
  setCurrency: (currency: Currency) => void;
  toggleCurrency: () => void;
  formatPrice: (amountInUSD: number) => string;
  convertPrice: (amountInUSD: number) => number;
}

export const USD_TO_PKR_RATE = 280;

export const useCurrencyStoreRaw = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: 'USD',
      exchangeRate: USD_TO_PKR_RATE,

      setCurrency: (currency: Currency) => set({ currency }),

      toggleCurrency: () => {
        const current = get().currency;
        set({ currency: current === 'USD' ? 'PKR' : 'USD' });
      },

      convertPrice: (amountInUSD: number) => {
        if (isNaN(amountInUSD) || amountInUSD === null || amountInUSD === undefined) return 0;
        const { currency, exchangeRate } = get();
        if (currency === 'PKR') {
          return Math.round(amountInUSD * exchangeRate);
        }
        return amountInUSD;
      },

      formatPrice: (amountInUSD: number) => {
        if (isNaN(amountInUSD) || amountInUSD === null || amountInUSD === undefined) {
          return get().currency === 'PKR' ? 'PKR 0' : '$0.00';
        }
        const { currency, exchangeRate } = get();
        if (currency === 'PKR') {
          const pkrValue = Math.round(amountInUSD * exchangeRate);
          return `PKR ${pkrValue.toLocaleString('en-US')}`;
        }
        return `$${amountInUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      },
    }),
    {
      name: 'novatrend_currency_v1',
    }
  )
);

const emptySubscribe = () => () => {};

/**
 * Hydration-safe hook for Next.js SSR using React's useSyncExternalStore.
 * During initial SSR and pre-mount hydration, getServerSnapshot returns false,
 * guaranteeing 100% markup parity between server and client. Once mounted in the browser,
 * getClientSnapshot returns true and it switches to the user's stored currency selection.
 */
export function useCurrencyStore(): CurrencyState {
  const store = useCurrencyStoreRaw();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return {
      ...store,
      currency: 'USD',
      convertPrice: (amountInUSD: number) => {
        if (isNaN(amountInUSD) || amountInUSD === null || amountInUSD === undefined) return 0;
        return amountInUSD;
      },
      formatPrice: (amountInUSD: number) => {
        if (isNaN(amountInUSD) || amountInUSD === null || amountInUSD === undefined) return '$0.00';
        return `$${amountInUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      },
    };
  }

  return store;
}

// Attach static store helpers for backwards compatibility
useCurrencyStore.getState = useCurrencyStoreRaw.getState;
useCurrencyStore.setState = useCurrencyStoreRaw.setState;
useCurrencyStore.subscribe = useCurrencyStoreRaw.subscribe;

/**
 * Universal helper that can be called outside React components
 */
export function formatPriceWithCurrency(
  amountInUSD: number, 
  currency: Currency = 'USD', 
  exchangeRate: number = USD_TO_PKR_RATE
): string {
  if (isNaN(amountInUSD) || amountInUSD === null || amountInUSD === undefined) {
    return currency === 'PKR' ? 'PKR 0' : '$0.00';
  }
  if (currency === 'PKR') {
    const pkrValue = Math.round(amountInUSD * exchangeRate);
    return `PKR ${pkrValue.toLocaleString('en-US')}`;
  }
  return `$${amountInUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
