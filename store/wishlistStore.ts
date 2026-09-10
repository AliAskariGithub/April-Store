// store/wishlistStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  productIds: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  syncWithFirestore: (uid: string) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],

      addToWishlist: (productId: string) => {
        set((state) => {
          if (state.productIds.includes(productId)) return state;
          return { productIds: [...state.productIds, productId] };
        });
      },

      removeFromWishlist: (productId: string) => {
        set((state) => ({
          productIds: state.productIds.filter((id) => id !== productId),
        }));
      },

      clearWishlist: () => {
        set({ productIds: [] });
      },

      toggleWishlist: (productId: string) => {
        if (get().isInWishlist(productId)) {
          get().removeFromWishlist(productId);
        } else {
          get().addToWishlist(productId);
        }
      },

      isInWishlist: (productId: string) => {
        return get().productIds.includes(productId);
      },

      syncWithFirestore: (uid: string) => {
        // Reserved for firestore cloud sync when authenticated
      },
    }),
    {
      name: 'april_store_wishlist_v2',
    }
  )
);
