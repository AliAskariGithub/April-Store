// app/(shop)/products/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Collections & Products',
  description:
    'Browse through trending fashion apparel, footwear, accessories, electronics, and lifestyle decor. Filter by category, slider price range, and sizes.',
  openGraph: {
    title: 'Explore Collections & Products | April Store',
    description:
      'Browse through trending fashion apparel, footwear, accessories, electronics, and lifestyle decor with interactive filters.',
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
