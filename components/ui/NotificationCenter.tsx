// components/ui/NotificationCenter.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  Check, 
  Sparkles, 
  Tag, 
  Truck, 
  ArrowUpRight, 
  Trash2,
  CheckCheck
} from 'lucide-react';
import { showToast } from './Toast';
import { cn } from '@/lib/utils';

export interface StoreNotification {
  id: string;
  title: string;
  message: string;
  type: 'promo' | 'shipping' | 'ai' | 'order';
  time: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

const INITIAL_NOTIFICATIONS: StoreNotification[] = [
  {
    id: '1',
    title: 'Private Trunk Show Access',
    message: 'Use code ARCHITECT at checkout for 20% off all French flax linen & cashmere outerwear.',
    type: 'promo',
    time: 'Just now',
    isRead: false,
    actionUrl: '/products?category=sale',
    actionLabel: 'Shop Sale',
  },
  {
    id: '2',
    title: 'Complimentary Express Courier',
    message: 'Free doorstep courier delivery active on all orders today.',
    type: 'shipping',
    time: '2 hours ago',
    isRead: false,
  },
  {
    id: '3',
    title: 'AI Style Advisor Ready',
    message: 'Your personalized capsule wardrobe suggestions are ready for exploration.',
    type: 'ai',
    time: '5 hours ago',
    isRead: true,
  },
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<StoreNotification[]>(INITIAL_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast.info('Notifications Updated', 'All items marked as read.');
  };

  const clearAll = () => {
    setNotifications([]);
    showToast.info('Notifications Cleared', 'Your notification center is empty.');
  };

  const handleNotificationClick = (notif: StoreNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );
    showToast.info(notif.title, notif.message);
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-none border border-transparent hover:border-[#121212] text-[#121212] hover:bg-[#F3EFE8] transition-all cursor-pointer"
        aria-label="View notifications"
      >
        <Bell className="w-4 h-4" strokeWidth={1.5} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-[#B33927] text-[#FFFFFF] text-[9px] font-bold w-4 h-4 rounded-none flex items-center justify-center font-sans">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Sharp Notification Popover */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FFFFFF] border border-[#121212] shadow-2xl rounded-none z-50 animate-slide-up text-left"
          onMouseLeave={() => setIsOpen(false)}
        >
          {/* Header */}
          <div className="p-4 border-b border-[#E8E3DA] bg-[#FAF8F5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-spartan text-[13px] font-bold text-[#121212] uppercase tracking-[0.1em]">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="bg-[#121212] text-[#FFFFFF] text-[9px] px-1.5 py-0.5 font-bold uppercase tracking-wider">
                  {unreadCount} New
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-[11px] font-sans text-[#5E5A54] hover:text-[#121212] flex items-center gap-1 cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Read all</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-[11px] font-sans text-[#8E8A83] hover:text-[#B33927] p-1 cursor-pointer"
                  title="Clear all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[#E8E3DA]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center space-y-1">
                <p className="text-[13px] font-bold text-[#121212] font-spartan">All caught up</p>
                <p className="text-[11px] text-[#8E8A83] font-sans">No new alerts at this moment.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={cn(
                    'p-4 transition-colors cursor-pointer space-y-1.5 relative border-l-2',
                    notif.isRead 
                      ? 'bg-[#FFFFFF] hover:bg-[#FAF8F5] border-l-transparent' 
                      : 'bg-[#FAF8F5] hover:bg-[#F3EFE8] border-l-[#121212]'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {notif.type === 'promo' && <Tag className="w-3.5 h-3.5 text-[#B33927]" />}
                      {notif.type === 'shipping' && <Truck className="w-3.5 h-3.5 text-[#2E724F]" />}
                      {notif.type === 'ai' && <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />}
                      <span className="font-spartan text-[11px] font-bold text-[#121212] uppercase tracking-[0.08em]">
                        {notif.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#8E8A83] font-sans whitespace-nowrap">
                      {notif.time}
                    </span>
                  </div>

                  <p className="text-[12px] text-[#5E5A54] font-sans leading-relaxed">
                    {notif.message}
                  </p>

                  {notif.actionUrl && (
                    <div className="pt-1">
                      <Link
                        href={notif.actionUrl}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOpen(false);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold font-sans uppercase tracking-[0.08em] text-[#121212] hover:underline"
                      >
                        <span>{notif.actionLabel || 'View Details'}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-[#E8E3DA] bg-[#FAF8F5] text-center">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                showToast.info('Notification Preferences', 'You receive exclusive capsule previews & order tracking alerts.');
              }}
              className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#5E5A54] hover:text-[#121212] font-sans"
            >
              VIP Concierge Alerts Active
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
