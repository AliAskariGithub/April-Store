// app/dashboard/categories/page.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { INITIAL_CATEGORIES } from '@/lib/data/categories';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { getTotalStock } from '@/types/product';
import { useCurrencyStore } from '@/store/currencyStore';
import { FolderTree, Plus, ArrowRight, Package, Layers } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';

export default function AdminCategoriesPage() {
  const { allProducts } = useProducts();
  const { formatPrice, currency } = useCurrencyStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catImage, setCatImage] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;
    showToast.success('Category Configured', `${catName} added to dynamic taxonomy.`);
    setModalOpen(false);
    setCatName('');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <span className="text-xs font-extrabold text-[#FF5722] uppercase tracking-widest">
            Taxonomy & Catalog Sections
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            Category Management ({INITIAL_CATEGORIES.length})
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage store departments, hero imagery banners, and product distribution.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-[#FF5722] hover:bg-[#F4511E] text-white self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {INITIAL_CATEGORIES.map((cat) => {
          const prods = allProducts.filter((p) => p.category === cat.id);
          const liveCount = prods.length;
          const totalStock = prods.reduce((sum, p) => sum + getTotalStock(p.stock), 0);

          return (
            <div
              key={cat.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs flex flex-col group hover:border-[#FF5722]/50 transition-all"
            >
              <div className="relative aspect-[16/9] w-full bg-gray-100 overflow-hidden">
                <Image
                  src={cat.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=900&auto=format&fit=crop'}
                  alt={cat.label}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-lg font-extrabold tracking-tight">
                    {cat.label}
                  </h3>
                  <p className="text-[11px] text-gray-200 font-mono">slug: {cat.slug}</p>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Items</span>
                    <span className="text-base font-extrabold text-gray-900 mt-0.5 block">{liveCount} SKUs</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Units In Stock</span>
                    <span className="text-base font-extrabold text-gray-900 mt-0.5 block">{totalStock} Units</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    href={`/dashboard/products?category=${cat.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5722] hover:text-[#F4511E]"
                  >
                    <span>View Products</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/products?category=${cat.id}`}
                    className="text-xs font-bold text-gray-500 hover:text-[#FF5722]"
                  >
                    Storefront Link
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Store Category"
        maxWidth="md"
      >
        <form onSubmit={handleAddCategory} className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g. Smart Living"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            required
          />
          <Input
            label="Banner Image URL"
            placeholder="https://images.unsplash.com/..."
            value={catImage}
            onChange={(e) => setCatImage(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-3">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" className="bg-[#FF5722] hover:bg-[#F4511E] text-white">
              Create Category
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
