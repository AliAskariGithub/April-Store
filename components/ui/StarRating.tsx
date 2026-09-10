// components/ui/StarRating.tsx
'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StarRatingProps {
  rating: number; // 0 to 5
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showNumber?: boolean;
  reviewCount?: number;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'sm',
  interactive = false,
  onChange,
  showNumber = false,
  reviewCount,
  className,
}: StarRatingProps) {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = rating >= starValue;
          const isHalf = !isFilled && rating >= starValue - 0.5;

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange?.(starValue)}
              className={cn(
                'transition-transform',
                interactive && 'hover:scale-110 cursor-pointer focus:outline-none'
              )}
            >
              <Star
                strokeWidth={1.5}
                className={cn(
                  iconSizes[size],
                  isFilled
                    ? 'fill-[#F59E0B] text-[#F59E0B]'
                    : isHalf
                    ? 'fill-[#F59E0B]/50 text-[#F59E0B]'
                    : 'fill-transparent text-gray-300'
                )}
              />
            </button>
          );
        })}
      </div>

      {showNumber && (
        <span className="text-xs font-semibold text-gray-900">
          {rating.toFixed(1)}
        </span>
      )}

      {reviewCount !== undefined && (
        <span className="text-xs text-gray-500">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
