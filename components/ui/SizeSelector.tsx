// components/ui/SizeSelector.tsx
'use client';

import React from 'react';
import { Size } from '@/types/product';
import { cn } from '@/lib/utils';

export interface SizeSelectorProps {
  availableSizes: (Size | string)[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
  stockMap?: Record<string, number>;
  className?: string;
}

export function SizeSelector({
  availableSizes,
  selectedSize,
  onSelectSize,
  stockMap,
  className,
}: SizeSelectorProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {availableSizes.map((size) => {
        const isOutOfStock = stockMap && stockMap[size] !== undefined && stockMap[size] <= 0;
        const isSelected = selectedSize === size;

        return (
          <button
            key={size}
            type="button"
            disabled={isOutOfStock}
            onClick={() => onSelectSize(size)}
            className={cn(
              'min-w-[44px] h-[40px] px-3.5 flex items-center justify-center text-xs font-semibold border rounded-xl transition-all cursor-pointer select-none',
              isSelected
                ? 'border-[#FF5722] bg-[#FF5722] text-white shadow-xs'
                : 'border-gray-200 bg-white text-gray-800 hover:border-gray-400',
              isOutOfStock && 'opacity-40 cursor-not-allowed line-through bg-gray-100 border-gray-200'
            )}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
