// types/user.ts
import { Address } from './order';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
  addresses: Address[];
  defaultAddressIndex: number;
  wishlist: string[]; // Array of product IDs
  role: 'customer' | 'admin';
  createdAt: string | { seconds: number; nanoseconds: number };
}
