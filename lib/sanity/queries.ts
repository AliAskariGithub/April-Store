import { groq } from 'next-sanity';
import { sanityClient } from './client';
import { urlForImage } from './image';
import { Product } from '@/types/product';

export const ALL_PRODUCTS_QUERY = groq`
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    description,
    price,
    salePrice,
    category,
    subcategory,
    images,
    imageUrls,
    sizes,
    colors,
    stockQuantity,
    featured,
    rating,
    reviewCount,
    fabric,
    care,
    tags,
    _createdAt,
    _updatedAt
  }
`;

export async function getSanityProducts(): Promise<Product[]> {
  if (!sanityClient) return [];
  try {
    const raw = await sanityClient.fetch(ALL_PRODUCTS_QUERY);
    if (!raw || !Array.isArray(raw)) return [];

    return raw.map((item: any) => {
      const processedImages: string[] = [];
      if (item.images && Array.isArray(item.images)) {
        for (const img of item.images) {
          const url = urlForImage(img);
          if (url) processedImages.push(url);
        }
      }
      if (item.imageUrls && Array.isArray(item.imageUrls)) {
        processedImages.push(...item.imageUrls);
      }
      if (processedImages.length === 0) {
        processedImages.push('https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=900&auto=format&fit=crop');
      }

      const sizes = item.sizes && item.sizes.length > 0 ? item.sizes : ['One Size'];
      const stock = sizes.reduce(
        (acc: Record<string, number>, s: string) => ({
          ...acc,
          [s]: Math.ceil((item.stockQuantity || 20) / sizes.length),
        }),
        {}
      );

      return {
        id: item._id,
        name: item.name,
        slug: item.slug || item._id,
        description: item.description || '',
        price: item.price || 0,
        salePrice: item.salePrice,
        category: item.category || 'fashion',
        subcategory: item.subcategory,
        images: processedImages,
        sizes,
        colors: item.colors && item.colors.length > 0 ? item.colors : ['Black'],
        stock,
        rating: item.rating || 5.0,
        reviewCount: item.reviewCount || 0,
        featured: item.featured || false,
        fabric: item.fabric,
        care: item.care,
        tags: item.tags || [],
        createdAt: item._createdAt,
        updatedAt: item._updatedAt,
      } as Product;
    });
  } catch (err) {
    console.warn('Failed to fetch products from Sanity:', err);
    return [];
  }
}
