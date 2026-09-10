// components/ui/Drawer.tsx
'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  position?: 'right' | 'left';
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  position = 'right',
  children,
  footer,
  width = 'md',
  className,
}: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div
        className={cn(
          'fixed inset-y-0 flex max-w-full',
          position === 'right' ? 'right-0 pl-10' : 'left-0 pr-10'
        )}
      >
        <div
          className={cn(
            'w-screen bg-[#FAF8F5] shadow-2xl flex flex-col h-full border-l border-[#121212] rounded-none animate-slide-up',
            widthClasses[width],
            className
          )}
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-[#E8E3DA] bg-[#FFFFFF] flex items-center justify-between">
            <h3 className="text-[16px] font-bold text-[#121212] font-spartan tracking-[0.1em] uppercase">
              {title || ''}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-none border border-transparent hover:border-[#121212] flex items-center justify-center text-[#5E5A54] hover:text-[#121212] hover:bg-[#F3EFE8] transition-colors cursor-pointer"
              aria-label="Close panel"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-[#FAF8F5]">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="p-5 sm:p-6 border-t border-[#E8E3DA] bg-[#FFFFFF]">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

