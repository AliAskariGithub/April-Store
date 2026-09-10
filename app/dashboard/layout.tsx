// app/dashboard/layout.tsx
'use client';

import React, { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { CurrencySwitcher } from '@/components/ui/CurrencySwitcher';
import { useAuth } from '@/hooks/useAuth';
import { 
  ShoppingBag, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle,
  LayoutDashboard,
  Package,
  FolderTree,
  LogOut,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { showToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

const emptySubscribe = () => () => {};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const { user, isAdmin, login, switchRole, logout } = useAuth();
  const [adminEmail, setAdminEmail] = useState('admin@aprilstore.com');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const adminNavItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Products', href: '/dashboard/products', icon: Package },
    { label: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { label: 'Categories', href: '/dashboard/categories', icon: FolderTree },
  ];

  const handleAdminLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      if (adminEmail.trim().toLowerCase() === 'admin@aprilstore.com' || !adminEmail.trim()) {
        switchRole('admin');
        showToast.success('Admin Authenticated', 'Welcome to April Store Admin Console.');
      } else {
        const logged = await login(adminEmail, adminPassword);
        if (logged?.role === 'admin') {
          showToast.success('Admin Authenticated', 'Welcome back.');
        } else {
          setAuthError('This account does not have administrator privileges.');
        }
      }
    } catch {
      setAuthError('Authentication failed. Please verify credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleQuickDemoAdmin = () => {
    setAdminEmail('admin@aprilstore.com');
    setAdminPassword('admin123');
    switchRole('admin');
    showToast.success('Demo Admin Mode Activated', 'Full administrative access granted.');
  };

  // Prevent hydration mismatch between SSR and client localStorage auth snapshot
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4 sm:p-6">
        <div className="w-12 h-12 border-4 border-[#FF5722] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400 font-mono">Initializing Administrator Console...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#FF5722]/10 border border-[#FF5722]/30 rounded-2xl flex items-center justify-center mx-auto text-[#FF5722]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="flex items-center justify-center gap-1">
              <span className="text-2xl font-extrabold text-white">April</span>
              <span className="text-2xl font-extrabold text-[#FF5722]">Store</span>
            </div>
            <h1 className="text-lg font-bold text-slate-100">Administrator Portal</h1>
            <p className="text-xs text-slate-400">
              Sign in with administrative credentials to access products, orders, and analytics.
            </p>
          </div>

          {/* 1-Click Demo Login Banner */}
          <div className="bg-slate-800/80 border border-[#FF5722]/30 rounded-2xl p-4 text-left space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#FF5722]">
              <KeyRound className="w-4 h-4" />
              <span>Instant Demo Access</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Use 1-click authorization to explore the full dashboard, products, order fulfillment, and receipt audits.
            </p>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleQuickDemoAdmin}
              className="w-full bg-[#FF5722] hover:bg-[#F4511E] text-white text-xs font-bold flex items-center justify-center gap-2 py-2.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Continue as Demo Admin</span>
            </Button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              Or Custom Sign In
            </span>
            <div className="border-t border-slate-800 w-full" />
          </div>

          {authError && (
            <div className="p-3 bg-red-950/50 border border-red-800/60 rounded-xl flex items-center gap-2 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Email
              </label>
              <Input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@aprilstore.com"
                required
                className="bg-slate-800 border-slate-700 text-white focus:border-[#FF5722]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <Input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-slate-800 border-slate-700 text-white focus:border-[#FF5722]"
              />
            </div>

            <Button
              type="submit"
              isLoading={authLoading}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold text-xs border border-slate-700"
            >
              Sign In with Credentials
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Storefront</span>
            </Link>
            <span className="text-[11px] text-slate-500 font-mono">Role: {user?.role || 'guest'}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row font-sans text-gray-900">
      {/* Desktop Admin Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Top Header */}
      <div className="lg:hidden bg-[#0F172A] text-white p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-1">
          <span className="text-xl font-extrabold text-white">April</span>
          <span className="text-xl font-extrabold text-[#FF5722]">Store</span>
          <span className="ml-2 bg-[#FF5722] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">
            Admin
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <CurrencySwitcher variant="compact" />
          <Link
            href="/"
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-white flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Store</span>
          </Link>
        </div>
      </div>

      {/* Mobile / Tablet Horizontal Navigation Tabs */}
      <div className="lg:hidden bg-[#1E293B] border-b border-slate-700/80 px-2 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar sticky top-[61px] z-30">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors',
                isActive
                  ? 'bg-[#FF5722] text-white shadow-xs font-extrabold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Main Admin Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Live April Store Management System
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 pr-4 border-r border-gray-200">
              <span className="text-xs text-gray-500 font-medium">Currency:</span>
              <CurrencySwitcher variant="badge" />
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#FF5722]" />
                <span>Visit Storefront</span>
              </Link>

              <button
                type="button"
                onClick={async () => {
                  await logout();
                  showToast.info('Signed Out', 'You have signed out from the Admin Console.');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
