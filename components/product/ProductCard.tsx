// components/product/ProductCard.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/utils/format';
import { calculateDiscount } from '@/lib/utils/helpers';
import { StarRating } from '@/components/ui/StarRating';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { showToast } from '@/components/ui/Toast';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export interface ProductCardProps {
  product: Product;
  className?: string;
}

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=900&auto=format&fit=crop';

export function ProductCard({ product, className }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const { openCart } = useUIStore();
  const { formatPrice } = useCurrencyStore();
  const isWishlisted = isInWishlist(product.id);

  const discount = calculateDiscount(product.price, product.salePrice);
  const primaryImage = product.images[0] || DEFAULT_FALLBACK_IMAGE;
  const secondaryImage = product.images[1] || primaryImage;
  const [imgSrc, setImgSrc] = useState(primaryImage);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes[0] || 'Standard';
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: primaryImage,
      size: defaultSize,
      quantity: 1,
      unitPrice: product.salePrice || product.price,
    });
    showToast.success('Added to Bag', `${product.name} added to your shopping bag.`);
    openCart();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    if (!isWishlisted) {
      showToast.success('Saved to Wishlist', `${product.name} saved.`);
    } else {
      showToast.info('Removed from Wishlist', `${product.name} removed.`);
    }
  };

  return (
    <div className={cn(
      'group flex flex-col bg-white border border-gray-100 hover:border-gray-300 hover:shadow-lg transition-all duration-300 rounded-2xl p-3.5 relative overflow-hidden',
      className
    )}>
      {/* Product Image Box */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50 rounded-xl mb-3">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <div className="relative w-full h-full">
            <Image
              src={imgSrc}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgSrc(DEFAULT_FALLBACK_IMAGE)}
              referrerPolicy="no-referrer"
            />

            {product.images[1] && (
              <Image
                src={secondaryImage}
                alt={`${product.name} alternate view`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-center opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                referrerPolicy="no-referrer"
              />
            )}
          </div>
        </Link>

        {/* Badges: -20% or New */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {discount > 0 ? (
            <Badge variant="sale" size="sm" className="bg-[#FF5722] text-white font-bold px-2 py-0.5 rounded-md text-[10px]">
              -{discount}%
            </Badge>
          ) : product.tags?.includes('new-arrival') || product.tags?.includes('new') ? (
            <Badge variant="new" size="sm" className="bg-[#111827] text-white font-bold px-2 py-0.5 rounded-md text-[10px]">
              New
            </Badge>
          ) : null}
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={handleWishlist}
          suppressHydrationWarning
          className={cn(
            'absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 cursor-pointer shadow-xs',
            isWishlisted
              ? 'bg-white text-[#FF5722]'
              : 'bg-white/90 hover:bg-white text-gray-500 hover:text-[#FF5722]'
          )}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            className={cn('w-4 h-4', isWishlisted && 'fill-[#FF5722] text-[#FF5722]')}
            strokeWidth={1.8}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 text-left space-y-1">
        <Link
          href={`/products/${product.slug}`}
          className="text-sm font-bold text-gray-900 hover:text-[#FF5722] transition-colors line-clamp-1"
        >
          {product.name}
        </Link>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <StarRating rating={product.rating || 5} size="sm" />
          <span className="text-[11px] font-medium text-gray-500">
            ({product.reviewCount || 120})
          </span>
        </div>

        {/* Price & Quick Add Button */}
        <div className="flex items-center justify-between pt-1 mt-auto">
          <div className="flex items-baseline gap-2">
            <span suppressHydrationWarning className="text-base font-extrabold text-gray-900">
              {formatPrice(product.salePrice || product.price)}
            </span>
            {product.salePrice && (
              <span suppressHydrationWarning className="text-xs text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Quick Add To Bag Button (Circular black button with shopping cart icon matching UI screenshot) */}
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-8 h-8 rounded-full bg-[#111827] hover:bg-[#FF5722] text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
            title="Add to cart"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
