// components/ui/ImageUpload.tsx
'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface ImageUploadProps {
  value?: string;
  onChange: (base64OrUrl: string) => void;
  onClear?: () => void;
  label?: string;
  helperText?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  onClear,
  label = 'Upload Screenshot / Image',
  helperText = 'PNG, JPG, or JPEG up to 5MB (Drag & drop or click to browse)',
  className,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <span className="text-[13px] font-medium text-[#3D3D3A] font-sans">
          {label}
        </span>
      )}

      {value ? (
        <div className="relative rounded-[12px] overflow-hidden border border-[#D8D6CE] bg-[#F9F9F7] p-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 rounded-[8px] overflow-hidden border border-[#D8D6CE] bg-white flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Uploaded receipt"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-[14px] font-medium text-[#0A0A0A] font-sans">
                Image Attached
              </p>
              <p className="text-[12px] text-[#9E9C93] font-sans">
                Ready for AI & Admin verification
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onClear?.();
              if (inputRef.current) inputRef.current.value = '';
            }}
            className="text-[#C0392B] hover:bg-[#C0392B]/10"
          >
            <X className="w-4 h-4 mr-1" />
            Remove
          </Button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-[12px] p-6 text-center transition-all cursor-pointer bg-[#F9F9F7] flex flex-col items-center justify-center gap-2',
            isDragging
              ? 'border-[#024E44] bg-[#024E44]/5'
              : 'border-[#D8D6CE] hover:border-[#024E44]'
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />
          <div className="w-12 h-12 rounded-full bg-[#FFFFFF] border border-[#D8D6CE] flex items-center justify-center text-[#024E44] shadow-xs">
            <UploadCloud className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[14px] font-medium text-[#0A0A0A] font-sans">
              Click to upload receipt or drag & drop
            </p>
            <p className="text-[12px] text-[#9E9C93] font-sans mt-0.5">
              {helperText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
