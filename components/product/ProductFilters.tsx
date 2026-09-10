// components/product/ProductFilters.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { RotateCcw, Filter, Check, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SortOption } from '@/hooks/useProducts';

export interface FilterState {
  category?: string;
  sizes?: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sort?: SortOption;
}

export interface ProductFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  className?: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'fashion', label: 'Fashion & Streetwear' },
  { id: 'electronics', label: 'Electronics & Audio' },
  { id: 'beauty', label: 'Beauty & Skincare' },
  { id: 'fitness', label: 'Fitness & Activewear' },
  { id: 'home-decor', label: 'Home Decor' },
  { id: 'accessories', label: 'Accessories' },
];

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'One Size'];

const MIN_LIMIT = 0;
const MAX_LIMIT = 500;
const PRICE_STEP = 5;

const QUICK_PRICE_PRESETS = [
  { label: 'All', min: undefined, max: undefined },
  { label: '< $50', min: 0, max: 50 },
  { label: '$50-$150', min: 50, max: 150 },
  { label: '$150-$300', min: 150, max: 300 },
  { label: '$300+', min: 300, max: MAX_LIMIT },
];

export function ProductFilters({
  filters,
  onChange,
  onReset,
  className,
}: ProductFiltersProps) {
  // Local state for smooth slider dragging without delay
  const currentMin = filters.minPrice !== undefined ? filters.minPrice : MIN_LIMIT;
  const currentMax = filters.maxPrice !== undefined ? filters.maxPrice : MAX_LIMIT;

  const [minVal, setMinVal] = useState<number>(currentMin);
  const [maxVal, setMaxVal] = useState<number>(currentMax);

  // Sync with external filters change
  useEffect(() => {
    setMinVal(filters.minPrice !== undefined ? filters.minPrice : MIN_LIMIT);
  }, [filters.minPrice]);

  useEffect(() => {
    setMaxVal(filters.maxPrice !== undefined ? filters.maxPrice : MAX_LIMIT);
  }, [filters.maxPrice]);

  const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxVal - PRICE_STEP);
    setMinVal(value);
    onChange({
      ...filters,
      minPrice: value === MIN_LIMIT ? undefined : value,
      maxPrice: maxVal === MAX_LIMIT ? undefined : maxVal,
    });
  };

  const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minVal + PRICE_STEP);
    setMaxVal(value);
    onChange({
      ...filters,
      minPrice: minVal === MIN_LIMIT ? undefined : minVal,
      maxPrice: value === MAX_LIMIT ? undefined : value,
    });
  };

  const handleManualMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value);
    if (isNaN(raw)) return;
    const value = Math.max(MIN_LIMIT, Math.min(raw, maxVal - PRICE_STEP));
    setMinVal(value);
    onChange({
      ...filters,
      minPrice: value === MIN_LIMIT ? undefined : value,
      maxPrice: maxVal === MAX_LIMIT ? undefined : maxVal,
    });
  };

  const handleManualMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value);
    if (isNaN(raw)) return;
    const value = Math.min(MAX_LIMIT, Math.max(raw, minVal + PRICE_STEP));
    setMaxVal(value);
    onChange({
      ...filters,
      minPrice: minVal === MIN_LIMIT ? undefined : minVal,
      maxPrice: value === MAX_LIMIT ? undefined : value,
    });
  };

  const setPresetPrice = (min?: number, max?: number) => {
    const newMin = min !== undefined ? min : MIN_LIMIT;
    const newMax = max !== undefined ? max : MAX_LIMIT;
    setMinVal(newMin);
    setMaxVal(newMax);
    onChange({
      ...filters,
      minPrice: min,
      maxPrice: max,
    });
  };

  const toggleSize = (size: string) => {
    const current = filters.sizes || [];
    const updated = current.includes(size)
      ? current.filter((s) => s !== size)
      : [...current, size];
    onChange({ ...filters, sizes: updated.length > 0 ? updated : undefined });
  };

  const isPriceFiltered = filters.minPrice !== undefined || filters.maxPrice !== undefined;

  // Calculate percentages for the slider fill highlight
  const minPercent = Math.round(((minVal - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * 100);
  const maxPercent = Math.round(((maxVal - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * 100);

  return (
    <div className={cn('space-y-6 text-left', className)}>
      {/* Filter Header with Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
          <Filter className="w-4 h-4 text-[#FF5722]" strokeWidth={2} />
          <span>Filters</span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-gray-500 hover:text-[#FF5722] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Categories */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          Categories
        </h4>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isSelected = (!filters.category && cat.id === 'all') || filters.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  if (cat.id === 'all') {
                    onChange({ ...filters, category: undefined });
                  } else if (filters.category === cat.id) {
                    onChange({ ...filters, category: undefined });
                  } else {
                    onChange({ ...filters, category: cat.id });
                  }
                }}
                className={cn(
                  'w-full flex items-center justify-between text-left text-xs px-3 py-2 rounded-xl transition-colors cursor-pointer',
                  isSelected
                    ? 'bg-[#FFF3E0] text-[#FF5722] font-bold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <span>{cat.label}</span>
                {isSelected && <Check className="w-4 h-4 text-[#FF5722]" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Price Range [Slider Based] */}
      <div className="space-y-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Price Range
          </h4>
          {isPriceFiltered && (
            <button
              type="button"
              onClick={() => setPresetPrice(undefined, undefined)}
              className="text-[11px] font-semibold text-[#FF5722] hover:underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        {/* Current Active Price Range Display */}
        <div className="flex items-center justify-between bg-gray-50/80 px-3 py-2 rounded-xl border border-gray-100 text-xs">
          <div className="flex items-center gap-1 font-bold text-gray-900">
            <DollarSign className="w-3.5 h-3.5 text-[#FF5722]" />
            <span>${minVal}</span>
          </div>
          <span className="text-gray-400 font-medium text-[11px]">to</span>
          <div className="flex items-center gap-1 font-bold text-gray-900">
            <DollarSign className="w-3.5 h-3.5 text-[#FF5722]" />
            <span>${maxVal}{maxVal >= MAX_LIMIT ? '+' : ''}</span>
          </div>
        </div>

        {/* Interactive Dual Slider Track */}
        <div className="relative w-full h-8 flex items-center px-1">
          {/* Base Background Track */}
          <div className="absolute left-1 right-1 h-2 bg-gray-200 rounded-full" />

          {/* Active Highlight Fill Track */}
          <div
            className="absolute h-2 bg-[#FF5722] rounded-full transition-all pointer-events-none"
            style={{
              left: `${minPercent}%`,
              width: `${Math.max(0, maxPercent - minPercent)}%`,
            }}
          />

          {/* Min Price Thumb Slider */}
          <input
            type="range"
            min={MIN_LIMIT}
            max={MAX_LIMIT}
            step={PRICE_STEP}
            value={minVal}
            onChange={handleMinSliderChange}
            aria-label="Minimum Price"
            className={cn(
              'range-slider-input absolute left-0 w-full h-2 bg-transparent focus:outline-none',
              minVal > MAX_LIMIT - 50 ? 'z-40' : 'z-30'
            )}
          />

          {/* Max Price Thumb Slider */}
          <input
            type="range"
            min={MIN_LIMIT}
            max={MAX_LIMIT}
            step={PRICE_STEP}
            value={maxVal}
            onChange={handleMaxSliderChange}
            aria-label="Maximum Price"
            className="range-slider-input absolute left-0 w-full h-2 bg-transparent focus:outline-none z-30"
          />
        </div>

        {/* Numeric Precision Inputs */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
              Min ($)
            </label>
            <input
              type="number"
              min={MIN_LIMIT}
              max={maxVal - PRICE_STEP}
              value={minVal}
              onChange={handleManualMinChange}
              className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#FF5722] text-gray-800"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
              Max ($)
            </label>
            <input
              type="number"
              min={minVal + PRICE_STEP}
              max={MAX_LIMIT}
              value={maxVal}
              onChange={handleManualMaxChange}
              className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#FF5722] text-gray-800"
            />
          </div>
        </div>

        {/* Quick Price Shortcuts */}
        <div className="flex flex-wrap gap-1 pt-1">
          {QUICK_PRICE_PRESETS.map((preset, idx) => {
            const isSelected =
              preset.min === filters.minPrice && preset.max === filters.maxPrice;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setPresetPrice(preset.min, preset.max)}
                className={cn(
                  'text-[10px] font-semibold px-2 py-1 rounded-md border transition-all cursor-pointer',
                  isSelected
                    ? 'bg-[#FF5722] text-white border-[#FF5722]'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Sizes */}
      <div className="space-y-2 pt-3 border-t border-gray-100">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          Sizes
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {AVAILABLE_SIZES.map((size) => {
            const isSelected = (filters.sizes || []).includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={cn(
                  'text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer',
                  isSelected
                    ? 'bg-[#FF5722] text-white border-[#FF5722]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
