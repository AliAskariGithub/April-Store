// components/ai/SearchSuggestions.tsx
'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface SearchSuggestionsProps {
  onSelect: (query: string) => void;
}

const SUGGESTIONS = [
  'Essential cotton fleece hoodie',
  'Air Max 270 athletic running shoes',
  'Smart Watch Series 9 with fitness tracker',
  'Wireless noise cancelling headphones',
  'Double-walled stainless steel bottle',
  'Polarized aviator sunglasses',
];

export function SearchSuggestions({ onSelect }: SearchSuggestionsProps) {
  return (
    <div className="space-y-2.5 text-left">
      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-[#FF5722]" />
        <span>Popular Trending Searches</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSelect(suggestion)}
            className="text-xs text-gray-700 hover:text-white bg-white hover:bg-[#FF5722] hover:border-[#FF5722] border border-gray-200 rounded-full px-3.5 py-1.5 transition-all text-left cursor-pointer shadow-2xs font-medium"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
