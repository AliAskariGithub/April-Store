// components/product/AddToCartButton.tsx
'use client';

import React, { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { showToast } from '@/components/ui/Toast';

export interface AddToCartButtonProps {
  product: Product;
  selectedSize: string;
  quantity?: number;
  className?: string;
}

export function AddToCartButton({
  product,
  selectedSize,
  quantity = 1,
  className,
}: AddToCartButtonProps) {
  const { addItem } = useCartStore();
  const { openCart } = useUIStore();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    if (!selectedSize) {
      showToast.error('Please select an option', 'Choose your desired size before adding to cart.');
      return;
    }

    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0] || '',
      size: selectedSize,
      quantity,
      unitPrice: product.salePrice || product.price,
    });

    setJustAdded(true);
    showToast.success('Added to Cart', `${product.name} (${selectedSize}) added to your shopping cart.`);
    openCart();

    setTimeout(() => {
      setJustAdded(false);
    }, 2000);
  };

  return (
    <Button
      variant="primary"
      size="lg"
      onClick={handleAdd}
      className={`w-full py-3.5 bg-[#FF5722] hover:bg-[#F4511E] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all cursor-pointer ${className}`}
    >
      {justAdded ? (
        <>
          <Check className="w-5 h-5" strokeWidth={2.5} />
          <span>Added to Cart!</span>
        </>
      ) : (
        <>
          <ShoppingBag className="w-5 h-5" />
          <span>Add to Cart {selectedSize ? `• ${selectedSize}` : ''}</span>
        </>
      )}
    </Button>
  );
}
