// components/cart/CartSummary.tsx
'use client';

import React, { useState } from 'react';
import { useCurrencyStore } from '@/store/currencyStore';
import { Tag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';

export interface CartSummaryProps {
  subtotal: number;
  shippingFee: number;
  total: number;
  className?: string;
}

export function CartSummary({ subtotal, shippingFee, total, className }: CartSummaryProps) {
  const { formatPrice } = useCurrencyStore();
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'ARCHITECT' || code === 'SPRING25' || code === 'LUNORA15') {
      const disc = Math.round(subtotal * 0.15);
      setDiscountAmount(disc);
      setAppliedCode(`${code} (-15%)`);
      showToast.success('Courtesy Privilege Applied', '15% atelier discount activated.');
    } else if (code === 'VIP') {
      setDiscountAmount(5000);
      setAppliedCode('VIP PRIVILEGE (PKR 5,000 OFF)');
      showToast.success('VIP Privilege Applied', 'PKR 5,000 courtesy deduction.');
    } else {
      showToast.error('Invalid Voucher Code', 'Try using code "ARCHITECT" for 15% off.');
    }
  };

  const finalTotal = Math.max(0, total - discountAmount);

  return (
    <div className={`space-y-4 ${className} text-left`}>
      {/* Promo Code Input */}
      {!appliedCode ? (
        <form onSubmit={handleApplyPromo} className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Promo code (e.g. 'ARCHITECT')"
              className="w-full pl-9 pr-3 py-2 text-xs font-sans bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FF5722] uppercase tracking-wider text-gray-900"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="bg-[#111827] hover:bg-[#FF5722] text-white rounded-xl font-bold px-4"
          >
            Apply
          </Button>
        </form>
      ) : (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-2.5 flex items-center justify-between text-xs text-gray-900">
          <span className="font-bold flex items-center gap-1.5 text-[#FF5722]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5722]" />
            {appliedCode}
          </span>
          <button
            type="button"
            onClick={() => {
              setAppliedCode(null);
              setDiscountAmount(0);
            }}
            className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
          >
            Remove
          </button>
        </div>
      )}

      {/* Summary Breakdown */}
      <div className="space-y-2 text-xs text-gray-600">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-bold text-gray-900">{formatPrice(subtotal)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-emerald-600 font-medium">
            <span>Discount</span>
            <span className="font-bold">-{formatPrice(discountAmount)}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span>Shipping Fee</span>
          <span className="font-bold text-gray-900">{subtotal >= 50 ? 'Free' : formatPrice(shippingFee)}</span>
        </div>

        <div className="border-t border-gray-100 pt-3 flex items-center justify-between font-extrabold text-sm text-gray-900">
          <span>Total</span>
          <span className="text-[#FF5722] text-base font-black">
            {formatPrice(finalTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}

