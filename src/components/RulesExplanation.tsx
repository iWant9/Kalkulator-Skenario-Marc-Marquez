import React from 'react';
import { X, Info } from 'lucide-react';
import { CLINCH_BEZ, CLINCH_MARTIN } from '../utils/calculator';

interface RulesExplanationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesExplanation: React.FC<RulesExplanationProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl relative transition-colors">
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup jendela aturan"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-3 text-red-600 dark:text-red-400 pr-8">
          <Info className="w-5 h-5 flex-shrink-0" />
          <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white motogp-font uppercase leading-snug">
            Penjelasan Skenario & Sistem Poin
          </h3>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg p-3 text-gray-700 dark:text-gray-300">
            <h4 className="font-bold text-gray-900 dark:text-white mb-1.5">Keterangan Persyaratan Kunci Gelar:</h4>
            <div className="space-y-1.5 leading-relaxed">
              <p>
                • <strong>Di Sprint Race:</strong> Poin akhir Marc Márquez setelah Sprint Race harus unggul minimal <strong>62 poin</strong> dari total poin Jorge Martín dan Marco Bezzecchi untuk mengunci gelar juara dunia di hari Sabtu.
              </p>
              <p>
                • <strong>Di Race Utama / Akhir Pekan:</strong> Jika gelar belum terkunci di Sprint, poin akhir Marc Márquez setelah balapan utama hari Minggu harus unggul minimal <strong>37 poin</strong> dari total poin Jorge Martín dan Marco Bezzecchi.
              </p>
              <p className="pt-1.5 border-t border-amber-200/50 dark:border-amber-900/50 text-[10px] sm:text-xs italic opacity-90">
                * Jika jumlah poin sama (seri) setelah sisa poin maksimum ditambahkan ke rival, Marc Márquez tetap mengunci gelar juara berdasarkan <strong>Aturan Tie-Break</strong> (unggul jumlah kemenangan).
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-1.5">Sistem Poin Resmi MotoGP:</h4>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="border border-gray-200 dark:border-slate-800 rounded p-2 bg-gray-50 dark:bg-slate-800/60">
                <span className="font-bold text-red-600 dark:text-red-400 block mb-1">Sprint Race</span>
                P1: 12, P2: 9, P3: 7, P4: 6, P5: 5, P6: 4, P7: 3, P8: 2, P9: 1 poin.
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-slate-800 pt-3">
            <h4 className="font-bold text-gray-900 dark:text-white mb-1">Fitur Anti-Duplikasi Posisi:</h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Jika dua rider atau lebih diatur dalam mode <em>Posisi</em>, simulator secara otomatis mencegah posisi yang sama diambil oleh dua pembalap dalam satu sesi balapan (kecuali DNF/luar poin).
            </p>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-gray-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-900 hover:bg-gray-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs px-4 py-2 rounded-md transition-colors cursor-pointer"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
