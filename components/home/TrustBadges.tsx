// components/home/TrustBadges.tsx
'use client';

import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';

export function TrustBadges() {
  const badges = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders over $50',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Payments',
      description: '100% secure checkout',
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      description: '30-day return policy',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Always here to help',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-b border-gray-100 my-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div key={badge.title} className="flex items-center gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-900 border border-gray-100">
                <Icon className="w-5 h-5 stroke-[1.8]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                  {badge.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 font-normal">
                  {badge.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
