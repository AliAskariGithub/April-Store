// components/product/ProductGrid.tsx
'use client';

import React from 'react';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { RotateCcw, PackageSearch } from 'lucide-react';

export interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onResetFilters?: () => void;
}

export function ProductGrid({ products, loading, onResetFilters }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3.5 sm:gap-5 lg:gap-6 animate-pulse">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex flex-col bg-white p-3.5 rounded-2xl border border-gray-100 shadow-2xs space-y-3">
            {/* Image placeholder with badge & wishlist icons */}
            <div className="relative aspect-square w-full rounded-xl bg-gray-100 overflow-hidden">
              <div className="absolute top-2 left-2 w-10 h-4 rounded bg-gray-200" />
              <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gray-200" />
            </div>
            {/* Title & Category */}
            <div className="space-y-1.5 pt-1">
              <Skeleton className="h-3 w-1/4 rounded bg-gray-200" />
              <Skeleton className="h-4 w-5/6 rounded bg-gray-200" />
            </div>
            {/* Rating Stars */}
            <div className="flex items-center gap-1">
              <div className="w-16 h-3 rounded bg-gray-200" />
              <div className="w-8 h-3 rounded bg-gray-200 ml-1" />
            </div>
            {/* Price & Action Button */}
            <div className="pt-2 flex items-center justify-between gap-2 border-t border-gray-50">
              <Skeleton className="h-5 w-1/3 rounded bg-gray-200" />
              <Skeleton className="h-8 w-20 rounded-xl bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center rounded-2xl bg-gray-50 border border-gray-200 p-8 max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full bg-orange-100 text-[#FF5722] flex items-center justify-center mx-auto mb-3">
          <PackageSearch className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          No Products Found
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mb-5">
          We couldn&apos;t find any items matching your selected criteria. Try adjusting your filters or search terms.
        </p>
        {onResetFilters && (
          <Button
            variant="outline"
            size="md"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 rounded-xl cursor-pointer hover:bg-gray-100"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Filters</span>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3.5 sm:gap-5 lg:gap-6 animate-fade-in">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
