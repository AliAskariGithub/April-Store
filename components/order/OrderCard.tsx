// components/order/OrderCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Order } from '@/types/order';
import { formatDate } from '@/lib/utils/format';
import { useCurrencyStore } from '@/store/currencyStore';
import { OrderStatusBadge } from './OrderStatusBadge';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const { formatPrice } = useCurrencyStore();
  return (
    <div className="bg-[#FFFFFF] border border-[#121212] rounded-none p-5 sm:p-6 space-y-4 hover:border-[#121212] transition-all text-left">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#121212]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-spartan text-[15px] font-extrabold uppercase tracking-[0.06em] text-[#121212]">
              Order #{order.id}
            </span>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-[11px] text-[#8E8A83] font-spartan uppercase tracking-[0.04em] mt-0.5">
            Placed on {formatDate(order.createdAt)} • Tracking: <span className="font-mono text-[#121212] font-bold">{order.trackingNumber || 'PENDING'}</span>
          </p>
        </div>

        <Link href={`/orders/${order.id}`}>
          <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-[10px]">
            <span>View Dossier</span>
            <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </div>

      {/* Items Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 p-2 rounded-none bg-[#FAF8F5] border border-[#E8E3DA]">
            <div className="relative w-12 h-14 rounded-none overflow-hidden bg-[#FAF8F5] border border-[#121212] flex-shrink-0">
              <Image
                src={item.productImage}
                alt={item.productName}
                fill
                className="object-cover object-top"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0 flex-1 text-[12px] font-sans">
              <p className="font-bold text-[#121212] font-spartan uppercase tracking-[0.02em] truncate">{item.productName}</p>
              <p className="text-[10px] text-[#8E8A83] font-spartan uppercase">
                Size: {item.size} • Qty: {item.quantity}
              </p>
              <p className="font-bold font-spartan text-[#121212]">{formatPrice(item.totalPrice)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Total */}
      <div className="flex items-center justify-between pt-3 border-t border-[#121212] text-[13px] font-spartan uppercase tracking-[0.04em]">
        <span className="text-[#8E8A83] text-[11px]">
          Gateway: <span className="font-bold text-[#121212]">{order.paymentMethod}</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[#8E8A83] text-[11px]">Valuation:</span>
          <span className="text-[16px] font-extrabold text-[#121212]">
            {formatPrice(order.total)}
          </span>
        </div>
      </div>
    </div>
  );
}

