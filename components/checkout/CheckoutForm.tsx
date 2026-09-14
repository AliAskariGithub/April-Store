// components/checkout/CheckoutForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema, CheckoutFormData } from '@/lib/utils/validators';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { ReceiptUpload } from './ReceiptUpload';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/store/uiStore';
import { createOrder } from '@/lib/firebase/firestore';
import { showToast } from '@/components/ui/Toast';
import { ReceiptVerification } from '@/types/ai';
import { Lock, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, shippingFee, total, clearCart } = useCart();
  const { user } = useAuth();
  const { openAuthModal } = useUIStore();
  const [submitting, setSubmitting] = useState(false);

  const [receiptImage, setReceiptImage] = useState<string>('');
  const [receiptVerification, setReceiptVerification] = useState<ReceiptVerification | null>(null);

  const defaultAddress = user?.addresses?.[user.defaultAddressIndex] || {
    fullName: user?.displayName || '',
    phone: user?.phone || '',
    street: '',
    city: 'Islamabad',
    state: 'Federal',
    postalCode: '44000',
    country: 'Pakistan',
  };

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: defaultAddress.fullName,
      phone: defaultAddress.phone,
      street: defaultAddress.street,
      city: defaultAddress.city,
      state: defaultAddress.state,
      postalCode: defaultAddress.postalCode,
      country: 'Pakistan',
      paymentMethod: 'cod',
      saveAddress: true,
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (!user) {
      showToast.error('Sign In Required', 'Please sign in or create an account to place and save your order.');
      openAuthModal('signin');
      return;
    }

    if (items.length === 0) {
      showToast.error('Cart is empty', 'Please add items before checking out.');
      return;
    }

    if (paymentMethod === 'online' && !receiptImage) {
      showToast.error('Receipt Required', 'Please upload your bank transfer screenshot to proceed.');
      return;
    }

    setSubmitting(true);
    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        size: item.size,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity,
      }));

      const created = await createOrder({
        userId: user.uid,
        customerEmail: user.email || undefined,
        customerName: user.displayName || data.fullName,
        items: orderItems,
        subtotal,
        shippingFee: subtotal >= 50000 ? 0 : shippingFee,
        total: subtotal >= 50000 ? subtotal : total,
        status: 'pending',
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentMethod === 'online' 
          ? (receiptVerification?.isValid ? 'confirmed' : 'under_review')
          : 'pending',
        receiptImageUrl: receiptImage || undefined,
        receiptVerified: receiptVerification?.isValid || false,
        receiptNote: receiptVerification?.note || undefined,
        shippingAddress: {
          fullName: data.fullName,
          phone: data.phone,
          street: data.street,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
        },
      });

      clearCart();
      showToast.success('Order Placed Successfully', `Your order #${created.id} is confirmed.`);
      router.push(`/orders/${created.id}`);
    } catch (err) {
      console.error('Order creation failed:', err);
      showToast.error('Order Submission Failed', 'Please verify your information and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-left">
      {!user && (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold font-spartan uppercase tracking-wider text-amber-900">
                Sign In Required to Place Order
              </h4>
              <p className="text-xs text-amber-700/90 mt-0.5">
                Orders must be linked to a verified account to save tracking and receipt records.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={() => openAuthModal('signin')}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-white bg-[#FF5722] hover:bg-[#F4511E] rounded-xl transition shadow-sm"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('register')}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition shadow-sm"
            >
              Create Account
            </button>
          </div>
        </div>
      )}

      {/* Shipping Address Section */}
      <div className="space-y-4">
        <h3 className="font-spartan text-[14px] font-extrabold uppercase tracking-[0.1em] text-[#121212] pb-2 border-b border-[#121212]">
          1. Consignee Delivery Coordinates
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="e.g. Zara Khan"
            error={errors.fullName?.message}
            {...register('fullName')}
          />

          <Input
            label="Phone Number"
            placeholder="e.g. 0300 1234567"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        <Input
          label="Street Address / House / Residence"
          placeholder="e.g. Villa 14, Street 9, Sector F-7/2"
          error={errors.street?.message}
          {...register('street')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-spartan font-bold uppercase tracking-[0.08em] text-[#121212] block mb-1.5">
              City
            </label>
            <select
              className="w-full bg-[#FFFFFF] border border-[#121212] rounded-none px-3.5 py-3 text-[13px] font-sans text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212]"
              {...register('city')}
            >
              {['Islamabad', 'Lahore', 'Karachi', 'Rawalpindi', 'Faisalabad', 'Peshawar', 'Multan', 'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <Input
            label="Province / Region"
            placeholder="e.g. Punjab / Federal / Sindh"
            error={errors.state?.message}
            {...register('state')}
          />

          <Input
            label="Postal Code"
            placeholder="e.g. 44000"
            error={errors.postalCode?.message}
            {...register('postalCode')}
          />
        </div>
      </div>

      {/* Payment Method Section */}
      <div className="space-y-4 pt-4 border-t border-[#121212]">
        <h3 className="font-spartan text-[14px] font-extrabold uppercase tracking-[0.1em] text-[#121212] pb-2 border-b border-[#121212]">
          2. Settlement Protocol
        </h3>

        <PaymentMethodSelector
          value={paymentMethod}
          onChange={(m) => {
            setPaymentMethod(m);
            setValue('paymentMethod', m);
          }}
        />

        {paymentMethod === 'online' && (
          <div className="pt-2">
            <ReceiptUpload
              receiptImage={receiptImage}
              expectedAmount={total}
              onReceiptUploaded={(img, ver) => {
                setReceiptImage(img);
                if (ver) setReceiptVerification(ver);
              }}
            />
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-gray-100">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={submitting}
          className="w-full py-4 text-sm font-bold justify-between bg-[#FF5722] hover:bg-[#F4511E] text-white rounded-xl"
        >
          <span className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span>{user ? 'Place Order Now' : 'Sign In to Place Order'}</span>
          </span>
          <ArrowRight className="w-4 h-4" />
        </Button>

        <p className="text-[11px] text-center text-[#8E8A83] font-sans mt-3">
          By placing your order, you agree to Lunora Atelier Terms of Service and 7-day Exchange Policy.
        </p>
      </div>
    </form>
  );
}

