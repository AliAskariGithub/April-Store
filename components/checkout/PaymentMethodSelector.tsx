// components/checkout/PaymentMethodSelector.tsx
'use client';

import React from 'react';
import { Truck, Landmark, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaymentMethodSelectorProps {
  value: 'cod' | 'online';
  onChange: (method: 'cod' | 'online') => void;
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-4 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Cash on Delivery Option */}
        <div
          onClick={() => onChange('cod')}
          className={cn(
            'p-4 sm:p-5 rounded-none border-2 transition-all cursor-pointer relative flex flex-col justify-between space-y-3 bg-[#FFFFFF]',
            value === 'cod'
              ? 'border-[#121212] bg-[#FAF8F5]'
              : 'border-[#E8E3DA] hover:border-[#121212]'
          )}
        >
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-none bg-[#121212] text-[#C5A880] flex items-center justify-center border border-[#121212]">
              <Truck className="w-4 h-4" strokeWidth={1.5} />
            </div>
            {value === 'cod' && (
              <CheckSquare className="w-5 h-5 text-[#121212]" />
            )}
          </div>
          <div>
            <h4 className="font-spartan text-[13px] font-extrabold uppercase tracking-[0.05em] text-[#121212]">
              Cash on Delivery (COD)
            </h4>
            <p className="text-[11px] text-[#8E8A83] font-sans mt-1">
              Pay upon insured handover at your doorstep anywhere in Pakistan.
            </p>
          </div>
        </div>

        {/* Online Bank Transfer / Mobile Wallet */}
        <div
          onClick={() => onChange('online')}
          className={cn(
            'p-4 sm:p-5 rounded-none border-2 transition-all cursor-pointer relative flex flex-col justify-between space-y-3 bg-[#FFFFFF]',
            value === 'online'
              ? 'border-[#121212] bg-[#FAF8F5]'
              : 'border-[#E8E3DA] hover:border-[#121212]'
          )}
        >
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-none bg-[#C5A880] text-[#121212] flex items-center justify-center border border-[#121212]">
              <Landmark className="w-4 h-4" strokeWidth={1.5} />
            </div>
            {value === 'online' && (
              <CheckSquare className="w-5 h-5 text-[#121212]" />
            )}
          </div>
          <div>
            <h4 className="font-spartan text-[13px] font-extrabold uppercase tracking-[0.05em] text-[#121212]">
              Bank Transfer / Digital Gateway
            </h4>
            <p className="text-[11px] text-[#8E8A83] font-sans mt-1">
              Transfer via Bank Alfalah, SCB, Raast, or SadaPay with instant receipt verification.
            </p>
          </div>
        </div>
      </div>

      {/* Online Transfer Bank Account Details Display */}
      {value === 'online' && (
        <div className="p-4 rounded-none bg-[#FAF8F5] border border-[#121212] text-[12px] font-sans space-y-2 animate-slide-up">
          <p className="font-spartan font-bold uppercase tracking-[0.05em] text-[#121212]">Lunora Atelier Treasury Coordinates:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#5E5A54]">
            <div>
              <span className="font-spartan font-bold uppercase text-[#8E8A83]">Bank:</span> Bank Alfalah Limited (Islamic)
            </div>
            <div>
              <span className="font-spartan font-bold uppercase text-[#8E8A83]">Title:</span> LUNORA ATELIER PVT LTD
            </div>
            <div>
              <span className="font-spartan font-bold uppercase text-[#8E8A83]">Account No:</span> 0192 100 488 2901
            </div>
            <div>
              <span className="font-spartan font-bold uppercase text-[#8E8A83]">IBAN:</span> PK34 ALFH 0192 1004 8829 0100
            </div>
          </div>
          <p className="text-[10px] text-[#8E8A83] pt-1">
            * Please attach your transaction screenshot below for instant Gemini AI verification.
          </p>
        </div>
      )}
    </div>
  );
}

