// types/review.ts

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userDisplayName: string;
  userPhotoURL?: string;
  rating: number; // 1–5
  title: string;
  body: string;
  size?: string;
  verified: boolean; // purchased the product
  helpful: number;
  createdAt: string | { seconds: number; nanoseconds: number };
}
