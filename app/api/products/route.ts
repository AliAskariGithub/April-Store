// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { saveProductToSanity, deleteProductFromSanity } from '@/lib/sanity/writer';
import { Product } from '@/types/product';

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
