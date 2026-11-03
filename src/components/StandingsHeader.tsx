import React from 'react';
import { RiderAvatar } from './RiderAvatar';
import { BASE_STANDINGS } from '../utils/calculator';

export const StandingsHeader: React.FC = () => {
  return (
    <div className="mb-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
        <h1 className="motogp-font font-black text-lg sm:text-2xl text-gray-900 uppercase tracking-tight">
          SKENARIO JUARA DUNIA MOTOGP
        </h1>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className="text-[#e20613] font-bold text-xs sm:text-sm italic">
          by iWant MotoLab
        </span>
        <span className="text-gray-300">•</span>
        <span className="text-gray-500 text-xs font-medium">
          Simulasi Penentu Gelar Seri Qatar
        </span>
      </div>

      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4">
        Gunakan kalkulator sederhana ini untuk melihat apakah skenario hasil Marc memenuhi batas poin terhadap kedua rival. Dengan asumsi GP Qatar berjalan normal.
      </p>

      {/* Tabel Informasi Poin Sekarang Rider (MotoGP official) */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 mb-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2.5">
          <h2 className="text-[11px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">
            Klasemen Poin Sebelum Seri Qatar
          </h2>
          <span className="text-[10px] text-gray-400 font-medium hidden sm:inline">
            Sisa 3 Seri (Maks. 111 poin tersisa di musim)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          {/* Marc */}
          <div className="bg-red-50 p-2.5 sm:p-3 rounded-lg border border-red-200 flex flex-col justify-between transition-all hover:border-red-300 shadow-2xs">
            <div className="flex items-center gap-2.5 mb-2.5">
              <RiderAvatar riderId="marc" name="Marc Márquez" number="93" size="sm" />
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1">
                  Marc Márquez
                  <span className="text-[9px] bg-red-600 text-white font-black px-1 rounded">#93</span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-gray-500 font-medium">Pimpinan Klasemen</div>
              </div>
            </div>
            <div className="pt-2 border-t border-red-200/70 flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] text-red-700 font-bold bg-red-100/90 border border-red-200 px-1.5 py-0.5 rounded">
                Leader
              </span>
              <span className="text-sm sm:text-base font-black text-red-600 italic">
                {BASE_STANDINGS.marc} pts
              </span>
            </div>
          </div>

          {/* Martin */}
          <div className="bg-purple-50 p-2.5 sm:p-3 rounded-lg border border-purple-200 flex flex-col justify-between transition-all hover:border-purple-300 shadow-2xs">
            <div className="flex items-center gap-2.5 mb-2.5">
              <RiderAvatar riderId="martin" name="Jorge Martín" number="89" size="sm" />
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1">
                  Jorge Martín
                  <span className="text-[9px] bg-purple-600 text-white font-black px-1 rounded">#89</span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-gray-500 font-medium">Peringkat 2 Klasemen</div>
              </div>
            </div>
            <div className="pt-2 border-t border-purple-200/70 flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] text-red-600 font-bold bg-red-100/90 border border-red-200 px-1.5 py-0.5 rounded">
                Gap: -44 pts
              </span>
              <span className="text-sm sm:text-base font-black text-purple-700 italic">
                {BASE_STANDINGS.martin} pts
              </span>
            </div>
          </div>

          {/* Bezzecchi */}
          <div className="bg-purple-50 p-2.5 sm:p-3 rounded-lg border border-purple-200 flex flex-col justify-between transition-all hover:border-purple-300 shadow-2xs">
            <div className="flex items-center gap-2.5 mb-2.5">
              <RiderAvatar riderId="bez" name="Marco Bezzecchi" number="72" size="sm" />
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1">
                  Marco Bezzecchi
                  <span className="text-[9px] bg-purple-600 text-white font-black px-1 rounded">#72</span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-gray-500 font-medium">Peringkat 3 Klasemen</div>
              </div>
            </div>
            <div className="pt-2 border-t border-purple-200/70 flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] text-red-600 font-bold bg-red-100/90 border border-red-200 px-1.5 py-0.5 rounded">
                Gap: -67 pts
              </span>
              <span className="text-sm sm:text-base font-black text-purple-700 italic">
                {BASE_STANDINGS.bez} pts
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
