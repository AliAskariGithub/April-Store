// components/ai/SmartSearchBar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, Sparkles, ArrowRight, CornerDownLeft } from 'lucide-react';
import { Product } from '@/types/product';
import { useCurrencyStore } from '@/store/currencyStore';
import { SearchSuggestions } from './SearchSuggestions';
import { Spinner } from '@/components/ui/Spinner';

interface SmartSearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SmartSearchBar({ isOpen, onClose }: SmartSearchBarProps) {
  const { formatPrice } = useCurrencyStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [intent, setIntent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setQuery(searchQuery);

    try {
      const res = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      if (data.products) {
        setResults(data.products);
        setIntent(data.intent || null);
      }
    } catch (err) {
      console.error('Smart search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="relative mx-auto max-w-3xl bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden z-10 animate-slide-up">
        {/* Search Header Input */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center gap-3 bg-white">
          <div className="w-9 h-9 rounded-xl bg-[#FFF3E0] text-[#FF5722] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query);
            }}
            className="flex-1 flex items-center gap-2"
          >
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search trending hoodies, running shoes, smart watches, or headphones..."
              className="w-full text-sm font-sans text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                  setIntent(null);
                }}
                className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          <button
            type="button"
            onClick={() => handleSearch(query)}
            disabled={!query.trim() || loading}
            className="bg-[#FF5722] hover:bg-[#F4511E] disabled:opacity-50 text-white rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
          >
            {loading ? (
              <Spinner size="sm" color="white" />
            ) : (
              <>
                <span>Search</span>
                <CornerDownLeft className="w-3.5 h-3.5 opacity-80" />
              </>
            )}
          </button>
        </div>

        {/* AI Intent Pill & Results */}
        <div className="p-5 sm:p-6 max-h-[60vh] overflow-y-auto bg-gray-50/50">
          {intent && (
            <div className="mb-4 bg-white border border-gray-100 rounded-xl p-3.5 flex items-start gap-2.5 shadow-xs">
              <Sparkles className="w-4 h-4 text-[#FF5722] flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-gray-900">AI Intent Match: </span>
                <span className="text-gray-600">{intent}</span>
              </div>
            </div>
          )}

          {results.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Matching Products ({results.length})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm transition-all group"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-[#FF5722] transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 uppercase font-medium">
                        {product.category}
                      </p>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-xs font-extrabold text-gray-900">
                          {formatPrice(product.salePrice || product.price)}
                        </span>
                        {product.salePrice && (
                          <span className="text-[10px] text-gray-400 line-through">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#FF5722] group-hover:translate-x-0.5 transition-all mr-1 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          ) : query && !loading ? (
            <div className="py-8 text-center space-y-2">
              <p className="text-sm font-bold text-gray-900">
                No matching items found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try searching for hoodies, Air Max, smart watches, headphones, or water bottles.
              </p>
            </div>
          ) : (
            <SearchSuggestions onSelect={(s) => handleSearch(s)} />
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-white border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
          <span>Powered by Gemini AI</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
