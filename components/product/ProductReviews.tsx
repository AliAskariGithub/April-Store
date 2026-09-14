// components/product/ProductReviews.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, ThumbsUp, Plus } from 'lucide-react';
import { Review } from '@/types/review';
import { StarRating } from '@/components/ui/StarRating';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { getReviews, addReview } from '@/lib/firebase/firestore';
import { formatDate } from '@/lib/utils/format';
import { showToast } from '@/components/ui/Toast';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/store/uiStore';

export interface ProductReviewsProps {
  productId: string;
  productName: string;
}

export function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const { user } = useAuth();
  const { openAuthModal } = useUIStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [, setLoading] = useState(true);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // Form state
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [size, setSize] = useState('M');
  const [submitting, setSubmitting] = useState(false);

  const handleOpenWriteModal = () => {
    if (!user) {
      showToast.error('Sign In Required', 'Please sign in or create an account to leave a verified review.');
      openAuthModal('signin');
      return;
    }
    setIsWriteModalOpen(true);
  };

  const fetchProductReviews = React.useCallback(async () => {
    try {
      const data = await getReviews(productId);
      setReviews(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    let ignore = false;
    getReviews(productId)
      .then((data) => {
        if (!ignore) {
          setReviews(data);
          setLoading(false);
        }
      })
      .catch((e) => {
        console.error(e);
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast.error('Sign In Required', 'Please sign in or create an account to leave a verified review.');
      openAuthModal('signin');
      return;
    }

    if (!title.trim() || !body.trim()) {
      showToast.error('Incomplete Review', 'Please provide a title and detailed review.');
      return;
    }

    setSubmitting(true);
    try {
      await addReview({
        productId,
        userId: user.uid,
        userDisplayName: user.displayName || user.email?.split('@')[0] || 'Verified Customer',
        rating,
        title,
        body,
        size,
        verified: true,
      });

      showToast.success('Review Submitted', 'Thank you for your feedback!');
      setIsWriteModalOpen(false);
      setTitle('');
      setBody('');
      await fetchProductReviews();
    } catch (err) {
      console.error(err);
      showToast.error('Submission Failed');
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="space-y-6 pt-10 border-t border-gray-100 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">
            Customer Reviews & Ratings
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <StarRating rating={Number(averageRating)} size="md" />
            <span className="text-sm font-bold text-gray-900">
              {averageRating} / 5.0
            </span>
            <span className="text-xs text-gray-500">
              ({reviews.length} verified reviews)
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="md"
          onClick={handleOpenWriteModal}
          className="flex items-center gap-2 rounded-xl self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#FF5722]" />
          <span>Write a Review</span>
        </Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="p-5 rounded-2xl bg-white border border-gray-100 shadow-2xs space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} size="sm" />
                <h4 className="text-xs font-bold text-gray-900">
                  {review.title}
                </h4>
              </div>
              <span className="text-xs text-gray-400">
                {formatDate(review.createdAt)}
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              {review.body}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{review.userDisplayName}</span>
                {review.verified && (
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verified Buyer
                  </span>
                )}
                {review.size && (
                  <span>• Option: {review.size}</span>
                )}
              </div>

              <div className="flex items-center gap-1 text-gray-600">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Helpful ({review.helpful})</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Write Review Modal */}
      <Modal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        title={`Review: ${productName}`}
        maxWidth="md"
      >
        <form onSubmit={handleSubmitReview} className="space-y-4 text-left">
          <div>
            <label className="text-xs font-bold text-gray-900 block mb-1">
              Your Rating
            </label>
            <StarRating
              rating={rating}
              interactive
              size="lg"
              onChange={(r) => setRating(r)}
            />
          </div>

          <Input
            label="Review Headline"
            placeholder="e.g. Great quality and comfortable fit!"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="text-xs font-bold text-gray-900 block mb-1">
              Your Review
            </label>
            <textarea
              rows={4}
              required
              placeholder="What did you like or dislike about this product? How does it fit?"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-[#FF5722]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold text-gray-900 block mb-1">
                Selected Size
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none"
              >
                {['XS', 'S', 'M', 'L', 'XL', 'One Size'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={submitting}
              className="self-end bg-[#FF5722] hover:bg-[#F4511E] text-white rounded-xl"
            >
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
