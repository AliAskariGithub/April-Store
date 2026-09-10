// types/order.ts
import { Size } from './product';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  size: Size | string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderEvent {
  status: OrderStatus;
  message: string;
  timestamp: string | { seconds: number; nanoseconds: number };
}

export interface Address {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'cod' | 'online';
  paymentStatus: 'pending' | 'under_review' | 'confirmed' | 'failed';
  receiptImageUrl?: string;
  receiptVerified?: boolean;
  receiptNote?: string;
  shippingAddress: Address;
  trackingNumber?: string;
  courierName?: string;
  timeline: OrderEvent[];
  createdAt: string | { seconds: number; nanoseconds: number };
  updatedAt: string | { seconds: number; nanoseconds: number };
}
