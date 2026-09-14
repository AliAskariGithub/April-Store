// app/sitemap.ts
import { MetadataRoute } from 'next';
import { INITIAL_PRODUCTS } from '@/lib/data/products';
import { INITIAL_CATEGORIES } from '@/lib/data/categories';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://aprilstore-one.vercel.app';
  const now = new Date();

  // 1. Static Core Landing Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/account`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/orders`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  // 2. Category Landing Pages
  const categoryRoutes: MetadataRoute.Sitemap = INITIAL_CATEGORIES.map((cat) => ({
    url: `${baseUrl}/products?category=${encodeURIComponent(cat.slug)}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.9,
  }));

function toDate(val: unknown, fallback: Date): Date {
  if (!val) return fallback;
  if (typeof val === 'string' || typeof val === 'number') {
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d;
  }
  if (typeof val === 'object' && val !== null && 'seconds' in val) {
    return new Date((val as { seconds: number }).seconds * 1000);
  }
  return fallback;
}

  // 3. Product Detail Pages (all 72+ luxury products)
  const productRoutes: MetadataRoute.Sitemap = INITIAL_PRODUCTS.map((prod) => {
    const date = toDate(prod.updatedAt, toDate(prod.createdAt, now));

    return {
      url: `${baseUrl}/products/${encodeURIComponent(prod.slug)}`,
      lastModified: date,
      changeFrequency: 'weekly',
      priority: 0.8,
    };
  });

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
