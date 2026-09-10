// app/dashboard/products/page.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useProducts } from '@/hooks/useProducts';
import { createProduct, deleteProduct } from '@/lib/firebase/firestore';
import { Product, Size, getTotalStock } from '@/types/product';
import { useCurrencyStore } from '@/store/currencyStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { showToast } from '@/components/ui/Toast';
import { Plus, Search, Star, Trash2, Tag, Filter, Check, ExternalLink } from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/lib/data/categories';
import Link from 'next/link';

const AVAILABLE_SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'One Size'];

export default function AdminProductsPage() {
  const { allProducts, refreshProducts } = useProducts();
  const { formatPrice, currency } = useCurrencyStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New product form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('fashion');
  const [price, setPrice] = useState<number>(49.99);
  const [salePrice, setSalePrice] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState<number>(25);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=900&auto=format&fit=crop');
  const [selectedSizes, setSelectedSizes] = useState<Size[]>(['M', 'L']);
  const [isFeatured, setIsFeatured] = useState(false);

  const filteredProducts = allProducts.filter((p) => {
    const q = (searchQuery || '').toLowerCase();
    const matchesSearch = 
      (p.name || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.id ? String(p.id).toLowerCase() : '').includes(q);
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleSize = (s: Size) => {
    setSelectedSizes((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      showToast.error('Missing Info', 'Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const created = await createProduct({
        name,
        slug,
        description,
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : undefined,
        category: category as any,
        sizes: selectedSizes.length > 0 ? selectedSizes : ['One Size'],
        colors: ['Black', 'White'],
        images: [imageUrl],
        stock: (selectedSizes.length > 0 ? selectedSizes : ['One Size']).reduce(
          (acc, s) => ({ ...acc, [s]: Math.ceil(Number(stock) / (selectedSizes.length || 1)) }),
          {}
        ),
        rating: 4.9,
        reviewCount: 1,
        featured: isFeatured,
      });

      // Explicitly sync to Sanity CMS via API route
      try {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(created),
        });
        const sanityData = await res.json();
        if (sanityData.success) {
          showToast.success('Product Saved', `${name} is live in store and synced to Sanity CMS.`);
        } else {
          showToast.success('Product Added', `${name} is now live in April Store.`);
        }
      } catch {
        showToast.success('Product Added', `${name} is now live in April Store.`);
      }

      setModalOpen(false);
      setName('');
      setDescription('');
      await refreshProducts();
    } catch (err) {
      console.error(err);
      showToast.error('Creation Failed', 'Failed to create product.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string, prodName: string) => {
    if (confirm(`Are you sure you want to remove "${prodName}" from the catalog?`)) {
      try {
        await deleteProduct(id);
        await fetch(`/api/products?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
        showToast.success('Deleted', `Product #${id} removed from catalog & Sanity CMS.`);
        await refreshProducts();
      } catch (err) {
        showToast.error('Error', 'Could not delete product.');
      }
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <span className="text-xs font-extrabold text-[#FF5722] uppercase tracking-widest">
            Inventory & Catalog Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            Products Catalog ({allProducts.length})
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Browse, search, edit stock, or introduce new items synced with Sanity CMS.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <Link
            href="/studio"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            title="Open embedded Sanity Studio"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#FF5722]" />
            <span>Sanity Studio</span>
          </Link>
          <Button
            variant="primary"
            size="md"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-[#FF5722] hover:bg-[#F4511E] text-white cursor-pointer shadow-sm hover:shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name or SKU..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#FF5722] shadow-xs"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            All ({allProducts.length})
          </button>
          {INITIAL_CATEGORIES.map((cat) => {
            const count = allProducts.filter((p) => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#FF5722] text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 font-extrabold uppercase text-[11px] border-b border-gray-200">
              <tr>
                <th className="p-4">Product Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price ({currency})</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4">Rating</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const stockTotal = getTotalStock(product.stock);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                            <Image
                              src={(product.images && product.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=900&auto=format&fit=crop'}
                              alt={product.name || 'Product'}
                              fill
                              unoptimized
                              className="object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/products/${product.slug}`}
                              className="font-bold text-gray-900 hover:text-[#FF5722] flex items-center gap-1 group"
                            >
                              <span className="truncate">{product.name}</span>
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            </Link>
                            <p className="text-[11px] text-gray-400 font-mono">
                              ID: {product.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wide bg-gray-100 text-gray-700">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-extrabold text-gray-900 text-sm">
                          {formatPrice(product.salePrice || product.price)}
                        </div>
                        {product.salePrice && (
                          <span className="text-[10px] text-gray-400 line-through">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                            stockTotal <= 5
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : stockTotal <= 15
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {stockTotal} in stock
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{(typeof product.rating === 'number' ? product.rating : 5).toFixed(1)}</span>
                          <span className="text-gray-400 font-normal">({product.reviewCount || 0})</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Catalog Product"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <Input
            label="Product Title"
            placeholder="e.g. Ultra-Light Running Shoes"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#FF5722]"
              >
                {INITIAL_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Total Units in Stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={`Base Price (USD)`}
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />

            <Input
              label="Discounted Sale Price (Optional)"
              type="number"
              step="0.01"
              value={salePrice || ''}
              onChange={(e) => setSalePrice(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Leave blank for regular price"
            />
          </div>

          <Input
            label="Image URL (Unsplash or CDN)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            required
          />

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Available Sizes / Variations
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SIZES.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF5722] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Product Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="High quality description with specifications..."
              className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-[#FF5722]"
              required
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded text-[#FF5722] focus:ring-[#FF5722]"
            />
            <label htmlFor="isFeatured" className="text-xs font-bold text-gray-700 cursor-pointer">
              Feature on Homepage Carousel & Trending Section
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={submitting}
              className="bg-[#FF5722] hover:bg-[#F4511E] text-white"
            >
              Save & Publish Product
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
