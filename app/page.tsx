// app/page.tsx
'use client';

import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { TrustBadges } from '@/components/home/TrustBadges';
import { CategorySection } from '@/components/home/CategorySection';
import { NewArrivalsSection } from '@/components/home/NewArrivalsSection';
import { BestSellersSection } from '@/components/home/BestSellersSection';
import { PromoBanners } from '@/components/home/PromoBanners';
import { BottomGuarantees } from '@/components/home/BottomGuarantees';

export default function HomePage() {
  return (
    <div className="flex flex-col bg-white">
      {/* 1. Hero Section matching screenshot layout */}
      <HeroSection />

      {/* 2. 4 Value / Trust Badges Strip */}
      <TrustBadges />

      {/* 3. Shop by Categories Section (6 items) */}
      <CategorySection />

      {/* 4. New Arrivals Carousel Section */}
      <NewArrivalsSection />

      {/* 5. Best Sellers Wide Cards Section */}
      <BestSellersSection />

      {/* 6. Dual Promo Banners (Flash Sale 70% Off + Summer 2025) */}
      <PromoBanners />

      {/* 7. Bottom Trust & Guarantee Bar */}
      <BottomGuarantees />
    </div>
  );
}
