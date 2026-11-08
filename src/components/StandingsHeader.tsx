import React from 'react';
import { BASE_STANDINGS } from '../utils/calculator';
import { Check, RotateCcw, Share2 } from 'lucide-react';

interface StandingsHeaderProps {
  onOpenSupport?: () => void;
  onReset?: () => void;
  onShare?: () => void;
  copied?: boolean;
  hasSelection?: boolean;
}

export const StandingsHeader: React.FC<StandingsHeaderProps> = ({
  onOpenSupport,
  onReset,
  onShare,
  copied = false,
  hasSelection = true,
}) => {
  return (
    <div className="mb-5">
      {/* Kotak Skenario Juara Dunia MotoGP - Modern Racing Style */}
      <div className="bg-white dark:bg-slate-900 border-2 border-red-500/30 dark:border-red-600/40 rounded-xl p-4 sm:p-6 mb-3 shadow-md relative overflow-hidden transition-colors racing-carbon">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 dark:bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5 pt-1">
          <div className="flex items-center gap-2.5">
            <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded italic">
              MOTOGP 2026
            </span>
          </div>
        </div>

        <h1 className="motogp-font font-black italic text-xl sm:text-3xl text-gray-900 dark:text-white uppercase tracking-tight mb-2">
          SKENARIO JUARA DUNIA MOTOGP
        </h1>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-red-600 dark:text-red-500 font-bold text-xs sm:text-sm italic">
            by iWant MotoLab
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed border-t border-gray-100 dark:border-slate-800 pt-3">
          Gunakan kalkulator telemetri ini untuk menguji apakah skenario perolehan poin Marc Márquez memenuhi syarat mutlak mengunci gelar Juara Dunia MotoGP 2026.
        </p>
      </div>

      {/* Tombol Action (Dukung, Share, Reset) */}
      <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
        {onShare && (
          <button
            type="button"
            onClick={onShare}
            disabled={!hasSelection}
            aria-label="Bagikan hasil skenario ke clipboard"
            className={`inline-flex items-center gap-2 ${
              copied
                ? 'bg-blue-600 dark:bg-blue-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white disabled:text-slate-500 dark:disabled:text-slate-500'
            } font-bold text-xs sm:text-sm px-4 py-2 sm:py-2.5 rounded-lg shadow-sm hover:shadow-md disabled:shadow-none transition-all cursor-pointer disabled:cursor-not-allowed group`}
            title={
              hasSelection
                ? 'Bagikan ringkasan skenario poin'
                : 'Pilih posisi atau poin balapan terlebih dahulu untuk membagikan hasil'
            }
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white animate-bounce" />
                <span>Ringkasan Tersalin!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Bagikan Hasil</span>
              </>
            )}
          </button>
        )}

        {onOpenSupport && (
          <button
            type="button"
            onClick={onOpenSupport}
            aria-label="Dukung Creator dengan QRIS"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-4 py-2 sm:py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer group"
            title="Dukung Creator via QRIS"
          >
            <span className="w-5 h-5 rounded-full bg-emerald-800/50 border border-emerald-300/50 flex items-center justify-center font-black text-xs text-white shadow-2xs group-hover:scale-105 transition-transform">
              $
            </span>
            <span>Dukung Creator</span>
          </button>
        )}

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            aria-label="Reset semua pilihan poin dan posisi finis"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs sm:text-sm px-4 py-2 sm:py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer group"
            title="Reset semua pilihan poin dan posisi finis"
          >
            <RotateCcw className="w-4 h-4 text-white group-hover:rotate-[-45deg] transition-transform" />
            <span>Reset Pilihan</span>
          </button>
        )}
      </div>

      {/* Tabel Informasi Poin Sekarang Rider (MotoGP official) */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-3 sm:p-4 mb-4 shadow-xs transition-colors">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-2 mb-2.5">
          <h2 className="text-[11px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Klasemen Poin Sebelum Seri Qatar
          </h2>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium hidden sm:inline">
            Sisa 3 Seri (Maks. 111 poin tersisa di musim)
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* Marc */}
          <div className="bg-red-50 dark:bg-red-950/40 p-2.5 sm:p-3 rounded-lg border border-red-200 dark:border-red-900/50 flex items-center justify-between transition-all hover:border-red-300 shadow-2xs">
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                Marc Márquez
                <span className="text-[9px] bg-red-600 text-white font-black px-1.5 py-0.5 rounded">#93</span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 font-medium">Pimpinan Klasemen</div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <span className="text-[10px] sm:text-[11px] text-red-700 dark:text-red-400 font-bold bg-red-100/90 dark:bg-red-900/40 border border-red-200 dark:border-red-800 px-2 py-0.5 rounded">
                Leader
              </span>
              <span className="text-sm sm:text-base font-black text-red-600 dark:text-red-500 italic">
                {BASE_STANDINGS.marc} pts
              </span>
            </div>
          </div>

          {/* Martin */}
          <div className="bg-purple-50 dark:bg-slate-800/80 p-2.5 sm:p-3 rounded-lg border border-purple-200 dark:border-slate-700 flex items-center justify-between transition-all hover:border-purple-300 shadow-2xs">
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                Jorge Martín
                <span className="text-[9px] bg-purple-600 text-white font-black px-1.5 py-0.5 rounded">#89</span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 font-medium">Peringkat 2 Klasemen</div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <span className="text-[10px] sm:text-[11px] text-red-600 dark:text-red-400 font-bold bg-red-100/90 dark:bg-red-950/60 border border-red-200 dark:border-red-900/50 px-2 py-0.5 rounded">
                Gap: -44 pts
              </span>
              <span className="text-sm sm:text-base font-black text-purple-700 dark:text-purple-400 italic">
                {BASE_STANDINGS.martin} pts
              </span>
            </div>
          </div>

          {/* Bezzecchi */}
          <div className="bg-purple-50 dark:bg-slate-800/80 p-2.5 sm:p-3 rounded-lg border border-purple-200 dark:border-slate-700 flex items-center justify-between transition-all hover:border-purple-300 shadow-2xs">
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                Marco Bezzecchi
                <span className="text-[9px] bg-purple-600 text-white font-black px-1.5 py-0.5 rounded">#72</span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 font-medium">Peringkat 3 Klasemen</div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <span className="text-[10px] sm:text-[11px] text-red-600 dark:text-red-400 font-bold bg-red-100/90 dark:bg-red-950/60 border border-red-200 dark:border-red-900/50 px-2 py-0.5 rounded">
                Gap: -67 pts
              </span>
              <span className="text-sm sm:text-base font-black text-purple-700 dark:text-purple-400 italic">
                {BASE_STANDINGS.bez} pts
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
