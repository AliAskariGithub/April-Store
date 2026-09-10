// components/checkout/ReceiptUpload.tsx
'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Spinner } from '@/components/ui/Spinner';
import { ReceiptVerification } from '@/types/ai';
import { useCurrencyStore } from '@/store/currencyStore';
import { showToast } from '@/components/ui/Toast';

export interface ReceiptUploadProps {
  receiptImage?: string;
  onReceiptUploaded: (imageUrl: string, verification?: ReceiptVerification) => void;
  expectedAmount?: number;
}

export function ReceiptUpload({
  receiptImage,
  onReceiptUploaded,
  expectedAmount,
}: ReceiptUploadProps) {
  const { formatPrice } = useCurrencyStore();
  const [analyzing, setAnalyzing] = useState(false);
  const [verification, setVerification] = useState<ReceiptVerification | null>(null);

  const handleImageChange = async (base64Image: string) => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/ai/verify-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Image }),
      });
      const result: ReceiptVerification = await res.json();
      setVerification(result);
      onReceiptUploaded(base64Image, result);

      if (result.isValid) {
        showToast.success('Receipt Processed with Gemini AI', result.note);
      } else {
        showToast.error('Receipt Verification Alert', result.note);
      }
    } catch (err) {
      console.error(err);
      onReceiptUploaded(base64Image);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleClear = () => {
    setVerification(null);
    onReceiptUploaded('');
  };

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <label className="text-[12px] font-bold text-[#121212] font-spartan uppercase tracking-[0.06em]">
          Upload Settlement Screenshot / Receipt
        </label>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#121212] bg-[#FAF8F5] border border-[#121212] px-2.5 py-0.5 rounded-none font-spartan uppercase tracking-[0.05em]">
          <Sparkles className="w-3 h-3 text-[#C5A880]" />
          Gemini Intelligence
        </span>
      </div>

      <ImageUpload
        value={receiptImage}
        onChange={handleImageChange}
        onClear={handleClear}
        label=""
        helperText="Attach bank transfer screenshot (Meezan, Alfalah, SCB, Raast, SadaPay)"
      />

      {analyzing && (
        <div className="p-4 rounded-none bg-[#FAF8F5] border border-[#121212] flex items-center gap-3 animate-slide-up">
          <Spinner size="sm" color="primary" />
          <div className="text-[12px] font-sans text-[#121212]">
            <p className="font-spartan font-bold uppercase tracking-[0.05em]">Gemini Vision AI Parsing Transaction...</p>
            <p className="text-[11px] text-[#8E8A83]">Extracting timestamp, beneficiary, amount & reference TRX</p>
          </div>
        </div>
      )}

      {verification && !analyzing && (
        <div className="p-4 rounded-none bg-[#FAF8F5] border border-[#121212] space-y-2.5 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {verification.isValid ? (
                <CheckCircle2 className="w-4 h-4 text-[#121212]" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#C0392B]" />
              )}
              <span className="font-bold text-[12px] font-spartan uppercase tracking-[0.05em] text-[#121212]">
                {verification.isValid ? 'AI Receipt Verified' : 'Manual Audit Required'}
              </span>
            </div>
            <span className="text-[10px] font-bold font-spartan uppercase tracking-[0.05em] bg-white border border-[#121212] text-[#121212] px-2 py-0.5 rounded-none">
              Confidence: {Math.round((verification.confidence || 0.9) * 100)}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[12px] font-sans pt-1">
            {verification.extractedAmount && (
              <div className="bg-white p-2 rounded-none border border-[#121212]">
                <span className="text-[#8E8A83] text-[10px] font-spartan uppercase block">Extracted Amount:</span>
                <span className="font-bold font-spartan text-[#121212]">
                  {formatPrice(verification.extractedAmount)}
                </span>
              </div>
            )}
            {verification.bankName && (
              <div className="bg-white p-2 rounded-none border border-[#121212]">
                <span className="text-[#8E8A83] text-[10px] font-spartan uppercase block">Financial Gateway:</span>
                <span className="font-bold font-spartan uppercase text-[#121212]">{verification.bankName}</span>
              </div>
            )}
            {verification.extractedReference && (
              <div className="bg-white p-2 rounded-none border border-[#121212]">
                <span className="text-[#8E8A83] text-[10px] font-spartan uppercase block">Reference / TRX:</span>
                <span className="font-bold font-spartan text-[#121212]">{verification.extractedReference}</span>
              </div>
            )}
            {verification.extractedDate && (
              <div className="bg-white p-2 rounded-none border border-[#121212]">
                <span className="text-[#8E8A83] text-[10px] font-spartan uppercase block">Timestamp:</span>
                <span className="font-bold font-spartan text-[#121212]">{verification.extractedDate}</span>
              </div>
            )}
          </div>

          <p className="text-[11px] text-[#5E5A54] font-sans italic border-t border-[#E8E3DA] pt-2">
            &ldquo;{verification.note}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}

