// app/(shop)/cart/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const { items, itemCount, subtotal, shippingFee, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#F0EFEA] text-[#9E9C93] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" strokeWidth={1.2} />
        </div>
        <div>
          <h1 className="font-heading text-[32px] font-bold text-[#0A0A0A]">
            Your Shopping Bag is Empty
          </h1>
          <p className="text-[15px] text-[#9E9C93] font-sans mt-2 max-w-md mx-auto">
            Discover our curated evening silhouettes, raw silk dresses, and handcrafted accessories.
          </p>
        </div>
        <Link href="/products">
          <Button variant="primary" size="lg" className="mt-2">
            Explore Haute Couture
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div>
        <span className="text-[12px] font-bold text-[#024E44] uppercase tracking-widest font-sans">
          Review Order
        </span>
        <h1 className="font-heading text-[32px] sm:text-[40px] font-bold text-[#0A0A0A] mt-1">
          Shopping Bag ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Items List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#FFFFFF] border border-[#D8D6CE] rounded-[16px] p-6 divide-y divide-[#F0EFEA]">
            {items.map((item) => (
              <CartItem key={`${item.productId}-${item.size}`} item={item} />
            ))}
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#024E44] hover:underline font-sans"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping Collections</span>
          </Link>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="bg-[#F9F9F7] border border-[#D8D6CE] rounded-[16px] p-6 space-y-6 sticky top-28">
            <h3 className="font-heading text-[20px] font-bold text-[#0A0A0A] pb-3 border-b border-[#D8D6CE]">
              Order Summary
            </h3>

            <CartSummary subtotal={subtotal} shippingFee={shippingFee} total={total} />

            <Link href="/checkout" className="block">
              <Button variant="primary" size="lg" className="w-full justify-between">
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>

            <div className="text-[12px] text-[#9E9C93] font-sans space-y-1.5 pt-2 border-t border-[#D8D6CE]">
              <p>• Nationwide Express Delivery via TCS / Leopard Courier (3-7 days)</p>
              <p>• Free shipping on luxury orders above PKR 50,000</p>
              <p>• 7-day hassle-free size and product exchange</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
