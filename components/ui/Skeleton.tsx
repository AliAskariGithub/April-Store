// components/ui/Skeleton.tsx
import React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-[8px] bg-[#F0EFEA]',
        className
      )}
      {...props}
    />
  );
}
