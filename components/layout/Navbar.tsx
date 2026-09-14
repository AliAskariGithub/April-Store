// components/layout/Navbar.tsx
'use client';

import React, { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  User as UserIcon, 
  ChevronDown,
  ShieldCheck,
  LogOut,
  LogIn,
  Home,
  MessageSquare,
  Plus,
  Truck
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useUIStore } from '@/store/uiStore';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { SmartSearchBar } from '@/components/ai/SmartSearchBar';
import { CurrencySwitcher } from '@/components/ui/CurrencySwitcher';
import { AuthModal } from '@/components/auth/AuthModal';
import { showToast } from '@/components/ui/Toast';

const emptySubscribe = () => () => {};

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { openCart, openMobileMenu, openAuthModal, openChat } = useUIStore();
  const itemCount = useCartStore((state) => state.itemCount());
  const wishlistCount = useWishlistStore((state) => state.productIds.length);
  const { user, isAdmin, logout } = useAuth();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const activeUser = mounted ? user : null;
  const activeIsAdmin = mounted ? isAdmin : false;
  const activeWishlistCount = mounted ? wishlistCount : 0;
  const activeItemCount = mounted ? itemCount : 0;

  const handleSignOut = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
      showToast.info('Signed Out', 'You have been successfully signed out.');
    } catch {
      showToast.error('Sign Out Failed', 'Please try again.');
    }
  };

  const handleSectionScroll = (href: string, e: React.MouseEvent) => {
    if (href.startsWith('/#')) {
      const sectionId = href.replace('/#', '');
      if (pathname === '/') {
        e.preventDefault();
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/studio')) {
    return null;
  }

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/products' },
    { label: 'New Arrival', href: '/#new-arrivals' },
    { label: 'Best Seller', href: '/#best-sellers' },
    { 
      label: 'Categories', 
      href: '/#categories',
      isDropdown: true,
      subItems: [
        { label: 'Fashion', href: '/products?category=fashion' },
        { label: 'Electronics', href: '/products?category=electronics' },
        { label: 'Beauty', href: '/products?category=beauty' },
        { label: 'Fitness', href: '/products?category=fitness' },
        { label: 'Home Decor', href: '/products?category=home-decor' },
        { label: 'Accessories', href: '/products?category=accessories' },
      ]
    },
  ];

  return (
    <>
      {/* ========================================================= */}
      {/* 1. TOP HEADER: Mobile Layout (PKR | April Store | Search) */}
      {/* ========================================================= */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-2xs px-4 h-14 flex items-center justify-between">
        {/* Left: Currency Switcher (PKR) */}
        <div className="flex items-center justify-start min-w-[70px]">
          <CurrencySwitcher variant="compact" />
        </div>

        {/* Center: Store Name */}
        <div className="flex-1 flex justify-center items-center">
          <Link href="/" className="flex items-center gap-1">
            <span className="text-xl font-extrabold tracking-tight text-[#111827]">
              April
            </span>
            <span className="text-xl font-extrabold tracking-tight text-[#FF5722]">
              Store
            </span>
          </Link>
        </div>

        {/* Right: Searchbar Icon */}
        <div className="flex items-center justify-end min-w-[70px]">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-gray-700 hover:text-[#FF5722] hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            aria-label="Open search bar"
            title="Search products"
          >
            <Search className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. TOP HEADER: Desktop Layout                             */}
      {/* ========================================================= */}
      <header className="hidden lg:block sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo: April Store */}
          <div className="flex items-center gap-2">
            <Link href="/" className="group flex items-center gap-1">
              <span className="text-[28px] font-extrabold tracking-tight text-[#111827]">
                April
              </span>
              <span className="text-[28px] font-extrabold tracking-tight text-[#FF5722]">
                Store
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive = link.href === '/' 
                ? pathname === '/' 
                : pathname.startsWith(link.href) && !link.href.includes('#');
              
              if (link.isDropdown) {
                return (
                  <div 
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setIsCategoriesOpen(true)}
                    onMouseLeave={() => setIsCategoriesOpen(false)}
                  >
                    <Link
                      href={link.href}
                      onClick={(e) => handleSectionScroll(link.href, e)}
                      className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[#FF5722] py-2 transition-colors cursor-pointer"
                    >
                      <span>{link.label}</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </Link>

                    {isCategoriesOpen && (
                      <div className="absolute top-full left-0 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50 animate-slide-up">
                        {link.subItems?.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            onClick={() => setIsCategoriesOpen(false)}
                            className="block px-4 py-2 text-xs font-medium text-gray-700 hover:bg-[#FFF3E0] hover:text-[#FF5722] transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleSectionScroll(link.href, e)}
                  className={cn(
                    'text-sm font-medium transition-colors relative py-1 group',
                    isActive ? 'text-[#FF5722] font-semibold' : 'text-gray-700 hover:text-[#FF5722]'
                  )}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#FF5722] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls: Currency, Search, User (With Wishlist inside), Bag */}
          <div className="flex items-center space-x-2">
            {/* Currency Switcher */}
            <CurrencySwitcher variant="compact" className="flex mr-1" />
            
            {/* Search Icon Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 text-gray-700 hover:text-[#FF5722] hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
              title="Search products"
              aria-label="Search"
            >
              <Search className="w-5 h-5" strokeWidth={1.8} />
            </button>

            {/* Account & Wishlist Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={cn(
                  "p-2.5 rounded-full transition-colors cursor-pointer relative",
                  activeUser
                    ? "text-[#FF5722] bg-[#FFF3E0] hover:bg-[#FFE0B2]"
                    : "text-gray-700 hover:text-[#FF5722] hover:bg-gray-50"
                )}
                aria-label="User account and wishlist"
              >
                <UserIcon className="w-5 h-5" strokeWidth={1.8} />
                {activeUser && (
                  <span className="absolute bottom-1 right-1 w-2 h-2 bg-green-500 rounded-full ring-2 ring-white" />
                )}
              </button>

              {/* Profile & Wishlist Dropdown Menu */}
              {isProfileOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2.5 z-50 animate-slide-up text-left"
                  onMouseLeave={() => setIsProfileOpen(false)}
                >
                  {activeUser ? (
                    <>
                      {/* Authenticated Header */}
                      <div className="p-3 border-b border-gray-100 bg-gray-50/80 rounded-xl">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-gray-900 truncate">
                            {activeUser.displayName || 'April Store Shopper'}
                          </p>
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-md",
                            activeIsAdmin ? "bg-gray-900 text-white" : "bg-[#FFF3E0] text-[#FF5722]"
                          )}>
                            {activeIsAdmin ? 'Store Admin' : 'Customer'}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 font-sans truncate mt-0.5">
                          {activeUser.email}
                        </p>
                      </div>

                      <div className="py-1.5 space-y-0.5">
                        <Link
                          href="/account"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#FF5722] rounded-xl transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-gray-400" strokeWidth={1.8} />
                          <span>Profile & Settings</span>
                        </Link>

                        <Link
                          href="/orders"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#FF5722] rounded-xl transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4 text-gray-400" strokeWidth={1.8} />
                          <span>My Orders & Tracking</span>
                        </Link>

                        {/* Wishlist Moved Inside User Profile */}
                        <Link
                          href="/wishlist"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-700 hover:bg-[#FFF3E0]/70 hover:text-[#FF5722] rounded-xl transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Heart className="w-4 h-4 text-[#FF5722]" strokeWidth={2} />
                            <span>My Wishlist</span>
                          </div>
                          {activeWishlistCount > 0 && (
                            <span className="bg-[#FF5722] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                              {activeWishlistCount}
                            </span>
                          )}
                        </Link>

                        {activeIsAdmin && (
                          <Link
                            href="/dashboard"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-900 bg-gray-100 hover:bg-gray-900 hover:text-white rounded-xl transition-colors my-1"
                          >
                            <ShieldCheck className="w-4 h-4 text-[#FF5722]" strokeWidth={1.8} />
                            <span>Store Management Portal</span>
                          </Link>
                        )}
                      </div>

                      {/* Sign Out Button in Dropdown */}
                      <div className="pt-1.5 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" strokeWidth={2} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Guest / Not Logged In State */}
                      <div className="p-3 border-b border-gray-100 bg-gray-50/80 rounded-xl space-y-1">
                        <p className="text-xs font-bold text-gray-900">Welcome to April Store</p>
                        <p className="text-[11px] text-gray-500">
                          Sign in with your email to view personal orders, wishlist, and addresses.
                        </p>
                      </div>

                      <div className="p-2 space-y-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            openAuthModal('signin');
                          }}
                          className="w-full flex items-center justify-center gap-2 bg-[#FF5722] hover:bg-[#F4511E] text-white py-2 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          <span>Sign In with Email</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            openAuthModal('register');
                          }}
                          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 py-2 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          <span>Create Account</span>
                        </button>
                      </div>

                      <div className="pt-1 border-t border-gray-100 space-y-0.5">
                        {/* Wishlist in Guest Dropdown */}
                        <Link
                          href="/wishlist"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-600 hover:text-[#FF5722] hover:bg-gray-50 rounded-xl transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Heart className="w-4 h-4 text-[#FF5722]" strokeWidth={2} />
                            <span>My Wishlist</span>
                          </div>
                          {activeWishlistCount > 0 && (
                            <span className="bg-[#FF5722] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                              {activeWishlistCount}
                            </span>
                          )}
                        </Link>

                        <Link
                          href="/orders"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 rounded-xl transition-colors"
                        >
                          <Truck className="w-4 h-4 text-gray-400" />
                          <span>Track an Order</span>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Bag with Orange Badge Count */}
            <button
              type="button"
              onClick={openCart}
              className="relative p-2.5 text-gray-700 hover:text-[#FF5722] hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
              aria-label="Open shopping cart"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.8} />
              <span suppressHydrationWarning className="absolute top-0.5 right-0.5 bg-[#FF5722] text-white text-[11px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {activeItemCount}
              </span>
            </button>

          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 3. BOTTOM BAR: Mobile Layout                              */}
      {/* (Home, Message(AI), Plus(Menu), Cart, Account)            */}
      {/* ========================================================= */}
      <nav 
        aria-label="Mobile Bottom Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-xl px-2 py-1.5 flex items-center justify-around safe-area-bottom"
      >
        {/* 1. Home */}
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-1 transition-colors",
            pathname === '/' ? "text-[#FF5722] font-bold" : "text-gray-600 hover:text-gray-900"
          )}
        >
          <Home className="w-5 h-5" strokeWidth={pathname === '/' ? 2.2 : 1.8} />
          <span className="text-[10px] mt-0.5">Home</span>
        </Link>

        {/* 2. Message (AI Assistant) */}
        <button
          type="button"
          onClick={openChat}
          className="flex flex-col items-center justify-center flex-1 py-1 text-gray-600 hover:text-[#FF5722] transition-colors cursor-pointer"
          aria-label="Open AI Assistant chat"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" strokeWidth={1.8} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#FF5722] rounded-full animate-ping opacity-75" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#FF5722] rounded-full" />
          </div>
          <span className="text-[10px] mt-0.5">Message</span>
        </button>

        {/* 3. Plus (Menu Button Content) */}
        <button
          type="button"
          onClick={openMobileMenu}
          className="flex flex-col items-center justify-center flex-1 -mt-4 cursor-pointer group"
          aria-label="Open store navigation menu"
        >
          <div className="w-11 h-11 rounded-full bg-[#FF5722] group-hover:bg-[#F4511E] text-white flex items-center justify-center shadow-lg shadow-[#FF5722]/35 transition-transform active:scale-90">
            <Plus className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <span className="text-[10px] mt-0.5 font-bold text-gray-700">Menu</span>
        </button>

        {/* 4. Cart */}
        <button
          type="button"
          onClick={openCart}
          className="flex flex-col items-center justify-center flex-1 py-1 text-gray-600 hover:text-[#FF5722] transition-colors cursor-pointer"
          aria-label="Open Cart"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" strokeWidth={1.8} />
            {activeItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#FF5722] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {activeItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Cart</span>
        </button>

        {/* 5. Account */}
        <button
          type="button"
          onClick={() => {
            if (activeUser) {
              router.push('/account');
            } else {
              openAuthModal('signin');
            }
          }}
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer",
            pathname === '/account' ? "text-[#FF5722] font-bold" : "text-gray-600 hover:text-gray-900"
          )}
          aria-label="Account"
        >
          <div className="relative">
            <UserIcon className="w-5 h-5" strokeWidth={pathname === '/account' ? 2.2 : 1.8} />
            {activeUser && (
              <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-full ring-1 ring-white" />
            )}
          </div>
          <span className="text-[10px] mt-0.5">{activeUser ? 'Account' : 'Sign In'}</span>
        </button>
      </nav>

      {/* Smart Search Modal Overlay */}
      <SmartSearchBar
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Custom Email Authentication Modal */}
      <AuthModal />
    </>
  );
}
