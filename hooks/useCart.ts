// hooks/useCart.ts
'use client';

import { useCartStore } from '@/store/cartStore';

export function useCart() {
  const { items, addItem, removeItem, updateQty, clearCart, total, itemCount } = useCartStore();

  return {
    items,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    subtotal: total(),
    itemCount: itemCount(),
    shippingFee: 500, // Flat PKR 500 across Pakistan
    total: total() > 0 ? total() + 500 : 0,
  };
}
