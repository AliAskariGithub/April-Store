import { defineField, defineType } from 'sanity';

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Base Price (USD)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'salePrice',
      title: 'Sale Price (Optional)',
      type: 'number',
      description: 'Discounted price if on sale',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Fashion & Apparel', value: 'fashion' },
          { title: 'Electronics & Audio', value: 'electronics' },
          { title: 'Home & Living', value: 'home' },
          { title: 'Footwear & Shoes', value: 'footwear' },
          { title: 'Accessories & Watches', value: 'accessories' },
          { title: 'Beauty & Wellness', value: 'beauty' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subcategory',
      title: 'Subcategory',
      type: 'string',
    }),
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            },
          ],
        },
      ],
      description: 'Upload product imagery or gallery photos',
    }),
    defineField({
      name: 'imageUrls',
      title: 'External Image URLs (Optional)',
      type: 'array',
      of: [{ type: 'url' }],
      description: 'Alternative direct image URLs (e.g. Unsplash or CDN links)',
    }),
    defineField({
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'],
      },
      initialValue: ['S', 'M', 'L'],
    }),
    defineField({
      name: 'colors',
      title: 'Color Palette',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: ['Black', 'Emerald'],
    }),
    defineField({
      name: 'stockQuantity',
      title: 'Total Stock Units',
      type: 'number',
      initialValue: 25,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      description: 'Showcase in homepage curated spotlight',
      initialValue: false,
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1 to 5)',
      type: 'number',
      initialValue: 4.9,
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: 'reviewCount',
      title: 'Review Count',
      type: 'number',
      initialValue: 1,
    }),
    defineField({
      name: 'fabric',
      title: 'Fabric & Composition',
      type: 'string',
    }),
    defineField({
      name: 'care',
      title: 'Care Instructions',
      type: 'string',
    }),
    defineField({
      name: 'tags',
      title: 'Search Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'images.0',
    },
  },
});
