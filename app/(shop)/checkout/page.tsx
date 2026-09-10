// app/(shop)/checkout/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { useCart } from '@/hooks/useCart';
import { useCurrencyStore } from '@/store/currencyStore';
import { ShieldCheck, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CheckoutPage() {
  const { items, subtotal, shippingFee, total } = useCart();
  const { formatPrice } = useCurrencyStore();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-spartan text-[24px] font-extrabold uppercase tracking-[0.1em] text-[#121212]">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-[13px] text-[#8E8A83] font-sans">
          Select pieces from our archival catalog to proceed to settlement.
        </p>
        <Link href="/products" className="inline-block mt-2">
          <Button variant="primary" size="lg" className="bg-[#FF5722] hover:bg-[#F4511E] text-white rounded-xl">
            Explore Collections
          </Button>
        </Link>
      </div>
    );
  }

  const effectiveShipping = subtotal >= 50000 ? 0 : shippingFee;
  const effectiveTotal = subtotal >= 50000 ? subtotal : total;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Checkout Breadcrumb Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#121212]">
        <div>
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-[11px] font-spartan uppercase tracking-[0.06em] text-[#8E8A83] hover:text-[#121212] mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Bag</span>
          </Link>
          <h1 className="font-spartan text-[28px] sm:text-[36px] font-extrabold uppercase tracking-[0.08em] text-[#121212]">
            Atelier Settlement
          </h1>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] font-spartan uppercase tracking-[0.06em] text-[#121212] font-bold bg-[#FAF8F5] border border-[#121212] px-3.5 py-1.5 rounded-none">
          <Lock className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>Encrypted Gateway</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left column: Checkout form */}
        <div className="lg:col-span-7">
          <div className="bg-[#FFFFFF] border border-[#121212] rounded-none p-6 sm:p-8">
            <CheckoutForm />
          </div>
        </div>

        {/* Right column: Order review mini summary */}
        <div className="lg:col-span-5">
          <div className="bg-[#FAF8F5] border border-[#121212] rounded-none p-6 space-y-6 sticky top-28">
            <h3 className="font-spartan text-[14px] font-extrabold uppercase tracking-[0.1em] text-[#121212] pb-3 border-b border-[#121212]">
              Archival Selection ({items.length})
            </h3>

            {/* Items scroll */}
            <div className="max-h-72 overflow-y-auto space-y-3 divide-y divide-[#E8E3DA] pr-1">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="pt-3 first:pt-0 flex items-center gap-3">
                  <div className="relative w-14 h-18 rounded-none overflow-hidden bg-[#F3EFE8] flex-shrink-0 border border-[#121212]">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-cover object-top"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-[12px] font-sans text-left">
                    <p className="font-spartan font-bold uppercase tracking-[0.04em] text-[#121212] truncate">{item.productName}</p>
                    <p className="text-[10px] text-[#8E8A83] font-spartan uppercase">
                      Size: {item.size} • Qty: {item.quantity}
                    </p>
                    <p className="font-bold text-[#121212] font-spartan mt-0.5">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-4 border-t border-[#121212] text-[13px] font-sans">
              <div className="flex justify-between text-[#5E5A54]">
                <span>Subtotal</span>
                <span className="font-spartan font-bold text-[#121212]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#5E5A54]">
                <span>Courier Logistics</span>
                <span className="font-spartan font-bold text-[#121212]">{subtotal >= 50000 ? 'Complimentary' : formatPrice(shippingFee)}</span>
              </div>
              <div className="pt-3 border-t border-[#121212] flex justify-between font-bold text-[16px] text-[#121212]">
                <span className="font-spartan uppercase tracking-[0.05em]">Total Due</span>
                <span className="font-spartan text-[#121212] text-[18px]">
                  {formatPrice(effectiveTotal)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#FFFFFF] rounded-none border border-[#121212] flex items-center gap-2.5 text-[11px] text-[#5E5A54] font-sans">
              <ShieldCheck className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
              <span>
                Lunora guarantees genuine noble fabrics, precision stitching, and insured delivery.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

