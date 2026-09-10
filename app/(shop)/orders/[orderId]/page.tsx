// app/(shop)/orders/[orderId]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getOrderById } from '@/lib/firebase/firestore';
import { Order } from '@/types/order';
import { formatDate } from '@/lib/utils/format';
import { useCurrencyStore } from '@/store/currencyStore';
import { OrderStatusBadge } from '@/components/order/OrderStatusBadge';
import { OrderTimeline } from '@/components/order/OrderTimeline';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { 
  ArrowLeft, 
  Truck, 
  MapPin, 
  Landmark, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { showToast } from '@/components/ui/Toast';

export default function OrderDetailPage() {
  const { formatPrice } = useCurrencyStore();
  const params = useParams();
  const orderId = params?.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedTracking, setCopiedTracking] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return;
      setLoading(true);
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  const handleCopyTracking = () => {
    if (order?.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopiedTracking(true);
      showToast.success('Tracking Number Copied', order.trackingNumber);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <Spinner size="lg" color="primary" />
        <p className="text-[14px] text-[#9E9C93] font-sans mt-3">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-heading text-[28px] font-bold text-[#0A0A0A]">
          Order Not Found
        </h2>
        <p className="text-[14px] text-[#9E9C93] font-sans">
          We could not locate order &ldquo;{orderId}&rdquo;.
        </p>
        <Link href="/orders">
          <Button variant="primary" size="md">
            View All Orders
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0EFEA]">
        <div>
          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 text-[13px] text-[#9E9C93] hover:text-[#024E44] font-sans mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Orders</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-[28px] sm:text-[34px] font-bold text-[#0A0A0A]">
              Order #{order.id}
            </h1>
            <OrderStatusBadge status={order.status} size="md" />
          </div>
          <p className="text-[13px] text-[#9E9C93] font-sans mt-0.5">
            Placed on {formatDate(order.createdAt)} • Payment: <span className="uppercase font-semibold text-[#0A0A0A]">{order.paymentMethod}</span>
          </p>
        </div>

        {/* Tracking Number Pill */}
        {order.trackingNumber && (
          <div className="flex items-center gap-2 bg-[#F9F9F7] border border-[#D8D6CE] p-2.5 rounded-[10px]">
            <Truck className="w-4 h-4 text-[#024E44]" />
            <div className="text-[12px] font-sans">
              <span className="text-[#9E9C93] block leading-none">Courier Consignment:</span>
              <span className="font-mono font-bold text-[#0A0A0A]">{order.trackingNumber}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyTracking}
              className="ml-2 p-1 text-[#9E9C93] hover:text-[#024E44] transition-colors cursor-pointer"
              title="Copy tracking"
            >
              {copiedTracking ? <Check className="w-3.5 h-3.5 text-[#1A7A4A]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Timeline & Items */}
        <div className="lg:col-span-7 space-y-8">
          {/* Order Timeline */}
          <div className="bg-[#FFFFFF] border border-[#D8D6CE] rounded-[16px] p-6 sm:p-8">
            <OrderTimeline timeline={order.timeline} />
          </div>

          {/* Purchased Items */}
          <div className="bg-[#FFFFFF] border border-[#D8D6CE] rounded-[16px] p-6 space-y-4">
            <h3 className="font-heading text-[18px] font-bold text-[#0A0A0A] pb-3 border-b border-[#F0EFEA]">
              Items in this Consignment ({order.items.length})
            </h3>

            <div className="space-y-4 divide-y divide-[#F0EFEA]">
              {order.items.map((item, idx) => (
                <div key={idx} className="pt-4 first:pt-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-20 rounded-[8px] overflow-hidden bg-[#F0EFEA] border border-[#D8D6CE] flex-shrink-0">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover object-top"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="text-[14px] font-sans">
                      <p className="font-bold font-heading text-[#0A0A0A]">{item.productName}</p>
                      <p className="text-[12px] text-[#9E9C93] mt-0.5">
                        Size: <span className="font-semibold text-[#0A0A0A]">{item.size}</span> • Quantity: {item.quantity}
                      </p>
                      <p className="text-[13px] text-[#9E9C93] mt-0.5">
                        Unit Price: {formatPrice(item.unitPrice)}
                      </p>
                    </div>
                  </div>

                  <span className="font-heading text-[16px] font-bold text-[#024E44]">
                    {formatPrice(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Address, Payment & AI Receipt Verification */}
        <div className="lg:col-span-5 space-y-6">
          {/* Summary */}
          <div className="bg-[#F9F9F7] border border-[#D8D6CE] rounded-[16px] p-6 space-y-4">
            <h3 className="font-heading text-[18px] font-bold text-[#0A0A0A] pb-2 border-b border-[#D8D6CE]">
              Financial Breakdown
            </h3>

            <div className="space-y-2 text-[14px] font-sans">
              <div className="flex justify-between text-[#3D3D3A]">
                <span>Items Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#3D3D3A]">
                <span>Express Shipping</span>
                <span>{order.shippingFee === 0 ? 'Complimentary' : formatPrice(order.shippingFee)}</span>
              </div>
              <div className="pt-2 border-t border-[#D8D6CE] flex justify-between font-bold text-[18px] text-[#0A0A0A]">
                <span>Total Paid / Due</span>
                <span className="font-heading text-[#024E44] text-[20px]">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-[#FFFFFF] border border-[#D8D6CE] rounded-[16px] p-6 space-y-3">
            <div className="flex items-center gap-2 text-[#024E44] font-bold font-heading text-[16px]">
              <MapPin className="w-4 h-4" />
              <span>Delivery Address</span>
            </div>
            <div className="text-[13px] font-sans text-[#3D3D3A] space-y-0.5">
              <p className="font-bold text-[#0A0A0A]">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
              <p className="pt-1 text-[#9E9C93]">Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* AI Payment Receipt Verification Card (if online transfer) */}
          {order.paymentMethod === 'online' && (
            <div className="bg-[#FFFFFF] border border-[#D8D6CE] rounded-[16px] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#024E44] font-bold font-heading text-[16px]">
                  <Landmark className="w-4 h-4" />
                  <span>Bank Receipt & AI Audit</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#CCEB6C] text-[#024E44] px-2 py-0.5 rounded-full font-sans">
                  <Sparkles className="w-3 h-3" />
                  Gemini Vision
                </span>
              </div>

              {order.receiptImageUrl ? (
                <div className="space-y-3">
                  <div className="relative aspect-[16/9] w-full rounded-[10px] overflow-hidden border border-[#D8D6CE] bg-[#F0EFEA]">
                    <Image
                      src={order.receiptImageUrl}
                      alt="Payment Receipt Screenshot"
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="p-3 bg-[#F9F9F7] rounded-[8px] border border-[#D8D6CE] space-y-1.5 text-[12px] font-sans">
                    <div className="flex items-center gap-1.5 font-bold text-[#024E44]">
                      {order.receiptVerified ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-[#1A7A4A]" />
                          <span>AI Automated Verification: Match Confirmed</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-[#C0392B]" />
                          <span>Pending Secondary Audit</span>
                        </>
                      )}
                    </div>
                    {order.receiptNote && (
                      <p className="text-[#3D3D3A] italic">&ldquo;{order.receiptNote}&rdquo;</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-[13px] text-[#9E9C93] font-sans">No receipt uploaded.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
