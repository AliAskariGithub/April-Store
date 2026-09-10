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
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  className,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={cn(
          'relative w-full bg-[#FFFFFF] border border-[#121212] rounded-none shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto animate-slide-up',
          maxWidthClasses[maxWidth],
          className
        )}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E3DA] mb-5">
          {title ? (
            <h3 className="text-[18px] font-bold text-[#121212] font-spartan tracking-[0.1em] uppercase">
              {title}
            </h3>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-none border border-transparent hover:border-[#121212] flex items-center justify-center text-[#5E5A54] hover:text-[#121212] hover:bg-[#F3EFE8] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}

