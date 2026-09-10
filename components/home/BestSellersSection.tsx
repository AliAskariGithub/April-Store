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

export function BestSellersSection() {
  const { addItem } = useCartStore();
  const { openCart } = useUIStore();
  const { formatPrice } = useCurrencyStore();

  const bestSellers = [
    {
      id: 'prod-107',
      slug: 'oversized-fleece-hoodie',
      name: 'Oversized Fleece Hoodie',
      price: 59.99,
      rating: 5.0,
      reviewCount: 120,
      description: 'Premium heavyweight organic cotton fleece hoodie tailored with brushed interior and kangaroo pouch.',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'prod-102',
      slug: 'air-max-270-sneakers',
      name: 'Air Max 270 Sneakers',
      price: 129.99,
      originalPrice: 159.99,
      rating: 5.0,
      reviewCount: 98,
      description: 'Iconic max air heel cushioning unit delivering springy responsiveness for city walks.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'prod-201',
      slug: 'noise-canceling-wireless-headphones',
      name: 'Noise-Canceling Wireless Headphones',
      price: 349.99,
      rating: 5.0,
      reviewCount: 75,
      description: 'Industry-leading active noise cancellation with custom tuned 40mm titanium drivers and 30hr battery.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
    },
  ];

  const handleAdd = (item: typeof bestSellers[0]) => {
    addItem({
      productId: item.id,
      productName: item.name,
      productImage: item.image,
      size: 'Standard',
      quantity: 1,
      unitPrice: item.price,
    });
    showToast.success('Added to Bag', `${item.name} added to your shopping bag.`);
    openCart();
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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

      {/* 3 Large Best Seller Cards Matching UI Screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bestSellers.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col bg-white rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            {/* Image on Top with Bestseller Badge */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50">
              <Link href={`/products/${item.slug}`} className="block w-full h-full">
                <Image
                  src={item.image}
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
                  className="text-base font-bold text-gray-900 hover:text-[#FF5722] transition-colors"
                >
                  {item.name}
                </Link>
                <div className="flex items-baseline gap-1.5">
                  <span suppressHydrationWarning className="text-base font-extrabold text-gray-900">
                    {formatPrice(item.price)}
                  </span>
                  {item.originalPrice && (
                    <span suppressHydrationWarning className="text-xs text-gray-400 line-through">
                      {formatPrice(item.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                <StarRating rating={item.rating} size="sm" />
                <span className="text-[11px] font-medium text-gray-500">
                  ({item.reviewCount})
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
        ))}
      </div>
    </section>
  );
}
