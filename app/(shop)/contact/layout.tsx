// app/(shop)/contact/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Client Inquiries & Project Collaboration',
  description:
    'Connect with Syed Ali Askari Zaidi for web development, brand design, digital marketing, and full-stack e-commerce project inquiries. April Store showcase website.',
  openGraph: {
    title: 'Contact | Client Inquiries & Project Collaboration',
    description:
      'Connect with Syed Ali Askari Zaidi for custom web development, brand design, and engineering collaborations.',
    url: 'https://aprilstore-one.vercel.app/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
