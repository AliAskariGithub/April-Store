// lib/utils/validators.ts
import { z } from 'zod';

export const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(10, 'Valid phone number is required (e.g. 03001234567)'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State or Province is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
});

export const checkoutSchema = addressSchema.extend({
  paymentMethod: z.enum(['cod', 'online'] as const, {
    message: 'Please select a payment method',
  }),
  saveAddress: z.boolean(),
  receiptImageUrl: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a star rating').max(5),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  body: z.string().min(10, 'Review must be at least 10 characters'),
  size: z.string().optional(),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

export const productSchema = z.object({
  name: z.string().min(3, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  salePrice: z.coerce.number().optional(),
  category: z.string().min(1, 'Please select a category'),
  subcategory: z.string().optional(),
  sizes: z.array(z.string()).min(1, 'Select at least one size'),
  colors: z.array(z.string()).optional(),
  tags: z.string().transform((val) => val.split(',').map((s) => s.trim()).filter(Boolean)),
  featured: z.boolean().default(false),
});

export type ProductFormData = z.infer<typeof productSchema>;
