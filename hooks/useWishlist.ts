// hooks/useWishlist.ts
'use client';

import { useWishlistStore } from '@/store/wishlistStore';

export function useWishlist() {
  const { productIds, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist } = useWishlistStore();

  return {
    productIds,
    wishlistCount: productIds.length,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
  };
}
