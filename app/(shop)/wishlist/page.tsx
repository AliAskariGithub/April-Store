// app/(shop)/wishlist/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Trash2 } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';

export default function WishlistPage() {
  const { productIds, clearWishlist } = useWishlistStore();
  const { allProducts } = useProducts();

  const wishlistedProducts = allProducts.filter((p) => productIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#121212]">
        <div>
          <span className="text-[11px] font-bold text-[#8E8A83] uppercase tracking-[0.15em] font-spartan">
            Curated Favorites
          </span>
          <h1 className="font-spartan text-[28px] sm:text-[36px] font-extrabold uppercase tracking-[0.08em] text-[#121212] mt-1">
            Archival Wishlist ({wishlistedProducts.length})
          </h1>
          <p className="text-[13px] text-[#8E8A83] font-sans mt-1">
            Reserved couture silhouettes, evening wear, and limited atelier garments.
          </p>
        </div>

        {wishlistedProducts.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearWishlist}
            className="flex items-center gap-1.5 text-[#121212] border-[#121212] hover:bg-[#121212] hover:text-white self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge Selection</span>
          </Button>
        )}
      </div>

      {/* Grid */}
      {wishlistedProducts.length === 0 ? (
        <div className="py-24 text-center rounded-none bg-[#FAF8F5] border border-[#121212] p-8 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-none bg-[#FFFFFF] border border-[#121212] text-[#8E8A83] flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7 text-[#121212]" strokeWidth={1.2} />
          </div>
          <div>
            <h3 className="font-spartan text-[18px] font-extrabold uppercase tracking-[0.06em] text-[#121212]">
              Wishlist Empty
            </h3>
            <p className="text-[13px] text-[#8E8A83] font-sans mt-1">
              Explore our current collection and click the bookmark icon to save desirable garments.
            </p>
          </div>
          <Link href="/products">
            <Button variant="primary" size="md" className="bg-[#FF5722] hover:bg-[#F4511E] text-white rounded-xl">
              Explore Collection
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {wishlistedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

