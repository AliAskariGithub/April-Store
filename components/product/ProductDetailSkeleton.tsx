// components/product/ProductDetailSkeleton.tsx
'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* 1. Breadcrumbs Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-3.5 w-12 rounded" />
        <span className="text-gray-300">/</span>
        <Skeleton className="h-3.5 w-14 rounded" />
        <span className="text-gray-300">/</span>
        <Skeleton className="h-3.5 w-24 rounded" />
      </div>

      {/* 2. Main Product Info (2-Col Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
        {/* Left: Gallery Skeleton */}
        <div className="space-y-4">
          <Skeleton className="w-full aspect-square sm:aspect-[4/5] rounded-2xl bg-gray-200" />
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-xl bg-gray-200" />
            ))}
          </div>
        </div>

        {/* Right: Product Meta & Purchase Skeleton */}
        <div className="space-y-6">
          {/* Category & Tags */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20 rounded-full bg-[#FF5722]/20" />
            <Skeleton className="h-4 w-16 rounded-full bg-gray-200" />
          </div>

          {/* Title & Rating */}
          <div className="space-y-3">
            <Skeleton className="h-8 sm:h-9 w-4/5 rounded-lg bg-gray-200" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-28 rounded bg-gray-200" />
              <Skeleton className="h-3.5 w-16 rounded bg-gray-100" />
            </div>
          </div>

          {/* Price & Discount */}
          <div className="flex items-baseline gap-3 py-2 border-y border-gray-100">
            <Skeleton className="h-8 w-32 rounded-lg bg-gray-200" />
            <Skeleton className="h-5 w-20 rounded-md bg-gray-100" />
            <Skeleton className="h-5 w-16 rounded-full bg-emerald-100" />
          </div>

          {/* Description Paragraph */}
          <div className="space-y-2 pt-1">
            <Skeleton className="h-3.5 w-full rounded bg-gray-100" />
            <Skeleton className="h-3.5 w-11/12 rounded bg-gray-100" />
            <Skeleton className="h-3.5 w-3/4 rounded bg-gray-100" />
          </div>

          {/* Sizes Selector Skeleton */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24 rounded bg-gray-200" />
              <Skeleton className="h-3.5 w-16 rounded bg-gray-100" />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Skeleton key={s} className="h-10 w-14 rounded-xl bg-gray-200" />
              ))}
            </div>
          </div>

          {/* Actions: Add to Cart & Wishlist */}
          <div className="flex items-center gap-3 pt-4">
            <Skeleton className="h-12 flex-1 rounded-xl bg-[#FF5722]/30" />
            <Skeleton className="h-12 w-12 rounded-xl bg-gray-200" />
            <Skeleton className="h-12 w-12 rounded-xl bg-gray-200" />
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
            {[1, 2, 3].map((b) => (
              <div key={b} className="p-3 bg-gray-50 rounded-xl space-y-2 text-center">
                <Skeleton className="h-5 w-5 rounded-full mx-auto bg-gray-200" />
                <Skeleton className="h-3 w-16 mx-auto rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Related Products Skeleton Section */}
      <div className="space-y-6 pt-10 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-44 rounded-lg bg-gray-200" />
          <Skeleton className="h-4 w-24 rounded bg-gray-100" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((r) => (
            <div key={r} className="bg-white rounded-2xl border border-gray-100 p-3 space-y-3">
              <Skeleton className="aspect-square w-full rounded-xl bg-gray-200" />
              <Skeleton className="h-3.5 w-3/4 rounded bg-gray-200" />
              <Skeleton className="h-3 w-1/2 rounded bg-gray-100" />
              <Skeleton className="h-4 w-1/3 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
