// components/home/NewArrivalsSection.tsx
'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { INITIAL_PRODUCTS } from '@/lib/data/products';

function getProductTimestamp(val: string | { seconds: number; nanoseconds: number } | undefined | null): number {
  if (!val) return 0;
  if (typeof val === 'string') return new Date(val).getTime() || 0;
  if (typeof val === 'object' && 'seconds' in val) return val.seconds * 1000;
  return 0;
}

export function NewArrivalsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { allProducts, loading } = useProducts();

  // Use dynamic live products (including Sanity/Firestore items) falling back to INITIAL_PRODUCTS, sorted by newest
  const newArrivals = (
    allProducts && allProducts.length > 0
      ? [...allProducts].sort((a, b) => getProductTimestamp(b.createdAt) - getProductTimestamp(a.createdAt))
      : INITIAL_PRODUCTS
  ).slice(0, 10);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollDistance = Math.max(Math.round(scrollRef.current.clientWidth * 0.75), 220);
      const scrollAmount = direction === 'left' ? -scrollDistance : scrollDistance;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="new-arrivals" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 overflow-hidden scroll-mt-24">
      {/* Header with Title, View All Link, and Carousel Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF5722] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Collection</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
            New Arrivals
          </h2>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          <Link
            href="/products?sort=newest"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#FF5722] hover:text-[#F4511E] transition-colors"
          >
            <span>View All New Arrivals</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-700 transition-colors shadow-2xs cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-700 transition-colors shadow-2xs cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Carousel / Grid Wrapper */}
      <div className="relative w-full overflow-hidden">
        {loading && (!allProducts || allProducts.length === 0) ? (
          <div className="flex gap-3 sm:gap-4 lg:gap-5 overflow-x-auto no-scrollbar pb-3">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="w-[160px] sm:w-[220px] md:w-[240px] lg:w-[260px] flex-shrink-0 bg-white rounded-2xl border border-gray-100 p-3 space-y-3 animate-pulse"
              >
                <div className="aspect-[4/5] w-full rounded-xl bg-gray-200" />
                <div className="h-3 w-1/3 bg-gray-200 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 lg:gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-3 snap-x snap-mandatory touch-pan-x"
          >
            {newArrivals.map((product) => (
              <div
                key={product.id}
                className="w-[160px] sm:w-[220px] md:w-[240px] lg:w-[260px] flex-shrink-0 snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
