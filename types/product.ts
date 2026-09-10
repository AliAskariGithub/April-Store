// types/product.ts

export type Size = string;

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number; // in PKR (integer)
  salePrice?: number;
  category: string;
  subcategory?: string;
  images: string[];
  sizes: Size[];
  colors?: string[];
  stock: Record<string, number>; // e.g. { "S": 10, "M": 5 }
  rating: number;
  reviewCount: number;
  tags: string[];
  featured: boolean;
  fabric?: string;
  care?: string;
  createdAt: string | { seconds: number; nanoseconds: number };
  updatedAt: string | { seconds: number; nanoseconds: number };
}

export function getTotalStock(stock: Record<string, number> | number | undefined): number {
  if (!stock) return 0;
  if (typeof stock === 'number') return stock;
  return Object.values(stock).reduce((sum, val) => sum + (Number(val) || 0), 0);
}

export interface Category {
  id: string;
  slug: string;
  label: string;
  image: string;
  order: number;
  parent: string | null;
  itemCount?: number;
}
