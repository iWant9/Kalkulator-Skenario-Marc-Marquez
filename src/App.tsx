import React, { useState, useEffect } from 'react';
import { AppState, RiderId, SimulationMode } from './types/motogp';
import {
  EMPTY_APP_STATE,
  INITIAL_APP_STATE,
  RIDER_CONFIGS,
  calculateScenario,
  copyToClipboard,
  generateShareText,
  isPositionTaken,
  MAIN_OPTIONS,
  SPRINT_OPTIONS,
} from './utils/calculator';
import { Header } from './components/Header';
import { StandingsHeader } from './components/StandingsHeader';
import { RiderCard } from './components/RiderCard';
import { ResultsPanel } from './components/ResultsPanel';
import { RulesExplanation } from './components/RulesExplanation';
import { SupportCreatorModal } from './components/SupportCreatorModal';
import { ShareModal } from './components/ShareModal';
import { Flag, Lock, Zap } from 'lucide-react';

const STORAGE_KEY = 'motogp_simulator_state_v2';
const SIMULATION_MODE_KEY = 'motogp_simulation_mode';
const DARK_MODE_KEY = 'motogp_dark_mode';

export default function App() {
  const [simulationMode, setSimulationMode] = useState<SimulationMode>('sprint');

  const [appState, setAppState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved state', e);
    }
    return INITIAL_APP_STATE;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(DARK_MODE_KEY);
      if (saved !== null) {
        const isDark = JSON.parse(saved);
        if (typeof window !== 'undefined') {
          if (isDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        return isDark;
      }
    } catch (e) {
      console.error('Failed to parse dark mode', e);
    }
    return false;
  });

  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [appState]);

  // Sync dark mode to localStorage and document root
  useEffect(() => {
    try {
      localStorage.setItem(DARK_MODE_KEY, JSON.stringify(darkMode));
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Failed to save dark mode', e);
    }
  }, [darkMode]);

  const handleSprintPointsChange = (riderId: RiderId, pts: number) => {
    setAppState((prev) => {
      const nextState = {
        ...prev,
        [riderId]: {
          ...prev[riderId],
          sprintPoints: pts,
        },
      };

      if (pts > 0) {
        (['marc', 'martin', 'bez'] as RiderId[]).forEach((otherId) => {
          if (otherId !== riderId && nextState[otherId].sprintPoints === pts) {
            const available = SPRINT_OPTIONS.find(
              (opt) => opt.points !== pts && !isPositionTaken(nextState, 'sprint', opt.points, otherId).taken
            );
            if (available) {
              nextState[otherId] = {
                ...nextState[otherId],
                sprintPoints: available.points,
              };
            }
          }
        });
      }

      return nextState;
    });
  };

  const handleMainPointsChange = (riderId: RiderId, pts: number) => {
    setAppState((prev) => {
      const nextState = {
        ...prev,
        [riderId]: {
          ...prev[riderId],
          mainPoints: pts,
        },
      };

      if (pts > 0) {
        (['marc', 'martin', 'bez'] as RiderId[]).forEach((otherId) => {
          if (otherId !== riderId && nextState[otherId].mainPoints === pts) {
            const available = MAIN_OPTIONS.find(
              (opt) => opt.points !== pts && !isPositionTaken(nextState, 'main', opt.points, otherId).taken
            );
            if (available) {
              nextState[otherId] = {
                ...nextState[otherId],
                mainPoints: available.points,
              };
            }
          }
        });
      }

      return nextState;
    });
  };

  const handleReset = () => {
    setAppState(EMPTY_APP_STATE);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear localStorage', e);
    }
  };

  // Sync simulation mode to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SIMULATION_MODE_KEY, simulationMode);
    } catch (e) {
      console.error('Failed to save simulation mode to localStorage', e);
    }
  }, [simulationMode]);

  const calculationResult = calculateScenario(appState, simulationMode);

  const handleShare = () => {
    if (!calculationResult.hasSelection) return;
    setShowShareModal(true);
  };

  return (
    <div className="antialiased min-h-screen pb-12 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenRules={() => setShowRulesModal(true)}
      />

      <main className="max-w-3xl mx-auto px-3 sm:px-4 mt-4 sm:mt-6">
        <StandingsHeader
          onOpenSupport={() => setShowSupportModal(true)}
          onReset={handleReset}
          onShare={handleShare}
          copied={copied}
          hasSelection={calculationResult.hasSelection}
        />

        {/* Calculator Main Card */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-3 sm:p-6 md:p-8 shadow-sm transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 border-b border-gray-200 dark:border-slate-800 pb-3 gap-3">
            <div>
              <h2 className="motogp-font font-bold text-base sm:text-lg text-gray-900 dark:text-white uppercase tracking-tight">
                Kalkulator poin Portugal
              </h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                Pilih opsi simulasi: penguncian Sabtu (Sprint) atau penentuan akhir pekan (Semua Race)
              </p>
            </div>

            {/* Pilihan 2 Simulasi: "Sprint Race" vs "Semua Race" */}
            <div className="inline-flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl border border-gray-200 dark:border-slate-700 shadow-2xs self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setSimulationMode('sprint')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide transition-all cursor-pointer ${
                  simulationMode === 'sprint'
                    ? 'bg-red-600 text-white shadow-xs scale-[1.02]'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Sprint Race</span>
              </button>

              <button
                type="button"
                disabled={true}
                title="Fitur Semua Race terkunci sementara"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-500 bg-gray-200/50 dark:bg-slate-700/50 border border-transparent"
              >
                <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Semua Race</span>
                <span className="text-[9px] font-extrabold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900/50 ml-0.5">
                  🔒 Terkunci
                </span>
              </button>
            </div>
          </div>



          <form id="calculator-form" onSubmit={(e) => e.preventDefault()}>
            {/* Section 1: Marc Marquez */}
            <RiderCard
              config={RIDER_CONFIGS.marc}
              state={appState.marc}
              appState={appState}
              simulationMode={simulationMode}
              onChangeSprintPoints={(p) => handleSprintPointsChange('marc', p)}
              onChangeMainPoints={(p) => handleMainPointsChange('marc', p)}
            />

            {/* Section 2: Jorge Martin */}
            <RiderCard
              config={RIDER_CONFIGS.martin}
              state={appState.martin}
              appState={appState}
              simulationMode={simulationMode}
              onChangeSprintPoints={(p) => handleSprintPointsChange('martin', p)}
              onChangeMainPoints={(p) => handleMainPointsChange('martin', p)}
            />

            {/* Section 3: Marco Bezzecchi */}
            <RiderCard
              config={RIDER_CONFIGS.bez}
              state={appState.bez}
              appState={appState}
              simulationMode={simulationMode}
              onChangeSprintPoints={(p) => handleSprintPointsChange('bez', p)}
              onChangeMainPoints={(p) => handleMainPointsChange('bez', p)}
            />

            {/* Results Section */}
            <ResultsPanel
              result={calculationResult}
              onShare={handleShare}
              copied={copied}
            />
          </form>
        </div>
      </main>

      <RulesExplanation
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
      />

      <SupportCreatorModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        appState={appState}
        result={calculationResult}
      />
    </div>
  );
}
