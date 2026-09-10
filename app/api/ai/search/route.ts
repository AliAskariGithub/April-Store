// app/api/ai/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { performSmartSearch } from '@/lib/gemini/search';
import { getProducts } from '@/lib/firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const catalog = await getProducts();
    const result = await performSmartSearch(query, catalog);

    // Map matched IDs back to full product objects
    const matchedProducts = result.productIds
      .map((id) => catalog.find((p) => p.id === id))
      .filter(Boolean);

    return NextResponse.json({
      products: matchedProducts,
      intent: result.intent,
      query,
      matchedCount: matchedProducts.length,
    });
  } catch (error) {
    console.error('Smart search API error:', error);
    return NextResponse.json({ error: 'Failed to process AI search' }, { status: 500 });
  }
}
