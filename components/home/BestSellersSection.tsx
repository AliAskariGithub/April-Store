// components/home/BestSellersSection.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { useCurrencyStore } from '@/store/currencyStore';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { showToast } from '@/components/ui/Toast';
import { useProducts } from '@/hooks/useProducts';
import { INITIAL_PRODUCTS } from '@/lib/data/products';
import { Product } from '@/types/product';

export function BestSellersSection() {
  const { addItem } = useCartStore();
  const { openCart } = useUIStore();
  const { formatPrice } = useCurrencyStore();
  const { allProducts, loading } = useProducts();

  // Pick top 3 best seller products dynamically with fallback to verified catalog items
  const bestSellers: Product[] = React.useMemo(() => {
    const list = allProducts && allProducts.length > 0 ? allProducts : INITIAL_PRODUCTS;
    const targetIds = ['prod-101', 'prod-102', 'prod-201'];
    const matched = targetIds.map((id) => list.find((p) => p.id === id)).filter(Boolean) as Product[];
    if (matched.length === 3) return matched;
    return list.filter((p) => p.featured || p.tags?.includes('bestseller')).slice(0, 3);
  }, [allProducts]);

  const handleAdd = (item: Product) => {
    const unitPrice = item.salePrice || item.price;
    const size = item.sizes?.[0] || 'Standard';
    addItem({
      productId: item.id,
      productName: item.name,
      productImage: item.images?.[0] || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop',
      size,
      quantity: 1,
      unitPrice,
    });
    showToast.success('Added to Bag', `${item.name} added to your shopping bag.`);
    openCart();
  };

  return (
    <section id="best-sellers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Best Sellers
        </h2>
        <Link
          href="/products?featured=true"
          className="group flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-[#FF5722] transition-colors"
        >
          <span>View All Best Sellers</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Loading Skeleton */}
      {loading && (!allProducts || allProducts.length === 0) ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="aspect-[4/3] w-full bg-gray-200" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-10 bg-gray-200 rounded-xl w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 3 Large Best Seller Cards with Real Data & Working Slugs */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bestSellers.map((item) => {
            const displayPrice = item.salePrice || item.price;
            const originalPrice = item.salePrice ? item.price : undefined;
            const mainImage = item.images?.[0] || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop';

            return (
              <div
                key={item.id}
                className="group flex flex-col bg-white rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Image on Top with Bestseller Badge */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50">
                  <Link href={`/products/${item.slug}`} className="block w-full h-full">
                    <Image
                      src={mainImage}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </Link>
                  <div className="absolute top-3 left-3 z-10">
                    <Badge variant="bestseller" size="sm" className="bg-[#F59E0B] text-white px-3 py-1 font-bold text-[11px] rounded-full shadow-xs">
                      Bestseller
                    </Badge>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-5 text-left flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-base font-bold text-gray-900 hover:text-[#FF5722] transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-baseline gap-1.5 shrink-0">
                      <span suppressHydrationWarning className="text-base font-extrabold text-gray-900">
                        {formatPrice(displayPrice)}
                      </span>
                      {originalPrice && (
                        <span suppressHydrationWarning className="text-xs text-gray-400 line-through">
                          {formatPrice(originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                    <StarRating rating={item.rating || 5.0} size="sm" />
                    <span className="text-[11px] font-medium text-gray-500">
                      ({item.reviewCount || 0})
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4">
                    {item.description}
                  </p>

                  {/* Quick Add Button */}
                  <div className="mt-auto pt-2">
                    <button
                      type="button"
                      onClick={() => handleAdd(item)}
                      className="w-full bg-[#111827] hover:bg-[#FF5722] text-white py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Quick Add</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
