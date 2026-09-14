// app/(shop)/products/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters, FilterState } from '@/components/product/ProductFilters';
import { useProducts, SortOption } from '@/hooks/useProducts';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { SlidersHorizontal, ArrowUpDown, X, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price (Low-High)' },
  { id: 'price-desc', label: 'Price (High-Low)' },
  { id: 'popular', label: 'Most Popular' },
  { id: 'rating', label: 'Highest Rated' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || undefined;
  const rawSortParam = searchParams.get('sort');
  const sortParam: SortOption =
    rawSortParam === 'price-low-high' || rawSortParam === 'price-asc'
      ? 'price-asc'
      : rawSortParam === 'price-high-low' || rawSortParam === 'price-desc'
      ? 'price-desc'
      : rawSortParam === 'popular'
      ? 'popular'
      : rawSortParam === 'rating'
      ? 'rating'
      : 'newest';
  const queryParam = searchParams.get('q') || undefined;

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const { products, loading, filters, setFilters } = useProducts({
    category: categoryParam,
    sort: sortParam,
    search: queryParam,
  });

  // Keep state in sync with URL ONLY when searchParams change
  const searchParamsStr = searchParams.toString();
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: categoryParam,
      sort: sortParam,
      search: queryParam,
    }));
  }, [searchParamsStr, categoryParam, sortParam, queryParam, setFilters]);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    try {
      const url = new URL(window.location.href);
      if (newFilters.category && newFilters.category !== 'all') {
        url.searchParams.set('category', newFilters.category);
      } else {
        url.searchParams.delete('category');
      }

      if (newFilters.sort && newFilters.sort !== 'newest') {
        url.searchParams.set('sort', newFilters.sort);
      } else {
        url.searchParams.delete('sort');
      }

      window.history.replaceState(null, '', url.toString());
    } catch {
      // Safe fallback
    }
  };

  const handleSortChange = (newSort: SortOption) => {
    handleFiltersChange({ ...filters, sort: newSort });
  };

  const handleResetFilters = () => {
    const emptyFilters: FilterState = { sort: 'newest' };
    setFilters(emptyFilters);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('sort');
      url.searchParams.delete('category');
      url.searchParams.delete('q');
      window.history.replaceState(null, '', url.pathname);
    } catch {
      // Safe fallback
    }
  };

  const removeFilter = (key: keyof FilterState, value?: string) => {
    if (key === 'sizes' && value && filters.sizes) {
      const remaining = filters.sizes.filter((s) => s !== value);
      handleFiltersChange({ ...filters, sizes: remaining.length > 0 ? remaining : undefined });
    } else if (key === 'minPrice' || key === 'maxPrice') {
      handleFiltersChange({ ...filters, minPrice: undefined, maxPrice: undefined });
    } else if (key === 'category') {
      handleFiltersChange({ ...filters, category: undefined });
    }
  };

  const getCategoryTitle = () => {
    if (filters.search) return `Search Results for "${filters.search}"`;
    if (!filters.category || filters.category === 'all') return 'All Trending Products';
    switch (filters.category) {
      case 'fashion': return 'Fashion & Streetwear';
      case 'electronics': return 'Electronics & Audio';
      case 'beauty': return 'Beauty & Skincare';
      case 'fitness': return 'Fitness & Activewear';
      case 'home-decor': return 'Home Decor & Living';
      case 'accessories': return 'Accessories & Gear';
      default: return filters.category.replace('-', ' ').toUpperCase();
    }
  };

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.id === (filters.sort || 'newest'))?.label || 'Newest';

  const activeFiltersCount = [
    filters.category && filters.category !== 'all',
    filters.minPrice !== undefined || filters.maxPrice !== undefined,
    filters.sizes && filters.sizes.length > 0,
    filters.search,
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-10 space-y-4 sm:space-y-6">
      {/* Top Banner Header */}
      <div className="pb-4 sm:pb-6 border-b border-gray-100">
        {/* Mobile Compact Top Bar: Title + Count on Left, Filter + Sort on Right */}
        <div className="sm:hidden flex items-center justify-between gap-2">
          <div className="text-left min-w-0 flex-1">
            <h1 className="text-base font-extrabold text-gray-900 tracking-tight truncate">
              {getCategoryTitle()}
            </h1>
            <p className="text-[11px] text-gray-500 font-medium">
              <strong className="text-gray-900">{products.length}</strong> items
              {filters.sort && filters.sort !== 'newest' && (
                <span className="text-gray-500 font-normal"> • {currentSortLabel}</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Mobile Filter Button */}
            <button
              type="button"
              id="mobile-filter-button"
              onClick={() => setFilterDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-800 shadow-2xs active:bg-gray-50 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF5722]" />
              <span>Filter</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#FF5722] text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Mobile Sort Dropdown */}
            <div
              id="mobile-sort-dropdown-container"
              className="flex items-center gap-1 bg-white border border-gray-200 hover:border-[#FF5722]/40 rounded-lg px-2.5 py-1.5 text-xs font-semibold shadow-2xs transition-all"
            >
              <ArrowUpDown className="w-3 h-3 text-[#FF5722]" />
              <select
                id="mobile-sort-select"
                value={filters.sort || 'newest'}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="bg-transparent focus:outline-none cursor-pointer text-gray-900 text-xs font-bold"
                aria-label="Sort By"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Desktop / Tablet Spacious Header */}
        <div className="hidden sm:flex sm:items-end justify-between gap-4">
          <div className="text-left">
            <span className="text-xs font-bold text-[#FF5722] uppercase tracking-wider">
              Explore Collection
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
              {getCategoryTitle()}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Showing <strong className="text-gray-900">{products.length}</strong> {products.length === 1 ? 'item' : 'items'}
              {filters.sort && filters.sort !== 'newest' && (
                <span className="ml-1 text-gray-600 font-medium">
                  • Sorted by <strong className="text-gray-900">{currentSortLabel}</strong>
                </span>
              )}
            </p>
          </div>

          {/* Desktop Dropdown Sort Control */}
          <div
            id="desktop-sort-dropdown-container"
            className="flex items-center gap-2.5 bg-white border border-gray-200/90 hover:border-[#FF5722]/50 rounded-xl px-3.5 py-2 text-xs font-semibold shadow-2xs transition-all"
          >
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#FF5722]" />
              Sort By:
            </span>
            <select
              id="desktop-sort-select"
              value={filters.sort || 'newest'}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="bg-transparent focus:outline-none cursor-pointer text-gray-900 text-xs font-bold pr-2"
              aria-label="Sort Products"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id} className="text-gray-900 py-1">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
          <span className="text-xs font-bold text-gray-500 mr-1">Active filters:</span>
          {filters.category && filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1.5 bg-[#FFF3E0] text-[#FF5722] border border-[#FF5722]/30 px-3 py-1 rounded-full text-xs font-bold">
              <span>Category: {filters.category}</span>
              <button
                type="button"
                onClick={() => removeFilter('category')}
                className="hover:opacity-75 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
            <span className="inline-flex items-center gap-1.5 bg-[#FFF3E0] text-[#FF5722] border border-[#FF5722]/30 px-3 py-1 rounded-full text-xs font-bold">
              <span>
                Price:{' '}
                {filters.minPrice !== undefined && filters.maxPrice !== undefined
                  ? `$${filters.minPrice} - $${filters.maxPrice}`
                  : filters.minPrice !== undefined
                  ? `Above $${filters.minPrice}`
                  : `Under $${filters.maxPrice}`}
              </span>
              <button
                type="button"
                onClick={() => removeFilter('minPrice')}
                className="hover:opacity-75 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.sizes?.map((size) => (
            <span
              key={size}
              className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-800 border border-gray-200 px-3 py-1 rounded-full text-xs font-bold"
            >
              <span>Size: {size}</span>
              <button
                type="button"
                onClick={() => removeFilter('sizes', size)}
                className="hover:opacity-75 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs font-bold text-gray-500 hover:text-[#FF5722] underline cursor-pointer ml-2 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear all</span>
          </button>
        </div>
      )}

      {/* Main Layout Grid: Desktop Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters with colored background and scrollbar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-28 bg-gradient-to-b from-[#FFF8F5] via-[#FFF5EF] to-white border border-[#FF8A65]/30 rounded-2xl p-5 shadow-xs filter-scrollbar overflow-y-auto max-h-[calc(100vh-140px)] pr-2.5">
          <ProductFilters
            filters={filters}
            onChange={handleFiltersChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          <ProductGrid products={products} loading={loading} onResetFilters={handleResetFilters} />
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <Drawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        title="Filter Products"
        width="md"
      >
        <ProductFilters
          filters={filters}
          onChange={handleFiltersChange}
          onReset={handleResetFilters}
        />
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setFilterDrawerOpen(false)}
            className="w-full bg-[#FF5722] hover:bg-[#F4511E] text-white rounded-xl"
          >
            Apply Filters ({products.length} Items)
          </Button>
        </div>
      </Drawer>
    </div>
  );
}

function ProductsPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-10 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="pb-4 sm:pb-6 border-b border-gray-100 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-gray-200 rounded" />
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-3 w-32 bg-gray-200 rounded" />
        </div>
        <div className="h-9 w-32 bg-gray-200 rounded-xl" />
      </div>

      {/* Grid Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:block lg:col-span-1 bg-gradient-to-b from-[#FFF8F5] to-white border border-[#FF8A65]/30 rounded-2xl p-5 space-y-4">
          <div className="h-5 w-24 bg-gray-200 rounded" />
          <div className="space-y-2 pt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-full bg-gray-200 rounded" />
            ))}
          </div>
          <div className="h-20 bg-gray-200 rounded-xl mt-4" />
        </div>

        {/* Product Cards Skeleton Grid */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3.5 sm:gap-5 lg:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col bg-white p-3.5 rounded-2xl border border-gray-100 space-y-3">
              <div className="aspect-square w-full rounded-xl bg-gray-100" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-3 w-1/2 bg-gray-200 rounded" />
              <div className="h-5 w-1/3 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageSkeleton />}>
      <ProductsContent />
    </Suspense>
  );
}
