// components/ui/Modal.tsx
'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  hideHeader?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  className,
  hideHeader = false,
}: ModalProps) {
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

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={cn(
          'relative w-full bg-white border border-gray-100 rounded-3xl shadow-2xl p-6 sm:p-8 z-10 max-h-[92vh] overflow-y-auto animate-slide-up',
          maxWidthClasses[maxWidth],
          className
        )}
      >
        {!hideHeader && (
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
            {title ? (
              <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                {title}
              </h3>
            ) : (
              <div />
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-gray-200 hover:border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  );
}


