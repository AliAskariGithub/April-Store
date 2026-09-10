// components/ui/Toast.tsx
'use client';

import { toast } from 'sonner';

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      style: {
        background: '#121212',
        color: '#FFFFFF',
        border: '1px solid #121212',
        borderLeft: '4px solid #C5A880',
        borderRadius: '0px',
        fontFamily: 'var(--font-body), sans-serif',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        padding: '14px 18px',
      },
    });
  },
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      style: {
        background: '#121212',
        color: '#FFFFFF',
        border: '1px solid #121212',
        borderLeft: '4px solid #B33927',
        borderRadius: '0px',
        fontFamily: 'var(--font-body), sans-serif',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        padding: '14px 18px',
      },
    });
  },
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      style: {
        background: '#FAF8F5',
        color: '#121212',
        border: '1px solid #121212',
        borderLeft: '4px solid #121212',
        borderRadius: '0px',
        fontFamily: 'var(--font-body), sans-serif',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        padding: '14px 18px',
      },
    });
  },
};

