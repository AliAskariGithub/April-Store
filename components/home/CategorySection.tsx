// components/home/CategorySection.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CategorySection() {
  const categories = [
    {
      name: 'Fashion',
      slug: 'fashion',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Electronics',
      slug: 'electronics',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Beauty',
      slug: 'beauty',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Fitness',
      slug: 'fitness',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Home Decor',
      slug: 'home-decor',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
    },
  ];

  return (
    <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Shop by Categories
        </h2>
        <Link
          href="/products"
          className="group flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-[#FF5722] transition-colors"
        >
          <span>View All Categories</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* 6 Grid Cards Matching Screenshot */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-300"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/3.5] w-full overflow-hidden bg-gray-50">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Content Details */}
            <div className="p-3 text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#FF5722] transition-colors leading-tight">
                  {cat.name}
                </h3>
                <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                  12 items
                </span>
              </div>
              <div className="flex items-center justify-between mt-1 text-[11px] text-gray-500 group-hover:text-[#FF5722] transition-colors font-medium">
                <span>Explore</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
