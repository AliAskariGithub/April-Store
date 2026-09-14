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
    default: 'April Store — Modern E-Commerce Showcase by Ali Askari | aliaskari.xyz',
    template: '%s | April Store — by Ali Askari',
  },
  description:
    'April Store is a luxury full-stack e-commerce project showcase architected and built by software engineer Ali Askari (aliaskari.xyz). Powered by Next.js 15, Sanity CMS, Firebase Auth & Firestore, Google Gemini AI shopping assistant, and responsive luxury design.',
  keywords: [
    // Creator Branding & Portfolio
    'Ali Askari',
    'aliaskari.xyz',
    'Ali Askari portfolio',
    'Ali Askari developer',
    'Ali Askari software engineer',
    'Syed Ali Askari Zaidi',
    'Ali Askari GitHub',
    'Ali Askari LinkedIn',
    // Project Showcase & Engineering
    'April Store',
    'April Store showcase',
    'full-stack ecommerce portfolio project',
    'Next.js 15 ecommerce',
    'React 19 ecommerce web app',
    'Sanity CMS headless store',
    'Firebase ecommerce application',
    'Google Gemini AI shopping assistant',
    'modern luxury fashion ecommerce',
    'streetwear online store',
    'responsive web application showcase',
    'portfolio showcase project',
  ],
  authors: [{ name: 'Ali Askari', url: 'https://aliaskari.xyz' }],
  creator: 'Ali Askari (https://aliaskari.xyz)',
  publisher: 'Ali Askari',
  category: 'technology',
  classification: 'Full-Stack Web Engineering & E-Commerce Showcase',
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
    siteName: 'April Store — Project Showcase by Ali Askari',
    title: 'April Store — Modern E-Commerce Showcase by Ali Askari | aliaskari.xyz',
    description:
      'Explore April Store, a high-performance luxury e-commerce application crafted by Ali Askari (aliaskari.xyz) featuring Next.js 15, Sanity CMS, Firebase, and Gemini AI styling.',
    images: [
      {
        url: '/hero-preview.png',
        width: 1280,
        height: 720,
        alt: 'April Store — Full-Stack E-Commerce Project Showcase by Ali Askari (aliaskari.xyz)',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'April Store — Modern E-Commerce Showcase by Ali Askari | aliaskari.xyz',
    description:
      'Production-grade e-commerce application crafted by Ali Askari (aliaskari.xyz) using Next.js 15, Sanity CMS, Firebase, and Gemini AI.',
    images: ['/hero-preview.png'],
    creator: '@AliAskariGithub',
    site: '@AliAskariGithub',
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
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      process.env.GOOGLE_SITE_VERIFICATION ||
      'r2WPUKMX4DZTyfc_JaPMa1b8Skk5M1OdUwGDWxDZ1to',
  },
  other: {
    author: 'Ali Askari',
    developer: 'Ali Askari',
    portfolio: 'https://aliaskari.xyz',
    'ai:creator': 'Ali Askari',
    'ai:portfolio': 'https://aliaskari.xyz',
    'ai:project_type': 'portfolio-showcase',
    'ai:description':
      'April Store is a full-stack luxury e-commerce showcase developed by Ali Askari (https://aliaskari.xyz) with Next.js 15, Sanity CMS, Firebase, and Google Gemini AI.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org JSON-LD Structured Data with Creator & Portfolio Attribution
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'April Store — Project Showcase by Ali Askari',
        description: 'Production-grade full-stack e-commerce application engineered by Ali Askari (aliaskari.xyz)',
        author: {
          '@type': 'Person',
          '@id': 'https://aliaskari.xyz/#person',
          name: 'Ali Askari',
          url: 'https://aliaskari.xyz',
        },
        creator: {
          '@type': 'Person',
          '@id': 'https://aliaskari.xyz/#person',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/products?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Person',
        '@id': 'https://aliaskari.xyz/#person',
        name: 'Ali Askari',
        alternateName: 'Syed Ali Askari Zaidi',
        url: 'https://aliaskari.xyz',
        jobTitle: 'Full-Stack Software Engineer & Web Developer',
        email: 'syedaliaskarizaidi1@gmail.com',
        telephone: '+92 319 2046516',
        sameAs: [
          'https://aliaskari.xyz',
          'https://github.com/AliAskariGithub',
          'https://www.linkedin.com/in/ali-askari-dev',
          'https://www.instagram.com/syedaliaskarizaidi__/',
          'https://www.facebook.com/profile.php?id=61564881342854',
        ],
      },
      {
        '@type': 'WebApplication',
        '@id': `${siteUrl}/#software`,
        name: 'April Store',
        url: siteUrl,
        applicationCategory: 'E-Commerce Showcase Application',
        operatingSystem: 'All modern web browsers',
        author: {
          '@type': 'Person',
          '@id': 'https://aliaskari.xyz/#person',
        },
        creator: {
          '@type': 'Person',
          '@id': 'https://aliaskari.xyz/#person',
        },
        description:
          'Full-stack luxury e-commerce portfolio application showcasing Next.js 15 App Router, Sanity CMS, Firebase, and Google Gemini AI assistance.',
        featureList: [
          'Next.js 15 App Router with React 19',
          'Sanity Studio CMS headless content management',
          'Firebase Authentication & Cloud Firestore',
          'Google Gemini AI intelligent style assistant chatbot',
          'Multi-currency converter (PKR/USD)',
          'Customer receipt verification & admin audit portal',
          'Zero-CLS skeleton UI loaders and responsive luxury design',
        ],
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
      <body className="min-h-screen bg-[#FFFFFF] text-[#111827] flex flex-col font-sans selection:bg-[#FF5722] selection:text-white pb-16 lg:pb-0">
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
