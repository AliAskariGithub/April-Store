// components/cart/CartDrawer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import { useCart } from '@/hooks/useCart';
import { useUIStore } from '@/store/uiStore';
import { useCurrencyStore } from '@/store/currencyStore';

export function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore();
  const { items, itemCount, subtotal, shippingFee, total } = useCart();
  const { formatPrice } = useCurrencyStore();

  const FREE_SHIPPING_THRESHOLD = 50.00;
  const progressToFreeShipping = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <Drawer
      isOpen={isCartOpen}
      onClose={closeCart}
      title={`Shopping Cart (${itemCount})`}
      width="md"
      footer={
        items.length > 0 && (
          <div className="space-y-4">
            <CartSummary subtotal={subtotal} shippingFee={shippingFee} total={total} />
            <Link href="/checkout" onClick={closeCart} className="block">
              <Button variant="primary" size="lg" className="w-full justify-between bg-[#FF5722] hover:bg-[#F4511E] text-white py-3.5 px-6 rounded-xl font-bold">
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        )
      }
    >
      {/* Free Shipping Progress Indicator */}
      <div className="mb-5 bg-gray-50 p-3.5 rounded-xl border border-gray-100 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5722]" />
            {remainingForFreeShipping === 0
              ? 'Free Shipping Unlocked!'
              : `Add ${formatPrice(remainingForFreeShipping)} for Free Shipping`}
          </span>
          <span className="text-gray-500 font-bold">{Math.round(progressToFreeShipping)}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FF5722] transition-all duration-300 rounded-full"
            style={{ width: `${progressToFreeShipping}%` }}
          />
        </div>
      </div>

      {/* Cart Items List */}
      {items.length === 0 ? (
        <div className="py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 text-gray-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-7 h-7" strokeWidth={1.5} />
          </div>
          <div>
            <h4 className="text-base font-bold text-gray-900">
              Your Cart is Empty
            </h4>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              Explore our trending hoodies, footwear, electronics, and accessories.
            </p>
          </div>
          <Link href="/products" onClick={closeCart}>
            <Button variant="primary" size="md" className="mt-2 bg-[#FF5722] hover:bg-[#F4511E] text-white rounded-xl">
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {items.map((item) => (
            <CartItem key={`${item.productId}-${item.size}`} item={item} />
          ))}
        </div>
      )}
    </Drawer>
  );
}
