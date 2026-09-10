// app/(shop)/products/[slug]/page.tsx
'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronRight, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Ruler, 
  Share2,
  Check,
  Zap
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { ProductImages } from '@/components/product/ProductImages';
import { StarRating } from '@/components/ui/StarRating';
import { SizeSelector } from '@/components/ui/SizeSelector';
import { Badge } from '@/components/ui/Badge';
import { SizeGuide } from '@/components/product/SizeGuide';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { ProductReviews } from '@/components/product/ProductReviews';
import { ProductCard } from '@/components/product/ProductCard';
import { useCurrencyStore } from '@/store/currencyStore';
import { calculateDiscount } from '@/lib/utils/helpers';
import { useWishlistStore } from '@/store/wishlistStore';
import { showToast } from '@/components/ui/Toast';
import { getTotalStock } from '@/types/product';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { allProducts } = useProducts();
  const { formatPrice, currency } = useCurrencyStore();

  const product = allProducts.find((p) => p.slug === slug);

  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes?.[0] || 'M');

  React.useEffect(() => {
    if (product?.sizes && product.sizes.length > 0) {
      if (!selectedSize || !product.sizes.includes(selectedSize as any)) {
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [product, selectedSize]);

  const [quantity] = useState<number>(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const isWishlisted = product ? isInWishlist(product.id) : false;

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Product Not Found
        </h2>
        <p className="text-sm text-gray-500">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/products"
          className="inline-block bg-[#FF5722] text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-[#F4511E] transition-colors"
        >
          Browse All Products
        </Link>
      </div>
    );
  }

  const discount = calculateDiscount(product.price, product.salePrice);
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      showToast.success('Link Copied', 'Product link copied to clipboard.');
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-14">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium">
        <Link href="/" className="hover:text-gray-900">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/products" className="hover:text-gray-900">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href={`/products?category=${product.category}`} className="hover:text-gray-900 capitalize">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-bold truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* 2. Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 text-left">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7">
          <ProductImages images={product.images} productName={product.name} />
        </div>

        {/* Right Column: Product Information & Purchase Controls */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* Header & Title */}
          <div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-[#FF5722] uppercase tracking-wider">
                {product.category} {product.subcategory ? `• ${product.subcategory}` : ''}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                  title="Share product"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center transition-colors cursor-pointer ${
                    isWishlisted ? 'bg-[#FFF3E0] text-[#FF5722] border-[#FF5722]' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  title={isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#FF5722] text-[#FF5722]' : ''}`} />
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight mt-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-2">
              <StarRating rating={product.rating} size="sm" />
              <span className="text-xs text-gray-700 font-semibold">
                {product.rating} ({product.reviewCount} customer reviews)
              </span>
              {getTotalStock(product.stock) > 0 && getTotalStock(product.stock) <= 5 && (
                <span className="text-[11px] text-[#FF5722] bg-[#FFF3E0] px-2 py-0.5 rounded-full font-bold">
                  Low Stock: Only {getTotalStock(product.stock)} left
                </span>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <span suppressHydrationWarning className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  {formatPrice(product.salePrice || product.price)}
                </span>
                {product.salePrice && (
                  <span suppressHydrationWarning className="text-base text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              <p suppressHydrationWarning className="text-xs text-gray-500 mt-0.5">
                Free standard shipping on orders over {formatPrice(50)}.
              </p>
            </div>

            {discount > 0 && (
              <Badge variant="sale" size="md" className="bg-[#FF5722] text-white px-3 py-1 font-bold rounded-lg">
                -{discount}% OFF
              </Badge>
            )}
          </div>

          {/* Short Narrative Description */}
          <p className="text-sm text-gray-600 leading-relaxed font-normal">
            {product.description}
          </p>

          {/* Size Selection */}
          <div className="space-y-2.5 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Select Option / Size
              </span>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="text-xs font-semibold text-[#FF5722] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            <SizeSelector
              availableSizes={product.sizes}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
              stockMap={product.stock}
            />
          </div>

          {/* Add To Cart & Stepper */}
          <div className="space-y-3 pt-2">
            <AddToCartButton
              product={product}
              selectedSize={selectedSize}
              quantity={quantity}
            />
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 text-xs text-gray-700 text-center">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-[#FF5722]" />
              <span className="font-bold">Fast Delivery</span>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-[#FF5722]" />
              <span className="font-bold">30-Day Returns</span>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#FF5722]" />
              <span className="font-bold">100% Genuine</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Customer Reviews Section */}
      <ProductReviews productId={product.id} productName={product.name} />

      {/* 4. Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-gray-100 text-left">
          <div>
            <span className="text-xs font-bold text-[#FF5722] uppercase tracking-wider">
              You Might Also Like
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mt-1">
              Related Trending Products
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuide isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
}
