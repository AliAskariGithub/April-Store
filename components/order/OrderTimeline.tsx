// components/order/OrderTimeline.tsx
'use client';

import React from 'react';
import { OrderEvent } from '@/types/order';
import { formatDateTime } from '@/lib/utils/format';
import { CheckCircle2, Clock, Truck, Package, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface OrderTimelineProps {
  timeline: OrderEvent[];
  className?: string;
}

export function OrderTimeline({ timeline, className }: OrderTimelineProps) {
  const getIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle2 className="w-4 h-4 text-[#1A7A4A]" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-[#024E44]" />;
      case 'processing':
        return <Package className="w-4 h-4 text-[#024E44]" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-[#C0392B]" />;
      default:
        return <Clock className="w-4 h-4 text-[#024E44]" />;
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <h4 className="font-heading text-[18px] font-bold text-[#0A0A0A]">
        Order Journey & Tracking Log
      </h4>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#D8D6CE]">
        {timeline.map((event, idx) => (
          <div key={idx} className="relative flex items-start gap-4 group">
            {/* Step icon node */}
            <div className="absolute -left-6 mt-0.5 w-6 h-6 rounded-full bg-[#FFFFFF] border-2 border-[#024E44] flex items-center justify-center shadow-xs">
              {getIcon(event.status)}
            </div>

            <div className="bg-[#F9F9F7] border border-[#D8D6CE] p-3.5 rounded-[10px] flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[13px] font-heading uppercase text-[#024E44]">
                  {event.status}
                </span>
                <span className="text-[11px] text-[#9E9C93] font-sans">
                  {formatDateTime(event.timestamp)}
                </span>
              </div>
              <p className="text-[13px] text-[#3D3D3A] font-sans mt-1">
                {event.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
