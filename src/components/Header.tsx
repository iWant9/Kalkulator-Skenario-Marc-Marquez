import React from 'react';
import { Youtube, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenRules?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, onToggleDarkMode }) => {
  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 sticky top-0 z-20 shadow-sm transition-colors">
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/assets/aistudio/Gemini_Generated_Image_9or7t09or7t09or7_6f32109d.jpg"
            alt="Logo iWant MotoLab"
            className="h-7 sm:h-9 w-auto object-contain rounded-md"
          />
          <span className="hidden sm:inline-block w-px h-5 bg-gray-200 dark:bg-slate-700 mx-1" />
          <div className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest hidden sm:block">
            2026 Title Simulator
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label="Ganti mode terang atau gelap"
            className="inline-flex items-center justify-center p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
            title={darkMode ? 'Ubah ke Mode Terang' : 'Ubah ke Mode Gelap'}
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
            <span className="hidden sm:inline ml-1 text-[11px]">{darkMode ? 'Terang' : 'Gelap'}</span>
          </button>

          <a
            href="https://youtube.com/@iwant_dc?si=5Y_Gnrj5q0yrKeq3"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#ff0000] hover:bg-[#cc0000] text-white text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-md shadow-xs transition-colors"
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
