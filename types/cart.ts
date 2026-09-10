// types/cart.ts
import { Size } from './product';

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  size: Size | string;
  quantity: number;
  unitPrice: number;
}
