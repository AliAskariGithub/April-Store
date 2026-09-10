// lib/sanity/writer.ts
import { createClient } from 'next-sanity';
import { Product } from '@/types/product';
import { projectId, dataset, apiVersion } from './client';

export async function saveProductToSanity(product: Product): Promise<{ success: boolean; id?: string; error?: string }> {
  const token = process.env.SANITY_API_TOKEN;
  if (!token || !projectId) {
    return { success: false, error: 'Sanity credentials or API token missing' };
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      token,
      useCdn: false,
    });

    const slugCurrent = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const stockTotal = typeof product.stock === 'object' && product.stock !== null
      ? Object.values(product.stock).reduce((sum: number, n: any) => sum + (typeof n === 'number' ? n : 0), 0)
      : 25;

    const doc = {
      _type: 'product',
      _id: product.id.startsWith('prod-') ? product.id : `prod-${product.id}`,
      name: product.name,
      slug: {
        _type: 'slug',
        current: slugCurrent,
      },
      description: product.description || '',
      price: Number(product.price) || 0,
      ...(product.salePrice ? { salePrice: Number(product.salePrice) } : {}),
      category: product.category || 'fashion',
      ...(product.subcategory ? { subcategory: product.subcategory } : {}),
      imageUrls: product.images && product.images.length > 0 ? product.images : [],
      sizes: product.sizes && product.sizes.length > 0 ? product.sizes : ['One Size'],
      colors: product.colors && product.colors.length > 0 ? product.colors : ['Black'],
      stockQuantity: stockTotal || 25,
      featured: Boolean(product.featured),
      rating: product.rating || 5.0,
      reviewCount: product.reviewCount || 0,
      tags: product.tags || ['fashion'],
    };

    const res = await client.createOrReplace(doc);
    return { success: true, id: res._id };
  } catch (error: any) {
    console.error('Failed to save product to Sanity CMS:', error);
    return { success: false, error: error?.message || 'Sanity mutation failed' };
  }
}

export async function deleteProductFromSanity(productId: string): Promise<{ success: boolean; error?: string }> {
  const token = process.env.SANITY_API_TOKEN;
  if (!token || !projectId) {
    return { success: false, error: 'Sanity credentials or API token missing' };
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      token,
      useCdn: false,
    });

    const docId = productId.startsWith('prod-') ? productId : `prod-${productId}`;
    await client.delete(docId);
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete product from Sanity CMS:', error);
    return { success: false, error: error?.message || 'Sanity deletion failed' };
  }
}
