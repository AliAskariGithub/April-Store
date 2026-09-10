// store/uiStore.ts
import { create } from 'zustand';

interface UIState {
  isCartOpen: boolean;
  isChatOpen: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'signin' | 'register';
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
  setSearchOpen: (open: boolean) => void;
  openAuthModal: (tab?: 'signin' | 'register') => void;
  closeAuthModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  isChatOpen: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isAuthModalOpen: false,
  authModalTab: 'signin',

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  openChat: () => set({ isChatOpen: true }),
  closeChat: () => set({ isChatOpen: false }),
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),

  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  setSearchOpen: (open: boolean) => set({ isSearchOpen: open }),

  openAuthModal: (tab = 'signin') => set({ isAuthModalOpen: true, authModalTab: tab }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
}));

