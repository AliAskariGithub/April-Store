// components/product/SizeGuide.tsx
'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';

export interface SizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const MEASUREMENTS_INCHES = [
  { size: 'XS', bust: '32 – 33', waist: '24 – 25', hips: '34 – 35', length: '54' },
  { size: 'S', bust: '34 – 35', waist: '26 – 27', hips: '36 – 37', length: '54.5' },
  { size: 'M', bust: '36 – 37', waist: '28 – 29', hips: '38 – 39', length: '55' },
  { size: 'L', bust: '38 – 40', waist: '30 – 32', hips: '40 – 42', length: '55.5' },
  { size: 'XL', bust: '41 – 43', waist: '33 – 35', hips: '43 – 45', length: '56' },
  { size: 'Free Size', bust: '34 – 42 (Fluid)', waist: '26 – 36 (Draped)', hips: '36 – 46 (Fluid)', length: '55' },
];

export function SizeGuide({ isOpen, onClose }: SizeGuideProps) {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Proportions Matrix & Sizing" maxWidth="lg">
      <div className="space-y-5 text-left">
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-[#8E8A83] font-sans">
            Parameters calibrated for optimal structural drape and silhouette flow.
          </p>
          <div className="flex items-center bg-[#FAF8F5] border border-[#121212] p-0.5 rounded-none text-[11px] font-bold font-spartan uppercase tracking-[0.05em]">
            <button
              type="button"
              onClick={() => setUnit('inches')}
              className={`px-2.5 py-1 rounded-none transition-colors ${unit === 'inches' ? 'bg-[#121212] text-white' : 'text-[#121212]'}`}
            >
              Inches
            </button>
            <button
              type="button"
              onClick={() => setUnit('cm')}
              className={`px-2.5 py-1 rounded-none transition-colors ${unit === 'cm' ? 'bg-[#121212] text-white' : 'text-[#121212]'}`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-[#121212] rounded-none">
          <table className="w-full text-left text-[12px] font-sans">
            <thead className="bg-[#FAF8F5] text-[#121212] font-bold font-spartan uppercase tracking-[0.06em] border-b border-[#121212]">
              <tr>
                <th className="p-3">Proportion</th>
                <th className="p-3">Bust ({unit === 'inches' ? 'in' : 'cm'})</th>
                <th className="p-3">Waist ({unit === 'inches' ? 'in' : 'cm'})</th>
                <th className="p-3">Hips ({unit === 'inches' ? 'in' : 'cm'})</th>
                <th className="p-3">Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DA]">
              {MEASUREMENTS_INCHES.map((row) => (
                <tr key={row.size} className="hover:bg-[#FAF8F5]">
                  <td className="p-3 font-bold font-spartan text-[#121212]">{row.size}</td>
                  <td className="p-3 text-[#5E5A54]">{row.bust}</td>
                  <td className="p-3 text-[#5E5A54]">{row.waist}</td>
                  <td className="p-3 text-[#5E5A54]">{row.hips}</td>
                  <td className="p-3 text-[#5E5A54]">{row.length}&rdquo;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#FAF8F5] p-3.5 rounded-none border border-[#121212] text-[12px] text-[#5E5A54] space-y-1 font-sans">
          <p className="font-bold text-[#121212] font-spartan uppercase tracking-[0.06em]">Bespoke Made-to-Measure Concierge</p>
          <p>
            Lunora Atelier provides bespoke tailor-made fittings for archive gowns. Consult our AI Stylist Concierge or specify custom parameters at settlement.
          </p>
        </div>
      </div>
    </Modal>
  );
}

