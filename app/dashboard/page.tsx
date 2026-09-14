// app/dashboard/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Sparkles, 
  AlertTriangle,
  ArrowRight,
  Plus,
  CheckCircle2,
  Clock,
  Truck,
  DollarSign,
  Layers,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import { useCurrencyStore } from '@/store/currencyStore';
import { formatDate } from '@/lib/utils/format';
import { OrderStatusBadge } from '@/components/order/OrderStatusBadge';
import { Button } from '@/components/ui/Button';
import { getTotalStock } from '@/types/product';
import { INITIAL_CATEGORIES } from '@/lib/data/categories';
import { showToast } from '@/components/ui/Toast';

export default function DashboardOverviewPage() {
  const { orders, changeStatus } = useOrders(undefined, true);
  const { allProducts, refreshProducts } = useProducts();
  const { formatPrice, currency } = useCurrencyStore();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const onlineReceiptsPending = orders.filter((o) => o.paymentMethod === 'online' && o.paymentStatus === 'under_review');
  const lowStockProducts = allProducts.filter((p) => getTotalStock(p.stock) <= 10);

  // Group products by category
  const categoryCounts = INITIAL_CATEGORIES.map((cat) => {
    const prods = allProducts.filter((p) => p.category === cat.id);
    const totalStock = prods.reduce((sum, p) => sum + getTotalStock(p.stock), 0);
    return {
      ...cat,
      count: prods.length,
      totalStock,
    };
  });

  const handleQuickStatus = async (orderId: string, status: any) => {
    try {
      await changeStatus(orderId, status, `Status changed to ${status} via Quick Action`);
      showToast.success('Order Updated', `Order #${orderId} set to ${status}.`);
    } catch (e) {
      showToast.error('Update Failed', 'Could not update order status.');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-[#FF5722] uppercase tracking-widest">
              Store Intelligence & Performance
            </span>
            <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Currency: {currency}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1 tracking-tight">
            Admin Dashboard Overview
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time analytics, inventory levels across all {allProducts.length} SKUs, and customer order processing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/products">
            <Button variant="primary" size="md" className="flex items-center gap-2 bg-[#FF5722] hover:bg-[#F4511E] text-white">
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5722] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
            {formatPrice(totalRevenue)}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% this month</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Orders</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
            {orders.length}
          </p>
          <p className="text-xs text-gray-500 mt-2 font-medium">
            <span className="text-[#FF5722] font-bold">{pendingOrders.length}</span> pending fulfillment
          </p>
        </div>

        {/* AI Receipts Under Review */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bank Receipts</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
            {onlineReceiptsPending.length}
          </p>
          <p className="text-xs text-purple-600 font-bold mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Gemini AI Vision Ready
          </p>
        </div>

        {/* Active Catalog SKUs */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Catalog SKUs</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
            {allProducts.length} Items
          </p>
          <p className="text-xs text-amber-600 font-bold mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            {lowStockProducts.length} low stock items
          </p>
        </div>
      </div>

      {/* Category Breakdown Overview */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">
              Inventory by Category ({allProducts.length} Live Products)
            </h2>
            <p className="text-xs text-gray-500">
              Full distribution across all active store departments.
            </p>
          </div>
          <Link href="/dashboard/categories">
            <Button variant="outline" size="sm" className="text-xs font-bold">
              Manage Categories
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categoryCounts.map((cat) => (
            <Link
              key={cat.id}
              href={`/dashboard/products?category=${cat.id}`}
              className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-orange-50/50 hover:border-[#FF5722]/30 transition-all group"
            >
              <p className="text-xs font-extrabold text-gray-900 group-hover:text-[#FF5722] truncate">
                {cat.label}
              </p>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-lg font-black text-gray-900">
                  {cat.count}
                </span>
                <span className="text-[10px] text-gray-500 font-medium">
                  {cat.totalStock} in stock
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders & Low Stock Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Section (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">
                Recent Customer Orders
              </h2>
              <p className="text-xs text-gray-500">
                Incoming transaction queue and instant dispatch status controls.
              </p>
            </div>
            <Link href="/dashboard/orders">
              <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs font-bold">
                <span>View All ({orders.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 px-4 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-[#FF5722] flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-gray-800">No Placed Orders Yet</p>
              <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                Only authentic customer orders placed via checkout appear here. Fake demo orders have been removed.
              </p>
              <Link href="/products" className="inline-block mt-4">
                <Button variant="outline" size="sm" className="text-xs">
                  Place a Test Order on Storefront
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 font-extrabold uppercase text-[11px] border-b border-gray-200">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Total ({currency})</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.slice(0, 5).map((ord) => (
                    <tr key={ord.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="p-3 font-mono font-bold text-gray-900">
                        <Link href="/dashboard/orders" className="hover:text-[#FF5722]">
                          #{ord.id}
                        </Link>
                        <div className="text-[10px] text-gray-400 font-sans">{formatDate(ord.createdAt)}</div>
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-gray-900">{ord.shippingAddress?.fullName || 'Guest Customer'}</p>
                        <p className="text-[11px] text-gray-500">{ord.shippingAddress?.city || 'Direct Order'}</p>
                      </td>
                      <td className="p-3 font-extrabold text-gray-900">
                        {formatPrice(ord.total)}
                      </td>
                      <td className="p-3">
                        <OrderStatusBadge status={ord.status} />
                      </td>
                      <td className="p-3 text-right space-x-1">
                        {ord.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => handleQuickStatus(ord.id, 'confirmed')}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-lg text-[10px] transition-colors cursor-pointer"
                          >
                            Confirm
                          </button>
                        )}
                        {ord.status === 'confirmed' && (
                          <button
                            type="button"
                            onClick={() => handleQuickStatus(ord.id, 'shipped')}
                            className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-lg text-[10px] transition-colors cursor-pointer"
                          >
                            Ship
                          </button>
                        )}
                        {ord.status === 'shipped' && (
                          <button
                            type="button"
                            onClick={() => handleQuickStatus(ord.id, 'delivered')}
                            className="px-2.5 py-1 bg-gray-900 text-white hover:bg-[#FF5722] font-bold rounded-lg text-[10px] transition-colors cursor-pointer"
                          >
                            Deliver
                          </button>
                        )}
                        <Link
                          href="/dashboard/orders"
                          className="px-2 py-1 text-gray-500 hover:text-gray-900 font-bold rounded text-[10px]"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Alerts (1 col) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Low Inventory Watch</span>
              </h2>
              <p className="text-[11px] text-gray-500">
                Products requiring replenishment
              </p>
            </div>
            <Link href="/dashboard/products">
              <span className="text-xs font-bold text-[#FF5722] hover:underline">
                View All
              </span>
            </Link>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[350px]">
            {lowStockProducts.slice(0, 5).map((prod) => {
              const count = getTotalStock(prod.stock);
              return (
                <div
                  key={prod.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={(prod.images && prod.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=900&auto=format&fit=crop'}
                      alt={prod.name || 'Product'}
                      className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {prod.name}
                      </p>
                      <p className="text-[11px] text-gray-500 capitalize">
                        {prod.category}
                      </p>
                    </div>
                  </div>

                  <div className="text-right pl-2">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                      {count} left
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-gray-100">
            <Link href="/dashboard/products">
              <Button variant="outline" size="sm" className="w-full text-xs font-bold">
                Open Stock Manager
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
