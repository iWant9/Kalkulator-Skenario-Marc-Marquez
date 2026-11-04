import React, { useEffect, useRef } from 'react';
import { CalculationResult } from '../types/motogp';
import { CLINCH_BEZ, CLINCH_MARTIN } from '../utils/calculator';
import { Award, CheckCircle2, Info, Trophy, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const CHAMPION_IMG = '/assets/aistudio/MM93_6ad47e61.webp';
const RACING_IMG = '/assets/aistudio/1788105990_112d33e7defd60939a6f_f9233dbc.webp';
const PORTUGAL_TRACK_IMG = '/assets/aistudio/Screenshot_2026-11-03_135842_7fbae839.png';
const VALENCIA_TRACK_IMG = '/assets/aistudio/images_9a3888a0.png';

interface ResultsPanelProps {
  result: CalculationResult;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ result }) => {
  const {
    marcTotal,
    martinTotal,
    bezTotal,
    advMartin,
    advBez,
    isMartinClenched,
    isBezClenched,
    isChampion,
  } = result;

  const prevIsChampionRef = useRef<boolean>(false);

  useEffect(() => {
    if (isChampion && !prevIsChampionRef.current) {
      try {
        const duration = 3.5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

        const randomInRange = (min: number, max: number) => {
          return Math.random() * (max - min) + min;
        };

        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        document.body.appendChild(canvas);

        const customConfetti = (typeof (confetti as any).create === 'function')
          ? (confetti as any).create(canvas, { resize: true, useWorker: false })
          : confetti;

        const interval = window.setInterval(() => {
          try {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
              clearInterval(interval);
              canvas.remove();
              return;
            }
            const particleCount = 50 * (timeLeft / duration);
            customConfetti({
              ...defaults,
              particleCount,
              origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
              colors: ['#e20613', '#ffcc00', '#ffffff', '#22c55e'],
            });
            customConfetti({
              ...defaults,
              particleCount,
              origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
              colors: ['#e20613', '#ffcc00', '#ffffff', '#22c55e'],
            });
          } catch (err) {
            // Suppress confetti interval errors
          }
        }, 250);
      } catch (err) {
        // Suppress confetti init errors
      }
    }
    prevIsChampionRef.current = isChampion;
  }, [isChampion]);

  // Percentage progress toward target (capped between 0 and 100%)
  const martinProgress = Math.min(Math.max(Math.round((advMartin / CLINCH_MARTIN) * 100), 0), 100);
  const bezProgress = Math.min(Math.max(Math.round((advBez / CLINCH_BEZ) * 100), 0), 100);

  return (
    <div className="pt-4 sm:pt-6 border-t border-gray-200 dark:border-slate-800 transition-colors">
      {/* Total Poin Akhir Summary Cards (Horizontal Layout) */}
      <div className="grid grid-cols-1 gap-2.5 mb-5 sm:mb-6">
        <div className="bg-red-50 dark:bg-red-950/40 p-3 sm:p-3.5 rounded-lg border border-red-200 dark:border-red-900/50 flex items-center justify-between gap-2 transition-all shadow-2xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
              Total Poin Akhir Marc
            </span>
            <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">
              (399 + {result.marcSessionPoints !== null ? result.marcSessionPoints : '-'})
            </span>
          </div>
          <span id="total-marc" className="text-base sm:text-xl font-black text-red-600 dark:text-red-500 italic tracking-tight shrink-0">
            {marcTotal} poin
          </span>
        </div>

        <div className="bg-purple-50 dark:bg-slate-800/80 p-3 sm:p-3.5 rounded-lg border border-purple-200 dark:border-slate-700 flex items-center justify-between gap-2 transition-all shadow-2xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
              Total Poin Akhir Martín
            </span>
            <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">
              (355 + {result.martinSessionPoints !== null ? result.martinSessionPoints : '-'})
            </span>
          </div>
          <span id="total-martin" className="text-base sm:text-xl font-black text-purple-700 dark:text-purple-400 italic tracking-tight shrink-0">
            {martinTotal} poin
          </span>
        </div>

        <div className="bg-purple-50 dark:bg-slate-800/80 p-3 sm:p-3.5 rounded-lg border border-purple-200 dark:border-slate-700 flex items-center justify-between gap-2 transition-all shadow-2xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
              Total Poin Akhir Bezzecchi
            </span>
            <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">
              (332 + {result.bezSessionPoints !== null ? result.bezSessionPoints : '-'})
            </span>
          </div>
          <span id="total-bez" className="text-base sm:text-xl font-black text-purple-700 dark:text-purple-400 italic tracking-tight shrink-0">
            {bezTotal} poin
          </span>
        </div>
      </div>

      {/* Advantage vs Martin */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-3 sm:p-3.5 mb-2.5 shadow-2xs">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1.5">
            {isMartinClenched ? (
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500 inline flex-shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500 inline flex-shrink-0" />
            )}
            Keunggulan atas Martín
          </span>
          <span
            id="adv-martin"
            className={`text-xs sm:text-sm font-bold ${
              isMartinClenched ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}
          >
            {advMartin} poin
          </span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isMartinClenched ? 'bg-green-600' : 'bg-red-500'
            }`}
            style={{ width: `${martinProgress}%` }}
          />
        </div>
        {!isMartinClenched && (
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
            Kurang {CLINCH_MARTIN - advMartin} poin untuk mengunci dari Martín
          </p>
        )}
      </div>

      {/* Advantage vs Bezzecchi */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-3 sm:p-3.5 mb-4 sm:mb-6 shadow-2xs">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1.5">
            {isBezClenched ? (
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500 inline flex-shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500 inline flex-shrink-0" />
            )}
            Keunggulan atas Bezzecchi
          </span>
          <span
            id="adv-bez"
            className={`text-xs sm:text-sm font-bold ${
              isBezClenched ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}
          >
            {advBez} poin
          </span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isBezClenched ? 'bg-green-600' : 'bg-red-500'
            }`}
            style={{ width: `${bezProgress}%` }}
          />
        </div>
        {!isBezClenched && (
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
            Kurang {CLINCH_BEZ - advBez} poin untuk mengunci dari Bezzecchi
          </p>
        )}
      </div>

      {/* Prominent Status Banner Right Below Results */}
      {result.hasSelection && (
        <div className={`mb-4 p-4 sm:p-5 rounded-xl border text-center shadow-md transition-colors ${
          isChampion
            ? 'bg-emerald-600 dark:bg-emerald-950 text-white border-emerald-500 racing-glow-gold'
            : 'bg-red-600 dark:bg-red-950 text-white border-red-500 racing-glow-red'
        }`}>
          <h3 className="motogp-font font-black italic text-xl sm:text-3xl uppercase tracking-tight text-white drop-shadow-md">
            {isChampion ? '🏆 GELAR JUARA DUNIA TERKUNCI!' : '⚠️ GELAR BELUM TERKUNCI'}
          </h3>
          <p className="text-xs sm:text-sm text-gray-100 mt-1 max-w-xl mx-auto font-medium">
            {isChampion
              ? 'Marc Márquez secara matematis telah mengunci gelar Juara Dunia MotoGP 2026 di GP Qatar!'
              : 'Perebutan gelar juara dunia berlanjut ke 2 seri sisa: GP Portugal (Portimão) & GP Valencia (Ricardo Tormo).'}
          </p>
        </div>
      )}

      {/* Status Container with Dynamic Images or Empty State */}
      <div
        id="status-container"
        className={`rounded-xl border overflow-hidden transition-all shadow-sm ${
          !result.hasSelection
            ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900/50'
            : isChampion
            ? 'bg-gradient-to-b from-green-50 to-emerald-100/50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-300 dark:border-green-800'
            : 'bg-gradient-to-b from-slate-50 to-red-50/50 dark:from-slate-900 dark:to-red-950/30 border-red-200 dark:border-red-900/50'
        }`}
      >
        {!result.hasSelection ? (
          <div className="p-6 sm:p-8 text-center bg-white dark:bg-slate-900 border-b border-amber-200 dark:border-amber-900/40">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 border border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 mb-3 shadow-2xs">
              <Info className="w-6 h-6" />
            </div>
            <h4
              id="status-title"
              className="font-black tracking-tight text-base sm:text-xl text-gray-900 dark:text-white"
            >
              belum ada memilih poin atau posisi finish
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">
              Silakan tentukan opsi poin atau posisi balapan untuk memulai kalkulasi
            </p>
          </div>
        ) : (
          /* Dynamic Image Banner */
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-slate-950">
            <img
              src={isChampion ? CHAMPION_IMG : RACING_IMG}
              alt={
                isChampion
                  ? 'Marc Márquez Pose Juara Memeluk Piala Juara Dunia MotoGP 2026'
                  : 'Marc Márquez Melaju dengan Motor Ducati #93'
              }
              className="w-full h-full object-cover object-center transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

            {/* Badge Overlay */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
              {isChampion ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/90 text-white font-black text-xs uppercase tracking-wider backdrop-blur-xs shadow-md">
                  <Trophy className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                  World Champion 2026
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-xs shadow-md">
                  <Award className="w-3.5 h-3.5" />
                  Title Fight Continues
                </span>
              )}
            </div>

            {/* Subtext on bottom of image */}
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 text-white">
              <h4
                id="status-title"
                className={`font-black tracking-tight text-base sm:text-xl drop-shadow-md ${
                  isChampion ? 'text-yellow-300' : 'text-white'
                }`}
              >
                {isChampion ? 'Gelar Juara Dunia Terkunci!' : 'Gelar belum terkunci'}
              </h4>
              <p className="text-xs sm:text-sm text-gray-200 font-medium drop-shadow-sm mt-0.5">
                {isChampion
                  ? 'Marc Márquez resmi mengunci gelar Juara Dunia MotoGP 2026!'
                  : 'Marc Márquez melaju menatap 2 seri penentu: GP Portugal (Portimão) & GP Valencia (Ricardo Tormo)'}
              </p>
            </div>
          </div>
        )}

        {/* Text Details Description / Circuit Maps below the image */}
        {(!result.hasSelection || (!isChampion && result.hasSelection)) && (
          <div className="p-3.5 sm:p-5">
            {!result.hasSelection && (
              <p id="status-desc" className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                belum ada memilih poin atau posisi finish. Silakan tentukan opsi total poin atau pilih posisi finis (Sprint Race & Race Utama) untuk Marc Márquez, Jorge Martín, dan Marco Bezzecchi pada menu kalkulator di atas guna melihat perolehan poin dan skenario juara dunia MotoGP 2026.
              </p>
            )}

            {/* If NOT clenched and HAS selection: Show Circuit Maps for Portugal & Valencia */}
            {result.hasSelection && !isChampion && (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                    Peta 2 Sirkuit Penentu Tersisa:
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Maks. 74 Poin Tersedia</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Circuit 1: Portimao Portugal */}
                  <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-2.5 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1.5 border-b border-gray-100 dark:border-slate-800 pb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">🇵🇹</span>
                        <span className="text-xs font-bold text-gray-900 dark:text-white">Sirkuit Portimão</span>
                      </div>
                      <span className="text-[9px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-1.5 py-0.5 rounded border border-red-200 dark:border-red-900/50">
                        GP Portugal (Seri 21)
                      </span>
                    </div>
                    <div className="aspect-[2/1] w-full flex items-center justify-center overflow-hidden rounded bg-slate-50 dark:bg-slate-950 p-1">
                      <img
                        src={PORTUGAL_TRACK_IMG}
                        alt="Peta Sirkuit Autódromo Internacional do Algarve Portimão Portugal"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
                      <span>15 Tikungan</span>
                      <span>Panjang: 4.592 km</span>
                    </div>
                  </div>

                  {/* Circuit 2: Valencia Ricardo Tormo */}
                  <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-2.5 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1.5 border-b border-gray-100 dark:border-slate-800 pb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">🇪🇸</span>
                        <span className="text-xs font-bold text-gray-900 dark:text-white">Sirkuit Valencia</span>
                      </div>
                      <span className="text-[9px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900/50">
                        GP Valencia (Seri 22)
                      </span>
                    </div>
                    <div className="aspect-[2/1] w-full flex items-center justify-center overflow-hidden rounded bg-slate-50 dark:bg-slate-950 p-1">
                      <img
                        src={VALENCIA_TRACK_IMG}
                        alt="Peta Sirkuit Ricardo Tormo Valencia"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
                      <span>14 Tikungan</span>
                      <span>Panjang: 4.005 km</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
