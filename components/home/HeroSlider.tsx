// components/home/HeroSlider.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Star, 
  Leaf, 
  ShieldCheck, 
  Flame,
  Pause,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

export interface HeroSlide {
  id: string;
  image: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  badgeLabel?: string;
  badgeIcon?: 'leaf' | 'star' | 'shield' | 'flame';
  season: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop',
    eyebrow: 'COLLECTION N° 04 • SS25 ATELIER',
    headline: 'Pure Form.\nTimeless Silhouette.',
    subheadline: 'An architectural exploration of French Normandy flax, tailored wool, and sculptural minimalism crafted for effortless modern living.',
    ctaText: 'Explore Collection',
    ctaLink: '/products',
    badgeLabel: 'Certified Organic Flax',
    badgeIcon: 'leaf',
    season: 'SPRING / SUMMER 2025'
  },
  {
    id: 'slide-2',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1920&auto=format&fit=crop',
    eyebrow: 'CAPSULE ARCHIVE • LIMITED EDITION',
    headline: 'Fluid Drape.\nSculpted Balance.',
    subheadline: 'Impeccably tailored outerwear and relaxed-fit separates designed to move with quiet grace throughout the metropolitan landscape.',
    ctaText: 'Discover Capsule',
    ctaLink: '/products?category=women',
    badgeLabel: 'Limited Run: 150 Pieces',
    badgeIcon: 'shield',
    season: 'MONOCHROME ATELIER'
  },
  {
    id: 'slide-3',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1920&auto=format&fit=crop',
    eyebrow: 'THE ARCHITECTURAL SUITE',
    headline: 'Master Tailoring.\nUnderstated Luxury.',
    subheadline: 'Structured Italian virgin wool blends meet softened shoulders, creating a distinctive modern profile for discerning occasions.',
    ctaText: 'View Tailoring',
    ctaLink: '/products?category=men',
    badgeLabel: 'Archival Wool Masterpiece',
    badgeIcon: 'star',
    season: 'AUTUMN / WINTER SOLSTICE'
  },
  {
    id: 'slide-4',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1920&auto=format&fit=crop',
    eyebrow: 'NOCTURNE OCCASION • GALA DROP',
    headline: 'Dramatic Grace.\nSensory Elegance.',
    subheadline: 'Floor-skimming silk crepe gowns and luminescent tunics designed to captivate evening galas with minimalist reverence.',
    ctaText: 'Shop Evening Wear',
    ctaLink: '/products?category=dresses',
    badgeLabel: 'Featured in Runway Edit',
    badgeIcon: 'flame',
    season: 'NOCTURNE COUTURE'
  }
];

const AUTOPLAY_INTERVAL = 5000; // 5 seconds per slide

export function HeroSlider() {
  const { openChat } = useUIStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Touch swipe support
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    setProgress(0);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    setProgress(0);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIdx(index);
    setProgress(0);
  };

  // 5-second automatic sliding timer
  useEffect(() => {
    if (isPaused) return;

    const intervalStep = 50; // update progress every 50ms
    const totalSteps = AUTOPLAY_INTERVAL / intervalStep;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount += 1;
      const currentProgress = (stepCount / totalSteps) * 100;
      setProgress(currentProgress);

      if (stepCount >= totalSteps) {
        nextSlide();
        stepCount = 0;
      }
    }, intervalStep);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide, currentIdx]);

  // Touch handlers for mobile right/left swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const activeSlide = HERO_SLIDES[currentIdx];

  return (
    <section 
      id="hero-fullscreen-carousel"
      className="relative w-full h-[88vh] min-h-[620px] max-h-[960px] overflow-hidden bg-[#121212] select-none text-left"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Full-Screen Images Carousel */}
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === currentIdx;
        return (
          <div
            key={slide.id}
            className={cn(
              'absolute inset-0 w-full h-full transition-all duration-1000 ease-out',
              isActive
                ? 'opacity-100 scale-100 z-10'
                : 'opacity-0 scale-105 pointer-events-none z-0'
            )}
          >
            <Image
              src={slide.image}
              alt={slide.headline}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-center sm:object-top filter brightness-[0.88]"
              referrerPolicy="no-referrer"
            />
            {/* Architectural Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25 sm:w-2/3 lg:w-1/2" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          </div>
        );
      })}

      {/* Hero Content Overlay */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-8 sm:py-12">
        
        {/* Top Bar: Collection Indicator & Auto-play status */}
        <div className="flex items-center justify-between border-b border-white/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[#C5A880] inline-block animate-pulse" />
            <span className="font-spartan text-[11px] sm:text-[12px] font-bold text-white tracking-[0.2em] uppercase">
              {activeSlide.season}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Auto-play status & 5-second indicator */}
            <div className="hidden sm:flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/20 px-3 py-1 text-[10px] font-spartan text-white/90 uppercase tracking-[0.12em]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
              <span>5s Swipe • {isPaused ? 'Paused' : 'Active'}</span>
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className="ml-1 text-white/70 hover:text-white cursor-pointer"
                title={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
              >
                {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
              </button>
            </div>

            {/* Numeric Slide Counter */}
            <span className="font-spartan text-[12px] sm:text-[13px] font-extrabold text-white tracking-[0.15em] bg-black/50 border border-white/20 px-3 py-1">
              0{currentIdx + 1} <span className="text-[#C5A880]">/</span> 0{HERO_SLIDES.length}
            </span>
          </div>
        </div>

        {/* Middle Main Content */}
        <div className="max-w-2xl space-y-6 sm:space-y-7 my-auto pt-6">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-bold text-[#121212] uppercase tracking-[0.2em] font-spartan bg-[#EDE8DE] border border-[#C5A880] px-3.5 py-1.5 shadow-md">
            <span className="w-1.5 h-1.5 bg-[#121212]" />
            <span>{activeSlide.eyebrow}</span>
          </div>

          {/* Headline in Cormorant Garamond */}
          <h1 className="font-serif-heading text-[44px] sm:text-[62px] lg:text-[74px] font-normal text-white leading-[1.03] tracking-tight whitespace-pre-line drop-shadow-md">
            {activeSlide.headline}
          </h1>

          {/* Subheading */}
          <p className="text-[15px] sm:text-[17px] text-white/85 font-sans leading-relaxed max-w-xl font-light drop-shadow-sm">
            {activeSlide.subheadline}
          </p>

          {/* Call to Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link href={activeSlide.ctaLink}>
              <Button 
                variant="primary" 
                size="lg" 
                className="bg-white text-[#121212] hover:bg-[#FF5722] hover:text-white border-white flex items-center gap-3 group px-8 py-4 font-bold uppercase text-xs tracking-wider rounded-xl"
              >
                <span>{activeSlide.ctaText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
              </Button>
            </Link>

            <button
              type="button"
              onClick={openChat}
              className="inline-flex items-center gap-2.5 text-[12px] font-bold uppercase tracking-[0.1em] text-white hover:text-[#121212] bg-black/40 hover:bg-white border border-white/40 hover:border-white px-6 py-4 transition-all cursor-pointer font-spartan backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-[#C5A880]" />
              <span>AI Style Concierge</span>
            </button>
          </div>

          {/* Slide Tag / Pill */}
          {activeSlide.badgeLabel && (
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 text-white text-[11px] font-sans">
              {activeSlide.badgeIcon === 'leaf' && <Leaf className="w-3.5 h-3.5 text-[#C5A880]" />}
              {activeSlide.badgeIcon === 'star' && <Star className="w-3.5 h-3.5 text-[#C5A880] fill-[#C5A880]" />}
              {activeSlide.badgeIcon === 'shield' && <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />}
              {activeSlide.badgeIcon === 'flame' && <Flame className="w-3.5 h-3.5 text-[#C5A880]" />}
              <span className="font-medium tracking-wide">{activeSlide.badgeLabel}</span>
            </div>
          )}
        </div>

        {/* Bottom Bar: Progress indicators & Navigation Buttons */}
        <div className="pt-6 border-t border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* 4 Interactive Progress Bars (5s visual feedback) */}
          <div className="grid grid-cols-4 gap-2 w-full sm:max-w-md">
            {HERO_SLIDES.map((slide, index) => {
              const isCurrent = index === currentIdx;
              const isPast = index < currentIdx;

              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(index)}
                  className="group py-2 text-left cursor-pointer focus:outline-none"
                  title={`Go to slide ${index + 1}: ${slide.headline.split('\n')[0]}`}
                >
                  <div className="relative h-1 bg-white/30 overflow-hidden">
                    <div
                      className={cn(
                        'absolute top-0 left-0 h-full bg-[#C5A880] transition-all',
                        isCurrent
                          ? 'duration-75 ease-linear'
                          : isPast
                          ? 'w-full'
                          : 'w-0'
                      )}
                      style={{
                        width: isCurrent ? `${progress}%` : isPast ? '100%' : '0%',
                      }}
                    />
                  </div>
                  <span className={cn(
                    "text-[9px] font-bold font-spartan uppercase tracking-[0.1em] mt-1 block transition-colors",
                    isCurrent ? "text-white" : "text-white/50 group-hover:text-white/80"
                  )}>
                    0{index + 1} {slide.headline.split('\n')[0].slice(0, 10)}...
                  </span>
                </button>
              );
            })}
          </div>

          {/* Prev / Next Sharp Control Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={prevSlide}
              className="w-11 h-11 bg-black/60 hover:bg-white text-white hover:text-black border border-white/40 flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="w-11 h-11 bg-black/60 hover:bg-white text-white hover:text-black border border-white/40 flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
