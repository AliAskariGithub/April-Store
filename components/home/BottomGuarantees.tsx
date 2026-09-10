// components/home/BottomGuarantees.tsx
'use client';

import React from 'react';
import { Award, Zap, Lock, Smile } from 'lucide-react';

export function BottomGuarantees() {
  const items = [
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Guaranteed best materials',
    },
    {
      icon: Zap,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping',
    },
    {
      icon: Lock,
      title: 'Secure Checkout',
      description: 'Your data is protected',
    },
    {
      icon: Smile,
      title: 'Customer Satisfaction',
      description: 'Top rated by our customers',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-b border-gray-100 my-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex items-center gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-900 border border-gray-100">
                <Icon className="w-5 h-5 stroke-[1.8]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                  {item.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 font-normal">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
