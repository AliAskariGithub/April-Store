// app/(shop)/orders/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { OrderCard } from '@/components/order/OrderCard';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, Search } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';

export default function OrdersPage() {
  const { user } = useAuth();
  const { orders, loading } = useOrders(user?.uid);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchItem = order.items.some((i) => i.productName.toLowerCase().includes(q));
      return matchId || matchItem;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#121212]">
        <div>
          <span className="text-[11px] font-bold text-[#8E8A83] uppercase tracking-[0.15em] font-spartan">
            Logistics & Consignments
          </span>
          <h1 className="font-spartan text-[28px] sm:text-[36px] font-extrabold uppercase tracking-[0.08em] text-[#121212] mt-1">
            Order Dossiers & Tracking
          </h1>
          <p className="text-[13px] text-[#8E8A83] font-sans mt-1">
            Real-time status, courier tracking credentials, and AI settlement audits.
          </p>
        </div>

        <Link href="/products">
          <Button variant="primary" size="md" className="bg-[#FF5722] hover:bg-[#F4511E] text-white rounded-xl">
            Acquire New Pieces
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#8E8A83] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID (e.g. ord-101) or garment name..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#FFFFFF] border border-[#121212] rounded-none text-[13px] font-sans focus:outline-none focus:ring-1 focus:ring-[#121212]"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar py-1">
          {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`text-[10px] px-3 py-1.5 rounded-none font-spartan font-bold uppercase tracking-[0.05em] whitespace-nowrap transition-colors cursor-pointer border border-[#121212] ${
                statusFilter === status
                  ? 'bg-[#121212] text-white'
                  : 'bg-[#FAF8F5] text-[#121212] hover:bg-[#FFFFFF]'
              }`}
            >
              {status === 'all' ? 'All Dossiers' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Feed */}
      {loading ? (
        <div className="py-20 text-center">
          <Spinner size="lg" color="primary" />
          <p className="text-[13px] font-spartan font-bold uppercase tracking-[0.06em] text-[#8E8A83] mt-3">Accessing archival order records...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-20 text-center rounded-none bg-[#FAF8F5] border border-[#121212] p-8 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-none bg-[#FFFFFF] border border-[#121212] text-[#8E8A83] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8 text-[#121212]" strokeWidth={1.2} />
          </div>
          <div>
            <h3 className="font-spartan text-[18px] font-extrabold uppercase tracking-[0.06em] text-[#121212]">
              No Orders Located
            </h3>
            <p className="text-[13px] text-[#8E8A83] font-sans mt-1">
              {searchQuery || statusFilter !== 'all'
                ? 'No dossiers correspond to the specified filter parameters.'
                : 'You have not placed any orders yet.'}
            </p>
          </div>
          <Link href="/products">
            <Button variant="primary" size="md" className="bg-[#FF5722] hover:bg-[#F4511E] text-white rounded-xl">
              Explore Archive
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

