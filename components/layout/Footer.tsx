// components/layout/Footer.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  CheckCircle2, 
  Mail, 
  Phone, 
  Linkedin, 
  Facebook, 
  Instagram, 
  Github, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { showToast } from '@/components/ui/Toast';

export function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/studio')) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    showToast.success('Subscription Confirmed', 'Thank you for subscribing to April Store daily updates.');
    setEmail('');
  };

  const socialLinks = [
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/ali-askari-dev',
      icon: Linkedin,
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/profile.php?id=61564881342854',
      icon: Facebook,
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/syedaliaskarizaidi__/',
      icon: Instagram,
    },
    {
      name: 'GitHub',
      href: 'https://github.com/AliAskariGithub',
      icon: Github,
    },
  ];

  return (
    <footer className="bg-white text-gray-900 pt-12 sm:pt-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Top Newsletter Banner matching reference style */}
        <div className="bg-[#18181B] text-white rounded-2xl sm:rounded-3xl p-7 sm:p-10 lg:p-12 mb-14 sm:mb-16 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 shadow-xl">
          <div className="max-w-xl text-left w-full">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white mb-2">
              Subscribe for the daily Updates
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 font-normal leading-relaxed">
              Stay ahead with curated seasonal collections, exclusive drops, and insider sales delivered directly to your inbox.
            </p>
          </div>

          {/* Unified search/subscription input matching reference */}
          <div className="w-full lg:w-auto flex-shrink-0">
            {subscribed ? (
              <div className="bg-white/10 border border-white/20 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs sm:text-sm text-white">
                <CheckCircle2 className="w-5 h-5 text-[#FF5722] flex-shrink-0" />
                <span>You are subscribed to daily updates!</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="bg-white p-1.5 sm:p-2 rounded-2xl flex items-center shadow-md w-full sm:w-[420px] max-w-full"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent px-3.5 sm:px-4 py-2 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none min-w-0"
                />
                <button
                  type="submit"
                  className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all shadow-xs cursor-pointer flex-shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 2. Main 5-Column Navigation Grid matching reference layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10 text-left pb-14">
          
          {/* Column 1: Brand & Social Links */}
          <div className="col-span-2 sm:col-span-1 md:col-span-1 space-y-4">
            <Link href="/" className="inline-flex items-center gap-1">
              <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                April
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-[#FF5722]">
                Store
              </span>
            </Link>

            <p className="text-xs text-gray-500 font-normal leading-relaxed">
              April Store seamlessly connects your lifestyle with modern curated fashion, tech essentials, and living accessories.
            </p>

            {/* Social Icons row */}
            <div className="flex items-center gap-2.5 pt-1">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="w-8 h-8 rounded-lg bg-gray-900 hover:bg-[#FF5722] text-white flex items-center justify-center transition-colors shadow-xs"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Platform / Shop */}
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-gray-500 font-medium">
              <li>
                <Link href="/products" className="hover:text-[#FF5722] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?sort=newest" className="hover:text-[#FF5722] transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products?featured=true" className="hover:text-[#FF5722] transition-colors">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-[#FF5722] transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-[#FF5722] transition-colors">
                  Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Learn / Customer Account */}
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight">
              Learn
            </h4>
            <ul className="space-y-2 text-xs text-gray-500 font-medium">
              <li>
                <Link href="/account" className="hover:text-[#FF5722] transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-[#FF5722] transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-[#FF5722] transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#FF5722] transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link href="/contact#faqs" className="hover:text-[#FF5722] transition-colors">
                  FAQs & Help
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: About / Company */}
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight">
              About
            </h4>
            <ul className="space-y-2 text-xs text-gray-500 font-medium">
              <li>
                <Link href="/contact" className="hover:text-[#FF5722] transition-colors">
                  About April Store
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FF5722] transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact#shipping" className="hover:text-[#FF5722] transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FF5722] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#FF5722] transition-colors font-semibold text-[#FF5722]">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact Us matching reference style */}
          <div className="col-span-2 sm:col-span-1 md:col-span-1 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight">
              Contact US
            </h4>
            
            <div>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-[#18181B] hover:bg-[#FF5722] text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Get in touch
              </Link>
            </div>

            <div className="space-y-1.5 pt-1 text-xs text-gray-500">
              <a
                href="mailto:syedaliaskarizaidi1@gmail.com"
                className="flex items-center gap-1.5 hover:text-[#FF5722] transition-colors truncate"
              >
                <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="truncate">syedaliaskarizaidi1@gmail.com</span>
              </a>
              <a
                href="tel:+923192046516"
                className="flex items-center gap-1.5 hover:text-[#FF5722] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span>+92 319 2046516</span>
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* 3. Bottom Dark Copyright Strip matching reference */}
      <div className="bg-[#18181B] text-gray-400 text-xs py-4 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p>© Copyright {new Date().getFullYear()} April Store. All rights reserved.</p>
          <p className="text-[11px] text-gray-500">
            Crafted for modern lifestyle & digital retail.
          </p>
        </div>
      </div>
    </footer>
  );
}
