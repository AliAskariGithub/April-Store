// hooks/useOrders.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '@/types/order';
import { getOrders, updateOrderStatus, updateOrderReceiptVerification, deleteOrder as deleteOrderDb } from '@/lib/firebase/firestore';

export function useOrders(userId?: string, forAdmin: boolean = false) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getOrders(userId, forAdmin);
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, forAdmin]);

  useEffect(() => {
    let ignore = false;
    getOrders(userId, forAdmin)
      .then((data) => {
        if (!ignore) {
          setOrders(data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [userId, forAdmin]);

  const changeStatus = async (orderId: string, status: OrderStatus, note?: string) => {
    await updateOrderStatus(orderId, status, note);
    await fetchOrders();
  };

  const reviewReceipt = async (orderId: string, verified: boolean, note: string) => {
    await updateOrderReceiptVerification(orderId, verified, note);
    await fetchOrders();
  };

  const deleteOrder = async (orderId: string) => {
    await deleteOrderDb(orderId);
    await fetchOrders();
  };

  return {
    orders,
    loading,
    refetch: fetchOrders,
    refreshOrders: fetchOrders,
    changeStatus,
    reviewReceipt,
    deleteOrder,
  };
}
