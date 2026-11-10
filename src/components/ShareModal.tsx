import React, { useRef, useState, useEffect } from 'react';
import { AppState, CalculationResult, RiderId } from '../types/motogp';
import {
  BASE_STANDINGS,
  MAIN_OPTIONS,
  SPRINT_OPTIONS,
  copyToClipboard,
  generateShareText,
} from '../utils/calculator';
import {
  Check,
  Download,
  FileText,
  ImageIcon,
  Loader2,
  Trophy,
  X,
} from 'lucide-react';
import { toPng } from 'html-to-image';

const MARC_FEATURED_IMAGE = '/assets/aistudio/MM93_6ad47e61.webp';
const RACING_FEATURED_IMAGE = '/assets/aistudio/1788105990_112d33e7defd60939a6f_f9233dbc.webp';

const RIDER_PHOTOS: Record<RiderId, string> = {
  marc: '/assets/aistudio/Marc_M_rquez_112825ec.png',
  martin: '/assets/aistudio/Jorge_Mart_n_fe1dd5e0.png',
  bez: '/assets/aistudio/Marco_Bezzecchi_f3ef733c.png',
};

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  appState: AppState;
  result: CalculationResult;
}

const CAPTURE_OPTIONS = {
  cacheBust: true,
  pixelRatio: 2,
  backgroundColor: '#ffffff',
  skipFonts: true, // Prevents html-to-image from accessing cross-origin cssRules (SecurityError)
};

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  appState,
  result,
}) => {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsGenerating(true);
      setImageSrc(null);
      setStatusMessage(null);

      // Timeout to ensure DOM & rider photo assets are fully rendered before snapshotting
      const timer = setTimeout(() => {
        if (posterRef.current) {
          toPng(posterRef.current, CAPTURE_OPTIONS)
            .then((dataUrl) => {
              setImageSrc(dataUrl);
              setIsGenerating(false);
            })
            .catch((err) => {
              console.error('Failed to render white poster image', err);
              setIsGenerating(false);
              setStatusMessage('Gagal membuat preview gambar.');
            });
        }
      }, 450);

      return () => clearTimeout(timer);
    }
  }, [isOpen, appState, result]);

  if (!isOpen) return null;

  const handleDownloadImage = async () => {
    try {
      if (!posterRef.current) return;
      setIsGenerating(true);
      const dataUrl =
        imageSrc || (await toPng(posterRef.current, CAPTURE_OPTIONS));
      const link = document.createElement('a');
      link.download = `skenario-motogp-2026-portugal.png`;
      link.href = dataUrl;
      link.click();
      setStatusMessage('Gambar berhasil diunduh!');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error('Download image error', err);
      setStatusMessage('Gagal mengunduh gambar.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = async () => {
    const text = generateShareText(appState, result);
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedText(true);
      setStatusMessage('Teks ringkasan berhasil disalin!');
      setTimeout(() => setCopiedText(false), 2500);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const renderRiderBreakdownBadges = (id: RiderId) => {
    const st = appState[id];
    const spOpt = SPRINT_OPTIONS.find((o) => o.points === st.sprintPoints);
    const mpOpt = MAIN_OPTIONS.find((o) => o.points === st.mainPoints);
    const spText = spOpt
      ? `${spOpt.position} (${spOpt.points}p)`
      : st.sprintPoints !== null
      ? `${st.sprintPoints}p`
      : '0p (DNF)';
    const mpText = mpOpt
      ? `${mpOpt.position} (${mpOpt.points}p)`
      : st.mainPoints !== null
      ? `${st.mainPoints}p`
      : '0p (DNF)';

    return (
      <div className="flex items-center gap-1.5 flex-wrap mt-1">
        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-white text-gray-800 border border-gray-300 px-2 py-0.5 rounded-md shadow-2xs whitespace-nowrap">
          <span className="text-gray-500 font-semibold">Sprint:</span>
          <strong className="text-red-600 font-extrabold">{spText}</strong>
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-white text-gray-800 border border-gray-300 px-2 py-0.5 rounded-md shadow-2xs whitespace-nowrap">
          <span className="text-gray-500 font-semibold">Race Utama:</span>
          <strong className="text-blue-600 font-extrabold">{mpText}</strong>
        </span>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-sm font-black text-xs italic">
              GP
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                Bagikan skenario motogp
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Unduh poster gambar atau salin ringkasan teks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup modal"
            className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto">
          {/* Status Alert Toast */}
          {statusMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Image Preview Container */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-red-600" />
                Preview Gambar Poster (HD PNG)
              </span>
              {isGenerating && (
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Proses Gambar...
                </span>
              )}
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white shadow-md">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Preview Skenario Juara Dunia MotoGP 2026 Tema Putih"
                  className="w-full h-auto object-contain max-h-[380px] mx-auto block"
                />
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-2 p-6 bg-slate-50">
                  <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                  <span className="text-xs font-medium">Mempersiapkan poster gambar...</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons Grid (Hanya 2 Tombol: Unduh Gambar & Salin Teks) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Download PNG Button */}
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <Download className="w-4 h-4 text-white group-hover:translate-y-0.5 transition-transform" />
              <span>Unduh Gambar</span>
            </button>

            {/* Copy Text Summary Button */}
            <button
              type="button"
              onClick={handleCopyText}
              className={`flex items-center justify-center gap-2 ${
                copiedText
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white'
              } font-bold text-xs sm:text-sm px-4 py-3 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group`}
            >
              {copiedText ? (
                <>
                  <Check className="w-4 h-4 text-white animate-bounce" />
                  <span>Teks Tersalin!</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  <span>Salin Teks</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* HIDDEN POSTER RENDER CONTAINER - CLEAN HIGH-CONTRAST NEAT RIDER CARDS */}
        <div className="fixed top-[-9999px] left-[-9999px] pointer-events-none opacity-100">
          <div
            ref={posterRef}
            className="w-[720px] p-7 bg-white text-gray-900 font-sans relative overflow-hidden border-2 border-red-500/40"
          >
            {/* Top Red Racing Strip */}
            <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />

            {/* Header Poster */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4 pt-1">
              <div>
                <span className="inline-block bg-red-600 text-white font-black text-[11px] uppercase tracking-widest px-2.5 py-1 rounded italic mb-1.5">
                  MOTOGP 2026 • SERI QATAR
                </span>
                <h1 className="text-2xl font-black italic tracking-tight text-gray-900 uppercase leading-tight">
                  SKENARIO JUARA DUNIA MOTOGP
                </h1>
                <p className="text-xs text-red-600 font-bold italic mt-0.5">by iWant MotoLab</p>
              </div>
              <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 px-3.5 py-2 rounded-xl shrink-0">
                <img
                  src={RIDER_PHOTOS.marc}
                  alt="Marc Márquez"
                  className="w-10 h-10 rounded-full object-cover border-2 border-red-600 shadow-sm shrink-0"
                />
                <div className="text-right">
                  <div className="text-xs font-black text-red-600 uppercase tracking-tight flex items-center justify-end gap-1">
                    <span>Marc Márquez</span>
                    <span className="bg-red-600 text-white text-[9px] font-black px-1 rounded">#93</span>
                  </div>
                  <div className="text-[10px] font-semibold text-gray-500">Ducati Lenovo Team</div>
                </div>
              </div>
            </div>

            {/* Featured Photo Banner of Marc Márquez */}
            <div className="relative aspect-[21/9] w-full mb-5 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-slate-900">
              <img
                src={result.isChampion ? MARC_FEATURED_IMAGE : RACING_FEATURED_IMAGE}
                alt="Marc Márquez MotoGP"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                <div>
                  <span className="bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded italic">
                    {result.isChampion ? 'CHAMPIONSHIP CLINCH' : 'TITLE FIGHT TELEMETRY'}
                  </span>
                  <h3 className="text-lg font-black italic tracking-tight text-white drop-shadow-md mt-0.5 leading-snug">
                    {result.isChampion ? 'Marc Márquez Juara Dunia MotoGP 2026!' : 'Hasil Perolehan Poin Portugal'}
                  </h3>
                </div>
                {result.isChampion && (
                  <div className="bg-yellow-400 text-gray-950 font-black text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md shrink-0">
                    <Trophy className="w-4 h-4 text-gray-950 fill-gray-950" />
                    <span>WORLD CHAMPION</span>
                  </div>
                )}
              </div>
            </div>

            {/* Standings Table - Clean, Symmetrical Rider Cards for P1, P2, P3 */}
            <div className="space-y-3 mb-5">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 pb-1.5 border-b border-gray-200 flex justify-between">
                <span>Pembalap & Skenario Finis</span>
                <span className="text-right">Total Poin Akhir & Gap</span>
              </div>

              {/* Rider 1: Marc Márquez (P1) */}
              <div className="bg-red-50/90 border border-red-200 p-3.5 rounded-xl flex items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Rider Portrait Card (Matches simulation data style) */}
                  <div className="relative shrink-0 w-12 h-15 rounded-lg overflow-hidden border border-gray-200 bg-white shadow-2xs flex flex-col justify-between">
                    <img
                      src={RIDER_PHOTOS.marc}
                      alt="Marc Márquez"
                      className="w-full h-full object-cover object-[50%_15%]"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-red-600 text-white font-black text-[9px] text-center py-0.5 leading-none">
                      #93
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-gray-900 leading-none">Marc Márquez</span>
                      <span className="text-[9px] bg-red-600 text-white font-black px-1.5 py-0.5 rounded">
                        P1
                      </span>
                    </div>
                    {renderRiderBreakdownBadges('marc')}
                  </div>
                </div>

                <div className="text-right shrink-0 w-[210px]">
                  <div className="text-2xl font-black text-red-600 italic leading-none">
                    {result.marcTotal} <span className="text-xs font-bold not-italic text-red-500">pts</span>
                  </div>
                  <div className="text-[10px] font-bold text-red-700 bg-red-100 border border-red-200 px-2 py-0.5 rounded mt-1.5 inline-block">
                    Leader ({BASE_STANDINGS.marc} + {result.marcSessionPoints ?? 0})
                  </div>
                </div>
              </div>

              {/* Rider 2: Jorge Martín (P2) */}
              <div className="bg-purple-50/80 border border-purple-200 p-3.5 rounded-xl flex items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Rider Portrait Card (Matches simulation data style) */}
                  <div className="relative shrink-0 w-12 h-15 rounded-lg overflow-hidden border border-gray-200 bg-white shadow-2xs flex flex-col justify-between">
                    <img
                      src={RIDER_PHOTOS.martin}
                      alt="Jorge Martín"
                      className="w-full h-full object-cover object-[50%_15%]"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-purple-700 text-white font-black text-[9px] text-center py-0.5 leading-none">
                      #89
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-gray-900 leading-none">Jorge Martín</span>
                      <span className="text-[9px] bg-purple-100 text-purple-800 font-black px-1.5 py-0.5 rounded border border-purple-200">
                        P2
                      </span>
                    </div>
                    {renderRiderBreakdownBadges('martin')}
                  </div>
                </div>

                <div className="text-right shrink-0 w-[210px]">
                  <div className="text-xl font-black text-purple-700 italic leading-none">
                    {result.martinTotal} <span className="text-xs font-bold not-italic text-purple-600">pts</span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 mt-1.5">
                    <span className="text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded">
                      Selisih dari Marc: {result.advMartin} pts
                    </span>
                    <span className="text-[9px] font-semibold text-gray-500">
                      (Target Clinch: ≥{result.clinchThreshold} pts)
                    </span>
                  </div>
                </div>
              </div>

              {/* Rider 3: Marco Bezzecchi (P3) */}
              <div className="bg-purple-50/80 border border-purple-200 p-3.5 rounded-xl flex items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Rider Portrait Card (Matches simulation data style) */}
                  <div className="relative shrink-0 w-12 h-15 rounded-lg overflow-hidden border border-gray-200 bg-white shadow-2xs flex flex-col justify-between">
                    <img
                      src={RIDER_PHOTOS.bez}
                      alt="Marco Bezzecchi"
                      className="w-full h-full object-cover object-[50%_15%]"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-purple-700 text-white font-black text-[9px] text-center py-0.5 leading-none">
                      #72
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-gray-900 leading-none">Marco Bezzecchi</span>
                      <span className="text-[9px] bg-purple-100 text-purple-800 font-black px-1.5 py-0.5 rounded border border-purple-200">
                        P3
                      </span>
                    </div>
                    {renderRiderBreakdownBadges('bez')}
                  </div>
                </div>

                <div className="text-right shrink-0 w-[210px]">
                  <div className="text-xl font-black text-purple-700 italic leading-none">
                    {result.bezTotal} <span className="text-xs font-bold not-italic text-purple-600">pts</span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 mt-1.5">
                    <span className="text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded">
                      Selisih dari Marc: {result.advBez} pts
                    </span>
                    <span className="text-[9px] font-semibold text-gray-500">
                      (Target Clinch: ≥{result.clinchThreshold} pts)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Banner Poster (Tema Putih & Kontras Jelas) */}
            <div
              className={`p-4 rounded-xl border text-center mb-4 shadow-sm ${
                !result.hasSelection
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : result.isChampion
                  ? 'bg-emerald-600 border-emerald-700 text-white'
                  : 'bg-red-600 border-red-700 text-white'
              }`}
            >
              <h2 className="text-xl font-black italic uppercase tracking-tight mb-1 leading-tight">
                {!result.hasSelection
                  ? 'ℹ️ BELUM ADA PILIHAN SKENARIO'
                  : result.isChampion
                  ? '🏆 GELAR JUARA DUNIA TERKUNCI!'
                  : '⚠️ GELAR BELUM TERKUNCI'}
              </h2>
              <p className="text-xs font-medium leading-relaxed opacity-95 max-w-lg mx-auto">
                {!result.hasSelection
                  ? 'Silakan tentukan opsi poin/posisi finis balapan untuk melihat skenario juara.'
                  : result.isChampion
                  ? `Marc Márquez secara matematis telah mengunci gelar Juara Dunia MotoGP 2026 di GP Portugal!${(result.advMartin === result.clinchThreshold || result.advBez === result.clinchThreshold) ? ' (Aturan Tie-Break)' : ''}`
                  : 'Marc Marquez lanjut bertarung (melanjutkan race utama Portugal) atau di seri terakhir yaitu di sirkuit Valencia!!'}
              </p>
            </div>

            {/* Poster Footer Branding */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-[11px] text-gray-500 font-medium">
              <span>Simulasi Skenario Juara Dunia MotoGP 2026</span>
              <span className="font-bold text-red-600">iWant MotoLab</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
