// components/home/HeroSection.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { useCurrencyStore } from '@/store/currencyStore';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  alt: string;
  badgeColor: string;
  cards: {
    title: string;
    price: number;
    image: string;
    href: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  }[];
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    title: 'Discover Streetwear & Luxe Fashion',
    subtitle: 'Fall / Winter Curated Collection',
    tag: 'Fashion & Streetwear',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
    alt: 'April Store Fashion & Streetwear Model',
    badgeColor: 'bg-[#FF5722]',
    cards: [
      {
        title: 'Air Max 270',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&auto=format&fit=crop',
        href: '/products/air-max-270-street-sneakers',
        position: 'top-left',
      },
      {
        title: 'Smart Watch Series 9',
        price: 189.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&auto=format&fit=crop',
        href: '/products/smart-watch-series-9-amoled',
        position: 'top-right',
      },
      {
        title: 'ANC Headphones',
        price: 119.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop',
        href: '/products/wireless-noise-cancelling-headphones',
        position: 'bottom-left',
      },
      {
        title: 'Sports Flask',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=300&auto=format&fit=crop',
        href: '/products/insulated-stainless-steel-sports-flask',
        position: 'bottom-right',
      },
    ],
  },
  {
    id: 2,
    title: 'Immersive Audio & Smart Tech',
    subtitle: 'Active Noise Canceling & Next-Gen Wearables',
    tag: 'Electronics & Audio',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop',
    alt: 'Premium Wireless Audio and Tech',
    badgeColor: 'bg-indigo-600',
    cards: [
      {
        title: 'ANC Headphones',
        price: 119.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop',
        href: '/products/wireless-noise-cancelling-headphones',
        position: 'top-left',
      },
      {
        title: 'Smart Watch Series 9',
        price: 189.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&auto=format&fit=crop',
        href: '/products/smart-watch-series-9-amoled',
        position: 'top-right',
      },
      {
        title: 'Air Max 270',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&auto=format&fit=crop',
        href: '/products/air-max-270-street-sneakers',
        position: 'bottom-left',
      },
      {
        title: 'Sports Flask',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=300&auto=format&fit=crop',
        href: '/products/insulated-stainless-steel-sports-flask',
        position: 'bottom-right',
      },
    ],
  },
  {
    id: 3,
    title: 'High-Performance Activewear',
    subtitle: 'Built for Endurance, Training & Recovery',
    tag: 'Fitness & Activewear',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    alt: 'Athletic Training and Fitness Gear',
    badgeColor: 'bg-emerald-600',
    cards: [
      {
        title: 'Sports Flask',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=300&auto=format&fit=crop',
        href: '/products/insulated-stainless-steel-sports-flask',
        position: 'top-left',
      },
      {
        title: 'Air Max 270',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&auto=format&fit=crop',
        href: '/products/air-max-270-street-sneakers',
        position: 'top-right',
      },
      {
        title: 'Smart Watch Series 9',
        price: 189.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&auto=format&fit=crop',
        href: '/products/smart-watch-series-9-amoled',
        position: 'bottom-left',
      },
      {
        title: 'ANC Headphones',
        price: 119.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop',
        href: '/products/wireless-noise-cancelling-headphones',
        position: 'bottom-right',
      },
    ],
  },
  {
    id: 4,
    title: 'Minimalist Scandinavian Living',
    subtitle: 'Architectural Home Accents & Serenity',
    tag: 'Home Decor & Living',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop',
    alt: 'Modern Scandinavian Living and Decor',
    badgeColor: 'bg-amber-600',
    cards: [
      {
        title: 'Smart Watch Series 9',
        price: 189.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&auto=format&fit=crop',
        href: '/products/smart-watch-series-9-amoled',
        position: 'top-left',
      },
      {
        title: 'Air Max 270',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&auto=format&fit=crop',
        href: '/products/air-max-270-street-sneakers',
        position: 'top-right',
      },
      {
        title: 'Sports Flask',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=300&auto=format&fit=crop',
        href: '/products/insulated-stainless-steel-sports-flask',
        position: 'bottom-left',
      },
      {
        title: 'ANC Headphones',
        price: 119.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop',
        href: '/products/wireless-noise-cancelling-headphones',
        position: 'bottom-right',
      },
    ],
  },
];

export function HeroSection() {
  const { formatPrice } = useCurrencyStore();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Moving auto-play carousel timer
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const currentSlide = HERO_SLIDES[currentSlideIndex];

  return (
    <section className="relative overflow-hidden bg-white pt-4 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines, CTAs, Social Proof */}
          <div className="lg:col-span-5 space-y-6 text-left z-10">
            
            {/* Eyebrow badge showing active category tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5722]" />
              <span className="text-xs sm:text-sm font-bold tracking-wider text-[#FF5722] uppercase">
                {currentSlide.tag}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#111827] tracking-tight leading-[1.12]">
              Discover Products <br className="hidden sm:inline" />
              You’ll Love
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-gray-500 max-w-md font-normal leading-relaxed">
              Shop curated premium collections across Fashion, Tech, Beauty, Fitness, and Home with seamless PKR & USD checkout.
            </p>

            {/* Call to Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <Link href="/products">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="bg-[#FF5722] hover:bg-[#F4511E] text-white px-7 py-3.5 rounded-xl font-semibold flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <Link href="/products?sort=newest">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="bg-white border-gray-200 hover:border-gray-900 text-gray-800 px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Explore Collection</span>
                </Button>
              </Link>
            </div>

            {/* Social Proof with Customer Avatars */}
            <div className="pt-6 flex items-center gap-3">
              <div className="flex -space-x-2 overflow-hidden">
                <div className="relative inline-block h-8 w-8 rounded-full ring-2 ring-white overflow-hidden bg-gray-100">
                  <Image
                    fill
                    className="object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
                    alt="Customer 1"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="relative inline-block h-8 w-8 rounded-full ring-2 ring-white overflow-hidden bg-gray-100">
                  <Image
                    fill
                    className="object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
                    alt="Customer 2"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="relative inline-block h-8 w-8 rounded-full ring-2 ring-white overflow-hidden bg-gray-100">
                  <Image
                    fill
                    className="object-cover"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
                    alt="Customer 3"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="relative inline-block h-8 w-8 rounded-full ring-2 ring-white overflow-hidden bg-gray-100">
                  <Image
                    fill
                    className="object-cover"
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
                    alt="Customer 4"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Loved by <span className="font-semibold text-gray-900">50,000+</span> customers worldwide
              </p>
            </div>

          </div>

          {/* Right Column: Moving Hero Visual Carousel with Organic Curved Backdrop */}
          <div 
            className="lg:col-span-7 relative flex items-center justify-center group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Background Orange Organic Curved Sculptural Backdrop */}
            <div className="relative w-full max-w-[580px] aspect-[4/4.2] flex items-center justify-center select-none">
              
              {/* Organic Orange Shape with dynamic subtle color shifts */}
              <div className="absolute inset-0 rounded-[42%_58%_70%_30%/45%_45%_55%_55%] bg-gradient-to-tr from-[#FF5722] via-[#FF6E40] to-[#FF8A65] shadow-2xl opacity-95 transform -rotate-6 scale-95 transition-all duration-700" />
              
              {/* Secondary soft orange glow */}
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-[#FFAB91] rounded-full blur-3xl opacity-40 pointer-events-none" />

              {/* Animated Carousel Image Container with Smooth Crossfade */}
              <div className="relative w-full h-full z-10 flex items-end justify-center overflow-hidden rounded-[2.5rem]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide.id}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.65, ease: 'easeInOut' }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <Image
                      src={currentSlide.image}
                      alt={currentSlide.alt}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-top filter brightness-[1.02]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

                    {/* Active slide badge on image */}
                    <div className="absolute top-5 left-5 z-20 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-[11px] font-bold flex items-center gap-1.5 border border-white/20">
                      <span className="w-2 h-2 rounded-full bg-[#FF5722] animate-pulse" />
                      <span>{currentSlide.subtitle}</span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Left / Right Carousel Arrow Buttons */}
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous slide"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-gray-900 flex items-center justify-center shadow-lg backdrop-blur-md transition-all opacity-80 group-hover:opacity-100 hover:scale-110 cursor-pointer border border-gray-100"
              >
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next slide"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-gray-900 flex items-center justify-center shadow-lg backdrop-blur-md transition-all opacity-80 group-hover:opacity-100 hover:scale-110 cursor-pointer border border-gray-100"
              >
                <ChevronRight className="w-5 h-5 text-gray-800" />
              </button>

              {/* FLOATING CARD 1: Top Left */}
              {currentSlide.cards[0] && (
                <Link 
                  href={currentSlide.cards[0].href}
                  className="absolute -top-4 sm:top-2 left-4 sm:left-10 z-20 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-xl border border-gray-100 hover:scale-105 transition-transform flex items-center gap-3 animate-float"
                >
                  <div className="w-11 h-11 sm:w-12 sm:h-12 relative rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    <Image
                      src={currentSlide.cards[0].image}
                      alt={currentSlide.cards[0].title}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-left pr-2">
                    <p className="text-[11px] sm:text-xs font-bold text-gray-900 leading-tight">
                      {currentSlide.cards[0].title}
                    </p>
                    <p suppressHydrationWarning className="text-[11px] sm:text-xs font-bold text-[#FF5722] mt-0.5">
                      {formatPrice(currentSlide.cards[0].price)}
                    </p>
                  </div>
                </Link>
              )}

              {/* FLOATING CARD 2: Top Right */}
              {currentSlide.cards[1] && (
                <Link 
                  href={currentSlide.cards[1].href}
                  className="absolute top-8 sm:top-6 -right-2 sm:right-2 z-20 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-xl border border-gray-100 hover:scale-105 transition-transform flex items-center gap-3 animate-float"
                  style={{ animationDelay: '1s' }}
                >
                  <div className="w-11 h-11 sm:w-12 sm:h-12 relative rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    <Image
                      src={currentSlide.cards[1].image}
                      alt={currentSlide.cards[1].title}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-left pr-2">
                    <p className="text-[11px] sm:text-xs font-bold text-gray-900 leading-tight">
                      {currentSlide.cards[1].title}
                    </p>
                    <p suppressHydrationWarning className="text-[11px] sm:text-xs font-bold text-gray-900 mt-0.5">
                      {formatPrice(currentSlide.cards[1].price)}
                    </p>
                  </div>
                </Link>
              )}

              {/* FLOATING CARD 3: Left Center */}
              {currentSlide.cards[2] && (
                <Link 
                  href={currentSlide.cards[2].href}
                  className="absolute top-1/2 -left-3 sm:-left-6 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-xl border border-gray-100 hover:scale-105 transition-transform flex items-center gap-3 animate-float"
                  style={{ animationDelay: '2s' }}
                >
                  <div className="w-11 h-11 sm:w-12 sm:h-12 relative rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    <Image
                      src={currentSlide.cards[2].image}
                      alt={currentSlide.cards[2].title}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-left pr-2">
                    <p className="text-[11px] sm:text-xs font-bold text-gray-900 leading-tight">
                      {currentSlide.cards[2].title}
                    </p>
                    <p suppressHydrationWarning className="text-[11px] sm:text-xs font-bold text-gray-900 mt-0.5">
                      {formatPrice(currentSlide.cards[2].price)}
                    </p>
                  </div>
                </Link>
              )}

              {/* FLOATING CARD 4: Bottom Right */}
              {currentSlide.cards[3] && (
                <Link 
                  href={currentSlide.cards[3].href}
                  className="absolute bottom-6 sm:bottom-10 -right-2 sm:right-2 z-20 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-xl border border-gray-100 hover:scale-105 transition-transform flex items-center gap-3 animate-float"
                  style={{ animationDelay: '1.5s' }}
                >
                  <div className="w-11 h-11 sm:w-12 sm:h-12 relative rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    <Image
                      src={currentSlide.cards[3].image}
                      alt={currentSlide.cards[3].title}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-left pr-2">
                    <p className="text-[11px] sm:text-xs font-bold text-gray-900 leading-tight">
                      {currentSlide.cards[3].title}
                    </p>
                    <p suppressHydrationWarning className="text-[11px] sm:text-xs font-bold text-gray-900 mt-0.5">
                      {formatPrice(currentSlide.cards[3].price)}
                    </p>
                  </div>
                </Link>
              )}

              {/* Moving Carousel Indicators (Interactive dots with active expanding pill) */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
                {HERO_SLIDES.map((slide, idx) => {
                  const isActive = idx === currentSlideIndex;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setCurrentSlideIndex(idx)}
                      aria-label={`Jump to slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'w-6 bg-[#FF5722]'
                          : 'w-2 bg-white/60 hover:bg-white'
                      }`}
                    />
                  );
                })}
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

