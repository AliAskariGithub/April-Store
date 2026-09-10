// components/layout/AdminSidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  FolderTree, 
  ArrowLeft,
  Sparkles,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CurrencySwitcher } from '@/components/ui/CurrencySwitcher';

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { label: 'Overview & Stats', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Products Catalog', href: '/dashboard/products', icon: Package },
    { label: 'Orders & Receipts', href: '/dashboard/orders', icon: ShoppingBag },
    { label: 'Categories', href: '/dashboard/categories', icon: FolderTree },
    { label: 'Sanity Studio (CMS)', href: '/studio', icon: Sparkles },
  ];

  return (
    <aside className="w-64 bg-[#0F172A] text-white flex flex-col h-screen sticky top-0 border-r border-slate-800 z-30 shadow-xl">
      {/* Brand & Portal Header */}
      <div className="p-6 border-b border-slate-800">
        <Link href="/" className="inline-flex items-center gap-1 group">
          <span className="text-2xl font-extrabold tracking-tight text-white">
            April
          </span>
          <span className="text-2xl font-extrabold tracking-tight text-[#FF5722]">
            Store
          </span>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <span className="bg-[#FF5722] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Admin Console
          </span>
          <span className="text-[11px] text-slate-400 font-mono">v2.4</span>
        </div>
      </div>

      {/* Nav links */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 mb-2">
          Management
        </p>
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all',
                isActive
                  ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/20 font-extrabold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              )}
            >
              <Icon className="w-4 h-4" strokeWidth={2} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Currency Switcher in Sidebar */}
        <div className="pt-5 mt-5 border-t border-slate-800 px-3 space-y-2">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Store Currency
          </p>
          <div className="pt-1">
            <CurrencySwitcher variant="badge" className="w-full justify-center bg-slate-800/80 border-slate-700 text-slate-200" />
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="pt-4 mt-4">
          <div className="p-3.5 bg-slate-800/70 rounded-xl border border-slate-700/80 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#FF5722] font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini AI Receipt Vision</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Customer bank transfer receipts are scanned, OCR-parsed and verified in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Return to Storefront */}
      <div className="p-4 border-t border-slate-800 bg-[#0B1120]">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-[#FF5722] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-sm group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" strokeWidth={2} />
          <span>Live Storefront</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-60 ml-auto" />
        </Link>
      </div>
    </aside>
  );
}
