// app/dashboard/error.tsx
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin Dashboard Error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#FF5722] flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
        Admin Section Encountered an Error
      </h2>
      <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mt-2 leading-relaxed">
        {error?.message || 'An unexpected issue occurred while rendering this management section.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        <Button
          variant="primary"
          size="sm"
          onClick={() => reset()}
          className="bg-[#FF5722] hover:bg-[#F4511E] text-white flex items-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reload Section</span>
        </Button>

        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="flex items-center gap-1.5">
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </Button>
        </Link>

        <Link href="/">
          <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-gray-600">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
