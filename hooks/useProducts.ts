// hooks/useProducts.ts
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Product } from '@/types/product';
import { getProducts } from '@/lib/firebase/firestore';
import { INITIAL_PRODUCTS } from '@/lib/data/products';

export type SortOption =
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'price-low-high'
  | 'price-high-low'
  | 'popular'
  | 'rating';

export interface FilterOptions {
  category?: string;
  sizes?: string[];
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  rating?: number;
  sort?: SortOption;
  search?: string;
}

export function useProducts(initialFilters?: FilterOptions) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>(initialFilters || {});

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      if (data && data.length > 0) {
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    getProducts()
      .then((data) => {
        if (!ignore && data && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(console.error)
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (filters.category && filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }

      // Size filter
      if (filters.sizes && filters.sizes.length > 0) {
        const hasSize = filters.sizes.some((s) => product.sizes.includes(s as any));
        if (!hasSize) return false;
      }

      // Price filter
      const activePrice = product.salePrice || product.price;
      if (filters.minPrice !== undefined && activePrice < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== undefined && activePrice > filters.maxPrice) {
        return false;
      }

      // Rating filter
      if (filters.rating !== undefined && product.rating < filters.rating) {
        return false;
      }

      // Search keyword filter
      if (filters.search && filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesTags = product.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesTags) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice !== undefined && a.salePrice !== null ? a.salePrice : a.price;
      const priceB = b.salePrice !== undefined && b.salePrice !== null ? b.salePrice : b.price;

      if (filters.sort === 'price-asc' || filters.sort === 'price-low-high') {
        return priceA - priceB;
      }
      if (filters.sort === 'price-desc' || filters.sort === 'price-high-low') {
        return priceB - priceA;
      }
      if (filters.sort === 'popular') {
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      }
      if (filters.sort === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }

      // Default: 'newest'
      const parseTimestamp = (val: any): number => {
        if (!val) return 0;
        if (typeof val === 'number') return val;
        if (typeof val === 'string') {
          const t = new Date(val).getTime();
          return isNaN(t) ? 0 : t;
        }
        if (typeof val === 'object' && 'seconds' in val) {
          return val.seconds * 1000 + (val.nanoseconds ? val.nanoseconds / 1000000 : 0);
        }
        return 0;
      };

      const timeA = parseTimestamp(a.createdAt);
      const timeB = parseTimestamp(b.createdAt);
      if (timeB !== timeA) {
        return timeB - timeA;
      }
      return a.name.localeCompare(b.name);
    });
  }, [products, filters]);

  return {
    products: filteredProducts,
    allProducts: products,
    loading,
    filters,
    setFilters,
    refetch: fetchProducts,
    refreshProducts: fetchProducts,
  };
}
