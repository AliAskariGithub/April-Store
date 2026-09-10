// components/cart/CartItem.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types/cart';
import { useCurrencyStore } from '@/store/currencyStore';
import { useCartStore } from '@/store/cartStore';

export interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQty, removeItem } = useCartStore();
  const { formatPrice } = useCurrencyStore();

  return (
    <div className="flex gap-4 py-4 border-b border-[#E8E3DA] last:border-b-0 animate-slide-up">
      {/* Product Thumbnail */}
      <div className="relative w-20 h-24 rounded-none overflow-hidden bg-[#F3EFE8] border border-[#121212] flex-shrink-0">
        <Image
          src={item.productImage}
          alt={item.productName}
          fill
          className="object-cover object-top"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Item info */}
      <div className="flex-1 flex flex-col justify-between min-w-0 text-left">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-spartan text-[13px] font-bold uppercase tracking-[0.04em] text-[#121212] line-clamp-1">
              {item.productName}
            </h4>
            <button
              type="button"
              onClick={() => removeItem(item.productId, item.size)}
              className="text-[#8E8A83] hover:text-[#B33927] p-1 transition-colors cursor-pointer rounded-none"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
          <p className="text-[11px] text-[#8E8A83] font-sans mt-0.5">
            Size: <span className="font-bold text-[#121212] font-spartan uppercase">{item.size}</span>
          </p>
        </div>

        {/* Quantity and Price */}
        <div className="flex items-center justify-between mt-2">
          {/* Stepper */}
          <div className="flex items-center border border-[#121212] rounded-none bg-[#FFFFFF] overflow-hidden">
            <button
              type="button"
              onClick={() => updateQty(item.productId, item.size, item.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center text-[#121212] hover:bg-[#F3EFE8] transition-colors cursor-pointer rounded-none"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-[12px] font-bold text-[#121212] font-spartan">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQty(item.productId, item.size, item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center text-[#121212] hover:bg-[#F3EFE8] transition-colors cursor-pointer rounded-none"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <span className="text-[14px] font-bold text-[#121212] font-spartan">
            {formatPrice(item.unitPrice * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}

