// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ChatbotWidget } from '@/components/ai/ChatbotWidget';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

function getValidSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
  if (raw && (raw.startsWith('http://') || raw.startsWith('https://'))) {
    try {
      return new URL(raw);
    } catch {
      // fallback
    }
  }
  return new URL('https://aprilstore-one.vercel.app');
}

const siteUrlObject = getValidSiteUrl();

const siteUrl = siteUrlObject.origin;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FF5722',
};

export const metadata: Metadata = {
  metadataBase: siteUrlObject,
  title: {
    default: 'April Store — Intelligent Modern E-Commerce & Curated Fashion',
    template: '%s | April Store',
  },
  description:
    'Discover curated collections across trending fashion, footwear, accessories, audio electronics, and lifestyle decor. Experience AI style recommendations, instant cart checkout, and seamless worldwide shopping.',
  keywords: [
    'April Store',
    'modern e-commerce',
    'trending fashion',
    'streetwear',
    'curated luxury',
    'lifestyle goods',
    'AI stylist concierge',
    'electronics',
    'sneakers',
    'online shopping',
  ],
  authors: [{ name: 'April Store' }],
  creator: 'April Store',
  publisher: 'April Store',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'April Store',
    title: 'April Store — Intelligent Modern E-Commerce & Curated Fashion',
    description:
      'Discover curated collections across trending fashion, footwear, accessories, audio electronics, and lifestyle decor with smart AI styling.',
    images: [
      {
        url: '/hero-preview.png',
        width: 1280,
        height: 720,
        alt: 'April Store — Modern E-Commerce Showcase',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'April Store — Intelligent Modern E-Commerce & Curated Fashion',
    description:
      'Discover curated collections across trending fashion, accessories, and modern essentials with Google Gemini AI shopping assistance.',
    images: ['/hero-preview.png'],
    creator: '@AliAskariGithub',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'April Store',
        description: 'Intelligent Modern E-Commerce & Curated Lifestyle Collections',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/products?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'April Store',
        url: siteUrl,
        logo: `${siteUrl}/hero-preview.png`,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+1-800-555-0199',
          contactType: 'customer service',
          areaServed: 'Worldwide',
          availableLanguage: ['English'],
        },
      },
      {
        '@type': 'Store',
        '@id': `${siteUrl}/#store`,
        name: 'April Store',
        url: siteUrl,
        priceRange: '$$',
        image: `${siteUrl}/hero-preview.png`,
        currenciesAccepted: 'USD, PKR',
        paymentAccepted: 'Cash on Delivery, Bank Transfer',
      },
    ],
  };

  return (
    <html lang="en" className={plusJakarta.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#FFFFFF] text-[#111827] flex flex-col font-sans selection:bg-[#FF5722] selection:text-white">
        {/* Global Toast Notifications Provider */}
        <Toaster position="top-right" richColors />

        {/* Global Header */}
        <Navbar />

        {/* Mobile Navigation Drawer */}
        <MobileMenu />

        {/* Global Sliding Cart Drawer */}
        <CartDrawer />

        {/* Main Content Area */}
        <main className="flex-1">{children}</main>

        {/* Floating AI Style Advisor & Support Concierge */}
        <ChatbotWidget />

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
