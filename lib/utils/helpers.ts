// lib/utils/helpers.ts

/**
 * Calculate discount percentage
 */
export function calculateDiscount(price: number, salePrice?: number): number {
  if (!salePrice || salePrice >= price) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

/**
 * Generate unique order tracking number
 */
export function generateTrackingNumber(): string {
  const prefix = 'APR';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Generate simple ID for client-generated entities
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length = 100): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '…';
}
