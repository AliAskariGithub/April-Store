// components/layout/MobileMenu.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  X, 
  ShoppingBag, 
  Heart, 
  User, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Flame,
  Zap,
  Truck
} from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useAuth } from '@/hooks/useAuth';
import { useWishlistStore } from '@/store/wishlistStore';
import { CurrencySwitcher } from '@/components/ui/CurrencySwitcher';
import { cn } from '@/lib/utils';
import { LogOut, LogIn } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';

export function MobileMenu() {
  const pathname = usePathname();
  const { isMobileMenuOpen, closeMobileMenu, toggleChat, openAuthModal } = useUIStore();
  const { user, isAdmin, logout } = useAuth();
  const wishlistCount = useWishlistStore((state) => state.productIds.length);

  if (!isMobileMenuOpen) return null;

  const categories = [
    { label: 'All Products', href: '/products' },
    { label: 'Fashion & Streetwear', href: '/products?category=fashion' },
    { label: 'Electronics & Audio', href: '/products?category=electronics' },
    { label: 'Beauty & Skincare', href: '/products?category=beauty' },
    { label: 'Fitness & Activewear', href: '/products?category=fitness' },
    { label: 'Home Decor', href: '/products?category=home-decor' },
    { label: 'Accessories', href: '/products?category=accessories' },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeMobileMenu}
      />

      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col h-full z-10 animate-slide-up">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-1">
            <span className="text-2xl font-extrabold tracking-tight text-[#111827]">
              April
            </span>
            <span className="text-2xl font-extrabold tracking-tight text-[#FF5722]">
              Store
            </span>
          </Link>
          <button
            type="button"
            onClick={closeMobileMenu}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Style Advisor Banner */}
        <div className="p-4 mx-4 my-3 bg-gray-900 text-white rounded-2xl shadow-sm">
          <div className="flex items-center gap-1.5 text-[#FF5722] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>AI Style Advisor</span>
          </div>
          <p className="text-xs text-gray-300 mt-1">
            Personalized picks, sizing advice, and smart matching.
          </p>
          <button
            type="button"
            onClick={() => {
              closeMobileMenu();
              toggleChat();
            }}
            className="mt-3 w-full bg-[#FF5722] hover:bg-[#F4511E] text-white py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
          >
            <span>Ask AI Assistant</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1.5">
            Categories
          </p>
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              onClick={closeMobileMenu}
              className={cn(
                'block px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors',
                pathname === cat.href
                  ? 'bg-[#FFF3E0] text-[#FF5722]'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-[#FF5722]'
              )}
            >
              {cat.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-gray-100 my-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1.5">
              Account & Orders
            </p>
            <Link
              href="/orders"
              onClick={closeMobileMenu}
              className="flex items-center justify-between px-3.5 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-xl"
            >
              <span className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-gray-500" />
                Track Orders
              </span>
            </Link>
            <Link
              href="/wishlist"
              onClick={closeMobileMenu}
              className="flex items-center justify-between px-3.5 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-xl"
            >
              <span className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-gray-500" />
                My Wishlist
              </span>
              <span className="text-[10px] bg-[#FF5722] text-white font-bold px-2 py-0.5 rounded-full">
                {wishlistCount}
              </span>
            </Link>
            <Link
              href="/account"
              onClick={closeMobileMenu}
              className="flex items-center justify-between px-3.5 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-xl"
            >
              <span className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-gray-500" />
                <span>{user ? user.displayName || 'Account Profile' : 'Sign In / Account'}</span>
              </span>
              {user && (
                <span className="w-2 h-2 rounded-full bg-green-500 ring-2 ring-white" />
              )}
            </Link>
            {isAdmin && (
              <Link
                href="/dashboard"
                onClick={closeMobileMenu}
                className="flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-gray-900 bg-gray-100 hover:bg-gray-900 hover:text-white rounded-xl mt-1 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#FF5722]" />
                  Admin Dashboard
                </span>
              </Link>
            )}

            {/* Mobile Sign Out / Sign In Action */}
            <div className="pt-2">
              {user ? (
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    closeMobileMenu();
                    showToast.info('Signed Out', 'You have been signed out successfully.');
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-red-600 bg-red-50/70 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <LogOut className="w-4 h-4" />
                    Sign Out ({user.email})
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    openAuthModal('signin');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-bold text-white bg-[#FF5722] hover:bg-[#F4511E] rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In with Email
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Currency & Store Info */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700">Currency:</span>
            <CurrencySwitcher variant="badge" />
          </div>
          <div className="text-[11px] text-gray-500 text-center pt-2 border-t border-gray-200">
            April Store — Modern Lifestyle & Fashion
          </div>
        </div>
      </div>
    </div>
  );
}
