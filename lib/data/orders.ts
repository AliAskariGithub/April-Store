// lib/data/orders.ts
import { Order } from '@/types/order';

// Only real placed orders from checkout are tracked. No fake or mock orders.
export const INITIAL_ORDERS: Order[] = [];

