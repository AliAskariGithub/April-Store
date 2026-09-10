// lib/data/categories.ts
import { Category } from '@/types/product';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'fashion',
    slug: 'fashion',
    label: 'Fashion',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
    order: 1,
    parent: null,
    itemCount: 12,
  },
  {
    id: 'electronics',
    slug: 'electronics',
    label: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
    order: 2,
    parent: null,
    itemCount: 12,
  },
  {
    id: 'beauty',
    slug: 'beauty',
    label: 'Beauty',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop',
    order: 3,
    parent: null,
    itemCount: 12,
  },
  {
    id: 'fitness',
    slug: 'fitness',
    label: 'Fitness',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop',
    order: 4,
    parent: null,
    itemCount: 12,
  },
  {
    id: 'home-decor',
    slug: 'home-decor',
    label: 'Home Decor',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600&auto=format&fit=crop',
    order: 5,
    parent: null,
    itemCount: 12,
  },
  {
    id: 'accessories',
    slug: 'accessories',
    label: 'Accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
    order: 6,
    parent: null,
    itemCount: 12,
  },
];
