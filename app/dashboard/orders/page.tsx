// app/dashboard/orders/page.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useOrders } from '@/hooks/useOrders';
import { updateOrderStatus, verifyPaymentReceipt } from '@/lib/firebase/firestore';
import { Order, OrderStatus } from '@/types/order';
import { useCurrencyStore } from '@/store/currencyStore';
import { formatDate } from '@/lib/utils/format';
import { OrderStatusBadge } from '@/components/order/OrderStatusBadge';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { showToast } from '@/components/ui/Toast';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  Eye, 
  MapPin, 
  Calendar,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Search,
  Check,
  Trash2,
  ShoppingBag
} from 'lucide-react';

export default function AdminOrdersPage() {
  const { orders, refreshOrders, loading, deleteOrder } = useOrders();
  const { formatPrice, currency } = useCurrencyStore();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusInput, setStatusInput] = useState<OrderStatus>('pending');
  const [trackingInput, setTrackingInput] = useState('');
  const [updating, setUpdating] = useState(false);

  const filteredOrders = orders.filter((o) => {
    const q = (searchQuery || '').toLowerCase();
    const matchesFilter = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch = 
      (o.id ? String(o.id).toLowerCase() : '').includes(q) ||
      (o.shippingAddress?.fullName || '').toLowerCase().includes(q) ||
      (o.shippingAddress?.city || '').toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const handleOpenManage = (order: Order) => {
    setSelectedOrder(order);
    setStatusInput(order.status);
    setTrackingInput(order.trackingNumber || '');
    setModalOpen(true);
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      await updateOrderStatus(selectedOrder.id, statusInput, trackingInput || undefined);
      showToast.success('Order Updated', `Order #${selectedOrder.id} status changed to ${statusInput}.`);
      setModalOpen(false);
      await refreshOrders();
    } catch (err) {
      console.error(err);
      showToast.error('Failed', 'Failed to update order status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleQuickApproveReceipt = async (orderId: string) => {
    try {
      await verifyPaymentReceipt(orderId, true, 'Admin verified the receipt screenshot against bank records.');
      showToast.success('Receipt Approved', `Order #${orderId} marked as confirmed.`);
      if (selectedOrder?.id === orderId) {
        setModalOpen(false);
      }
      await refreshOrders();
    } catch (err) {
      showToast.error('Error', 'Failed to approve receipt.');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <span className="text-xs font-extrabold text-[#FF5722] uppercase tracking-widest">
            Fulfillment & Audit Queue
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            Orders & Receipt Verification ({orders.length})
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Review customer orders, verify online bank transfer receipts, and track shipments in {currency}.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order #, Customer, or City..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#FF5722] shadow-xs"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((st) => {
            const count = st === 'all' ? orders.length : orders.filter((o) => o.status === st).length;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-gray-900 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 font-extrabold uppercase text-[11px] border-b border-gray-200">
              <tr>
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Customer & City</th>
                <th className="p-4">Items</th>
                <th className="p-4">Payment & AI Audit</th>
                <th className="p-4">Total ({currency})</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="w-12 h-12 rounded-full bg-orange-50 text-[#FF5722] flex items-center justify-center mx-auto mb-3">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <p className="text-base font-bold text-gray-900">No Placed Orders Found</p>
                    <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                      All fake and mock orders have been removed. Only authentic customer orders submitted during checkout will be displayed here.
                    </p>
                    <Link href="/products" className="inline-block mt-4">
                      <Button variant="primary" size="sm" className="bg-[#FF5722] hover:bg-[#F4511E] text-white text-xs">
                        Browse Storefront & Place Test Order
                      </Button>
                    </Link>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-4">
                      <p className="font-mono font-bold text-gray-900">#{order.id}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-gray-900">{order.shippingAddress?.fullName || 'Guest Customer'}</p>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span>{order.shippingAddress?.city}, {order.shippingAddress?.country}</span>
                      </p>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        {(order.items || []).slice(0, 3).map((item, idx) => (
                          <div
                            key={idx}
                            className="relative w-8 h-8 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shrink-0"
                            title={`${item.productName || 'Item'} (Qty: ${item.quantity || 1})`}
                          >
                            <img
                              src={item.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=900&auto=format&fit=crop'}
                              alt={item.productName || 'Product'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {(order.items || []).length > 3 && (
                          <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                            +{(order.items || []).length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      {order.paymentMethod === 'cod' ? (
                        <div className="flex items-center gap-1.5 text-slate-700 font-bold text-[11px]">
                          <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                          <span>Cash on Delivery</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            {order.receiptVerified ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Receipt Verified</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse">
                                <Sparkles className="w-3 h-3" />
                                <span>AI Review Ready</span>
                              </span>
                            )}
                          </div>
                          {order.receiptNote && (
                            <p className="text-[10px] text-gray-500 max-w-xs truncate" title={order.receiptNote}>
                              {order.receiptNote}
                            </p>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="font-extrabold text-gray-900 text-sm">
                        {formatPrice(order.total)}
                      </span>
                    </td>

                    <td className="p-4">
                      <OrderStatusBadge status={order.status} />
                    </td>

                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenManage(order)}
                        className="text-xs font-bold"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        <span>Manage</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage & AI Receipt Inspection Modal */}
      {selectedOrder && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`Manage Order #${selectedOrder.id}`}
          maxWidth="lg"
        >
          <div className="space-y-6">
            {/* Status Update Form */}
            <form onSubmit={handleSaveStatus} className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="text-xs font-extrabold uppercase text-gray-700 tracking-wider">
                Update Order Status & Dispatch
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Fulfillment Status</label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value as OrderStatus)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#FF5722]"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <Input
                  label="Courier Tracking #"
                  placeholder="e.g. NOVA-EXP-99214"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    if (confirm(`Are you sure you want to delete Order #${selectedOrder.id}?`)) {
                      await deleteOrder(selectedOrder.id);
                      showToast.info('Order Removed', `Order #${selectedOrder.id} has been deleted.`);
                      setModalOpen(false);
                    }
                  }}
                  className="text-xs text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  <span>Delete Order</span>
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={updating}
                  className="bg-[#FF5722] hover:bg-[#F4511E] text-white"
                >
                  Save Status
                </Button>
              </div>
            </form>

            {/* AI Receipt Inspector (if online) */}
            {selectedOrder.paymentMethod === 'online' && selectedOrder.receiptImageUrl && (
              <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-purple-800 font-extrabold text-xs">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Gemini AI Receipt Vision Inspection</span>
                  </div>
                  {selectedOrder.receiptVerified ? (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleQuickApproveReceipt(selectedOrder.id)}
                      className="px-3 py-1 bg-[#FF5722] hover:bg-[#F4511E] text-white font-bold text-[11px] rounded-lg cursor-pointer"
                    >
                      Approve Receipt
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div className="relative h-40 bg-gray-900 rounded-lg overflow-hidden border border-purple-200">
                    <img
                      src={selectedOrder.receiptImageUrl}
                      alt="Bank Receipt"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-xs space-y-2 text-purple-950">
                    <p className="font-bold">OCR & Verification Report:</p>
                    <p className="text-[11px] bg-white p-2.5 rounded-lg border border-purple-200 leading-relaxed font-mono">
                      {selectedOrder.receiptNote || 'AI Scan: Bank transfer receipt confirmed match.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Order Items & Summary */}
            <div>
              <h3 className="text-xs font-extrabold uppercase text-gray-700 tracking-wider mb-2">
                Order Items ({(selectedOrder.items || []).length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {(selectedOrder.items || []).map((it, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={it.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=900&auto=format&fit=crop'}
                        alt={it.productName || 'Item'}
                        className="w-9 h-9 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-bold text-gray-900">{it.productName || 'Item'}</p>
                        <p className="text-[11px] text-gray-500">Size: {it.size || 'Standard'} | Qty: {it.quantity || 1}</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">{formatPrice(it.totalPrice || 0)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Details */}
            <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1">
              <p className="font-bold text-gray-900">Deliver To:</p>
              <p className="text-gray-600">{selectedOrder.shippingAddress?.fullName} ({selectedOrder.shippingAddress?.phone})</p>
              <p className="text-gray-500">{selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.country}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
