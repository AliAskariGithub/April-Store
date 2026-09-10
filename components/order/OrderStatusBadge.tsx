// components/order/OrderStatusBadge.tsx
import React from 'react';
import { OrderStatus } from '@/types/order';

export interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export function OrderStatusBadge({ status, size = 'sm' }: OrderStatusBadgeProps) {
  const configs: Record<OrderStatus, { label: string; className: string }> = {
    pending: { label: 'Audit Pending', className: 'bg-[#FAF8F5] text-[#121212] border border-[#121212]' },
    confirmed: { label: 'Settlement Confirmed', className: 'bg-[#121212] text-white border border-[#121212]' },
    processing: { label: 'Atelier Tailoring', className: 'bg-[#C5A880] text-black border border-[#121212]' },
    shipped: { label: 'In Transit', className: 'bg-[#121212] text-[#FAF8F5] border border-[#121212]' },
    delivered: { label: 'Delivered', className: 'bg-[#FAF8F5] text-[#121212] border border-[#121212]' },
    cancelled: { label: 'Voided', className: 'bg-[#E8E3DA] text-[#8E8A83] border border-[#121212]' },
  };

  const config = configs[status] || configs.pending;

  return (
    <span
      className={`inline-flex items-center font-bold uppercase tracking-[0.06em] rounded-none font-spartan whitespace-nowrap ${config.className} ${size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-[11px] px-3 py-1'}`}
    >
      {config.label}
    </span>
  );
}

