// components/home/PromoBanners.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function PromoBanners() {
  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 15,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatUnit = (num: number) => num.toString().padStart(2, '0');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* BANNER 1: Left - Flash Sale (Orange Gradient + Countdown Timer + Sneaker) */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-[#FF5722] via-[#FF6E40] to-[#FF8A65] p-6 sm:p-10 text-white flex flex-col justify-between shadow-lg">
          
          <div className="relative z-10 space-y-4 max-w-sm text-left">
            <span className="inline-block bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Flash Sale
            </span>

            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Up To 70% Off
            </h3>

            {/* Live Countdown Timer */}
            <div className="flex items-center gap-2 pt-1">
              <div className="bg-white/20 backdrop-blur-md rounded-xl px-2.5 py-1.5 text-center min-w-[48px]">
                <span className="block text-lg sm:text-xl font-extrabold leading-none">
                  {formatUnit(timeLeft.days)}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-white/80 font-medium">
                  Days
                </span>
              </div>
              <span className="text-lg font-bold opacity-75">:</span>

              <div className="bg-white/20 backdrop-blur-md rounded-xl px-2.5 py-1.5 text-center min-w-[48px]">
                <span className="block text-lg sm:text-xl font-extrabold leading-none">
                  {formatUnit(timeLeft.hours)}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-white/80 font-medium">
                  Hours
                </span>
              </div>
              <span className="text-lg font-bold opacity-75">:</span>

              <div className="bg-white/20 backdrop-blur-md rounded-xl px-2.5 py-1.5 text-center min-w-[48px]">
                <span className="block text-lg sm:text-xl font-extrabold leading-none">
                  {formatUnit(timeLeft.minutes)}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-white/80 font-medium">
                  Mins
                </span>
              </div>
              <span className="text-lg font-bold opacity-75">:</span>

              <div className="bg-white/20 backdrop-blur-md rounded-xl px-2.5 py-1.5 text-center min-w-[48px]">
                <span className="block text-lg sm:text-xl font-extrabold leading-none">
                  {formatUnit(timeLeft.seconds)}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-white/80 font-medium">
                  Secs
                </span>
              </div>
            </div>

            {/* Button */}
            <div className="pt-3">
              <Link href="/products?sale=true">
                <Button
                  variant="secondary"
                  className="bg-white text-[#FF5722] hover:bg-gray-50 border-0 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-md"
                >
                  <span>Shop Sale Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Floating Sneaker Graphic on Right */}
          <div className="absolute right-2 -bottom-4 sm:bottom-0 w-44 sm:w-64 h-44 sm:h-64 pointer-events-none opacity-90 sm:opacity-100">
            <Image
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop"
              alt="Flash Sale Shoe"
              fill
              className="object-contain transform -rotate-12 hover:scale-105 transition-transform"
            />
          </div>
        </div>

        {/* BANNER 2: Right - New Collection (Black Luxury + Orange Swoosh + Model) */}
        <div className="relative rounded-3xl overflow-hidden bg-[#0F1117] p-6 sm:p-10 text-white flex flex-col justify-between shadow-lg border border-gray-800">
          
          {/* Subtle Orange Glow Curved Swoop */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#FF5722]/30 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-sm text-left">
            <span className="inline-block bg-white/10 text-gray-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
              New Collection
            </span>

            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Summer 2025
            </h3>

            <p className="text-sm text-gray-300 font-normal">
              Discover the latest trends and fresh styles curated for the season.
            </p>

            {/* Button */}
            <div className="pt-3">
              <Link href="/products?sort=newest">
                <Button
                  variant="primary"
                  className="bg-white text-gray-900 hover:bg-gray-100 border-0 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-md"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Model Visual on Right */}
          <div className="absolute right-0 bottom-0 w-48 sm:w-64 h-full pointer-events-none overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop"
              alt="Summer Collection"
              fill
              className="object-cover object-top opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F1117] via-transparent to-transparent" />
          </div>

        </div>

      </div>
    </section>
  );
}
