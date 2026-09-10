// components/product/ProductImages.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProductImagesProps {
  images: string[];
  productName: string;
  className?: string;
}

export function ProductImages({ images, productName, className }: ProductImagesProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeImage = images[selectedIdx] || images[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={cn('flex flex-col-reverse md:flex-row gap-4 sm:gap-6', className)}>
      {/* Thumbnail column with variant indicators */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-24 flex-shrink-0 py-1">
          {images.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedIdx(index)}
              className={cn(
                'relative w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 rounded-xl overflow-hidden bg-gray-100 border-2 transition-all flex-shrink-0 cursor-pointer group',
                selectedIdx === index
                  ? 'border-[#FF5722] ring-2 ring-[#FF5722]/30 shadow-md scale-[1.02]'
                  : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'
              )}
            >
              <Image
                src={img}
                alt={`${productName} variant ${index + 1}`}
                fill
                sizes="96px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1 py-0.5 rounded backdrop-blur-xs">
                {index + 1}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Main hero image container */}
      <div className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm group">
        <Image
          src={activeImage}
          alt={`${productName} view ${selectedIdx + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          className="object-cover object-center transition-all duration-300 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Variant count badge */}
        {images.length > 1 && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1.5 z-10">
            <Eye className="w-3.5 h-3.5 text-[#FF5722]" />
            <span>Image {selectedIdx + 1} of {images.length}</span>
          </div>
        )}

        {/* Carousel Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-lg flex items-center justify-center transition-all opacity-80 hover:opacity-100 cursor-pointer z-10 hover:scale-110"
              aria-label="Previous image variant"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-lg flex items-center justify-center transition-all opacity-80 hover:opacity-100 cursor-pointer z-10 hover:scale-110"
              aria-label="Next image variant"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

