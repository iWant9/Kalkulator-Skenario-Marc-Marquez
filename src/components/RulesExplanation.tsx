import React from 'react';
import { X, CheckCircle, Info } from 'lucide-react';
import { CLINCH_BEZ, CLINCH_MARTIN } from '../utils/calculator';

interface RulesExplanationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesExplanation: React.FC<RulesExplanationProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-gray-200 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup jendela aturan"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-3 text-red-600 pr-8">
          <Info className="w-5 h-5 flex-shrink-0" />
          <h3 className="font-bold text-base sm:text-lg text-gray-900 motogp-font uppercase leading-snug">
            Penjelasan Skenario & Sistem Poin
          </h3>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
            <h4 className="font-bold text-red-700 mb-1">Kenapa Target 74 Poin vs Martin?</h4>
            <p>
              Setelah Seri Qatar, tersisa 2 seri balapan MotoGP berikutnya. Maksimal poin per seri adalah 37 poin (12 Sprint + 25 Race Utama), sehingga total poin maksimal yang dapat diraih rival di 2 seri sisa adalah <strong>74 poin</strong>. Jika Marc unggul minimal 74 poin dan memiliki jumlah kemenangan GP utama lebih banyak, gelar otomatis terkunci.
            </p>
          </div>

          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <h4 className="font-bold text-purple-700 mb-1">Kenapa Target 75 Poin vs Bezzecchi?</h4>
            <p>
              Dengan target keunggulan <strong>75 poin</strong> ({CLINCH_BEZ} pts), secara mutlak Marco Bezzecchi tidak dapat lagi mengejar Marc Márquez dalam keadaan apapun di 2 seri sisa.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-1.5">Sistem Poin Resmi MotoGP:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="border border-gray-200 rounded p-2 bg-gray-50">
                <span className="font-bold text-red-600 block mb-1">Sprint Race (Sabtu)</span>
                P1: 12, P2: 9, P3: 7, P4: 6, P5: 5, P6: 4, P7: 3, P8: 2, P9: 1 poin.
              </div>
              <div className="border border-gray-200 rounded p-2 bg-gray-50">
                <span className="font-bold text-blue-600 block mb-1">Race Utama (Minggu)</span>
                P1: 25, P2: 20, P3: 16, P4: 13, P5: 11, P6: 10, P7: 9, P8: 8, P9: 7, P10: 6, P11: 5, P12: 4, P13: 3, P14: 2, P15: 1 poin.
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3">
            <h4 className="font-bold text-gray-900 mb-1">Fitur Anti-Duplikasi Posisi:</h4>
            <p className="text-[11px] text-gray-500">
              Jika dua rider atau lebih diatur dalam mode <em>Posisi</em>, simulator secara otomatis mencegah posisi yang sama diambil oleh dua pembalap dalam satu sesi balapan (kecuali DNF/luar poin).
            </p>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs px-4 py-2 rounded-md transition-colors"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
