import React from 'react';
import { HelpCircle, RotateCcw, Youtube } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onOpenRules: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset, onOpenRules }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-xs">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="motogp-font italic font-black text-xl sm:text-2xl tracking-tighter text-gray-900 select-none">
            MotoGP<span className="text-[#e20613]">™</span>
          </div>
          <span className="hidden sm:inline-block w-px h-5 bg-gray-200 mx-1" />
          <div className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest hidden sm:block">
            2026 Title Simulator
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenRules}
            aria-label="Aturan Poin dan Skenario"
            className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-md transition-colors"
            title="Penjelasan Perhitungan Poin"
          >
            <HelpCircle className="w-3.5 h-3.5 text-gray-500" />
            <span className="hidden xs:inline">Aturan Poin</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            aria-label="Reset ke Pengaturan Awal"
            className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-md transition-colors"
            title="Kembalikan ke skenario bawaan"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
            <span className="hidden xs:inline">Reset</span>
          </button>

          <a
            href="https://youtube.com/@iwant_dc?si=5Y_Gnrj5q0yrKeq3"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#ff0000] hover:bg-[#cc0000] text-white text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-full shadow-sm transition-colors"
            title="Subscribe channel YouTube iWant MotoLab"
          >
            <Youtube className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Subscribe</span> YouTube
          </a>
        </div>
      </div>
    </header>
  );
};
