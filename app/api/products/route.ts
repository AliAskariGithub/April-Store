// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { saveProductToSanity, deleteProductFromSanity } from '@/lib/sanity/writer';
import { ALL_PRODUCTS_QUERY } from '@/lib/sanity/queries';
import { projectId, dataset, apiVersion } from '@/lib/sanity/client';
import { urlForImage } from '@/lib/sanity/image';
import { Product } from '@/types/product';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    let sanityProducts: Product[] = [];
    if (projectId && projectId !== 'demo-project-id') {
      try {
        const token = process.env.SANITY_API_TOKEN;
        const client = createClient({
          projectId,
          dataset,
          apiVersion,
          token: token || undefined,
          useCdn: false,
        });

        const raw = await client.fetch(ALL_PRODUCTS_QUERY);
        if (raw && Array.isArray(raw)) {
          sanityProducts = raw.map((item: any) => {
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
        }
      } catch (err) {
        console.warn('Sanity server-side query error:', err);
      }
    }

    return NextResponse.json({ success: true, products: sanityProducts });
  } catch (error: any) {
    console.error('API /api/products GET error:', error);
    return NextResponse.json({ error: error?.message || 'Server error', products: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.name) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    const result = await saveProductToSanity(body as Product);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to save to Sanity' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: result.id }, { status: 201 });
  } catch (error: any) {
    console.error('API /api/products POST error:', error);
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const result = await deleteProductFromSanity(id);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to delete from Sanity' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API /api/products DELETE error:', error);
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
