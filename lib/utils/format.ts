// lib/utils/format.ts
import { formatPriceWithCurrency, Currency, useCurrencyStoreRaw } from '@/store/currencyStore';

/**
 * Format price in USD or PKR according to active user selection or explicit override.
 */
export function formatPrice(amount: number, currencyOrPrefix?: Currency | string): string {
  const activeCurrency: Currency = 
    (currencyOrPrefix === 'PKR' || currencyOrPrefix === 'USD') 
      ? (currencyOrPrefix as Currency) 
      : (typeof window !== 'undefined' ? (useCurrencyStoreRaw.getState().currency || 'USD') : 'USD');

  if (isNaN(amount) || amount === null || amount === undefined) {
    return activeCurrency === 'PKR' ? 'PKR 0' : '$0.00';
  }

  if (currencyOrPrefix && currencyOrPrefix !== 'PKR' && currencyOrPrefix !== 'USD') {
    const formatted = amount.toFixed(2);
    return `${currencyOrPrefix}${formatted}`;
  }

  return formatPriceWithCurrency(amount, activeCurrency);
}

/**
 * Format date into readable string
 */
export function formatDate(dateInput: string | Date | { seconds: number; nanoseconds?: number } | undefined | null): string {
  if (!dateInput) return 'N/A';
  
  let date: Date;
  if (typeof dateInput === 'object' && 'seconds' in dateInput) {
    date = new Date(dateInput.seconds * 1000);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) return 'Invalid Date';

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Format date with time
 */
export function formatDateTime(dateInput: string | Date | { seconds: number; nanoseconds?: number } | undefined | null): string {
  if (!dateInput) return 'N/A';

  let date: Date;
  if (typeof dateInput === 'object' && 'seconds' in dateInput) {
    date = new Date(dateInput.seconds * 1000);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) return 'Invalid Date';

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Generate URL safe slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Capitalize first letter of each word
 */
export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}
