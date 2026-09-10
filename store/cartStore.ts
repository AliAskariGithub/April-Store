// store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types/cart';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string) => void;
  updateQty: (productId: string, size: string, qty: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem: CartItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.productId === newItem.productId && i.size === newItem.size
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + newItem.quantity,
            };
            return { items: updatedItems };
          }

          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (productId: string, size: string) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.size === size)
          ),
        }));
      },

      updateQty: (productId: string, size: string, qty: number) => {
        if (qty <= 0) {
          get().removeItem(productId, size);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.size === size
              ? { ...item, quantity: qty }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      total: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      },

      itemCount: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'april_store_cart_v2',
    }
  )
);
