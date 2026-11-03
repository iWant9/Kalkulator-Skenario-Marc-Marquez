import React, { useEffect } from 'react';
import { X, Download, Heart } from 'lucide-react';

interface SupportCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QRIS_IMAGE_PATH = '/assets/aistudio/qr_ID1021106884617_03.11.26_1793690447_1793690447440_3d54263d.jpeg';

export const SupportCreatorModal: React.FC<SupportCreatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 dark:border-slate-800 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-black text-sm text-white shadow-xs">
              $
            </div>
            <div>
              <h3 id="support-modal-title" className="font-bold text-base sm:text-lg leading-tight">
                Dukung Creator
              </h3>
              <p className="text-emerald-100 text-xs font-medium">
                iWant MotoLab • Iwan Store
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup dialog"
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-center">
          <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-3 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
            <p className="font-semibold flex items-center justify-center gap-1.5 text-emerald-800 dark:text-emerald-300 mb-1">
              <Heart className="w-4 h-4 fill-emerald-600 text-emerald-600 dark:fill-emerald-400 dark:text-emerald-400 inline" />
              Terima Kasih atas Dukungan Anda!
            </p>
            Scan kode QRIS resmi di bawah ini menggunakan aplikasi m-banking atau e-wallet pilihan Anda.
          </div>

          {/* QR Code Card */}
          <div className="bg-white dark:bg-slate-800 p-2.5 sm:p-3 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm inline-block max-w-[320px] w-full mx-auto">
            <div className="overflow-hidden rounded-lg border border-gray-100 dark:border-slate-700">
              <img
                src={QRIS_IMAGE_PATH}
                alt="QRIS Donasi Dukung Creator - Iwan Store NMID ID1021106884617"
                className="w-full h-auto object-contain block select-none"
              />
            </div>
          </div>

          {/* Supported Methods Badges */}
          <div className="pt-1">
            <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Mendukung Semua Pembayaran QRIS:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-bold text-gray-700 dark:text-gray-300">
              {['BCA Mobile', 'GoPay', 'OVO', 'DANA', 'ShopeePay', 'Livin by Mandiri', 'BRImo', 'LinkAja'].map((method) => (
                <span
                  key={method}
                  className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 px-2 py-0.5 rounded-md transition-colors"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal pt-1 border-t border-gray-100 dark:border-slate-800">
            Dukungan Anda membantu kreator terus menghadirkan konten analisis balap dan simulasi MotoGP yang menarik di YouTube <span className="font-semibold text-gray-700 dark:text-gray-200">iWant MotoLab</span>.
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-slate-800/80 border-t border-gray-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
          <a
            href={QRIS_IMAGE_PATH}
            download="QRIS_iWant_MotoLab.jpeg"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Simpan QRIS</span>
          </a>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-300 dark:border-slate-600 px-4 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
