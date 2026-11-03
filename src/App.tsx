import React, { useState, useEffect } from 'react';
import { AppState, CalculationMode, RiderId } from './types/motogp';
import {
  EMPTY_APP_STATE,
  INITIAL_APP_STATE,
  RIDER_CONFIGS,
  calculateScenario,
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

const STORAGE_KEY = 'motogp_simulator_state_v2';
const DARK_MODE_KEY = 'motogp_dark_mode';

export default function App() {
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

  // Mode change handler
  const handleModeChange = (riderId: RiderId, mode: CalculationMode) => {
    setAppState((prev) => {
      const nextState: AppState = {
        ...prev,
        [riderId]: {
          ...prev[riderId],
          mode,
        },
      };

      // If switched to 'posisi', ensure current sprint and main positions don't conflict
      if (mode === 'posisi') {
        const curSprint = nextState[riderId].sprintPoints;
        const curMain = nextState[riderId].mainPoints;

        // Check sprint conflict
        if (curSprint !== null && curSprint > 0) {
          const sprintConflict = isPositionTaken(nextState, 'sprint', curSprint, riderId);
          if (sprintConflict.taken) {
            const availableSprint = SPRINT_OPTIONS.find(
              (opt) => !isPositionTaken(nextState, 'sprint', opt.points, riderId).taken
            );
            if (availableSprint) {
              nextState[riderId].sprintPoints = availableSprint.points;
            }
          }
        }

        // Check main conflict
        if (curMain !== null && curMain > 0) {
          const mainConflict = isPositionTaken(nextState, 'main', curMain, riderId);
          if (mainConflict.taken) {
            const availableMain = MAIN_OPTIONS.find(
              (opt) => !isPositionTaken(nextState, 'main', opt.points, riderId).taken
            );
            if (availableMain) {
              nextState[riderId].mainPoints = availableMain.points;
            }
          }
        }
      }

      return nextState;
    });
  };

  const handleTotalPointsChange = (riderId: RiderId, pts: number) => {
    setAppState((prev) => ({
      ...prev,
      [riderId]: {
        ...prev[riderId],
        totalPoints: pts,
      },
    }));
  };

  const handleSprintPointsChange = (riderId: RiderId, pts: number) => {
    setAppState((prev) => {
      const nextState = {
        ...prev,
        [riderId]: {
          ...prev[riderId],
          sprintPoints: pts,
        },
      };

      // If another rider was also on this positive position in 'posisi' mode, move them to an available position
      if (pts > 0) {
        (['marc', 'martin', 'bez'] as RiderId[]).forEach((otherId) => {
          if (otherId !== riderId && nextState[otherId].mode === 'posisi' && nextState[otherId].sprintPoints === pts) {
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

      // If another rider was also on this positive position in 'posisi' mode, move them to an available position
      if (pts > 0) {
        (['marc', 'martin', 'bez'] as RiderId[]).forEach((otherId) => {
          if (otherId !== riderId && nextState[otherId].mode === 'posisi' && nextState[otherId].mainPoints === pts) {
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

  const calculationResult = calculateScenario(appState);

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
        />

        {/* Calculator Main Card */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-3 sm:p-6 md:p-8 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-4 sm:mb-6 border-b border-gray-200 dark:border-slate-800 pb-3">
            <h2 className="motogp-font font-bold text-base sm:text-lg text-gray-900 dark:text-white uppercase tracking-tight">
              Kalkulator poin Qatar
            </h2>
          </div>

          <form id="calculator-form" onSubmit={(e) => e.preventDefault()}>
            {/* Section 1: Marc Marquez */}
            <RiderCard
              config={RIDER_CONFIGS.marc}
              state={appState.marc}
              appState={appState}
              onChangeMode={(m) => handleModeChange('marc', m)}
              onChangeTotalPoints={(p) => handleTotalPointsChange('marc', p)}
              onChangeSprintPoints={(p) => handleSprintPointsChange('marc', p)}
              onChangeMainPoints={(p) => handleMainPointsChange('marc', p)}
            />

            {/* Section 2: Jorge Martin */}
            <RiderCard
              config={RIDER_CONFIGS.martin}
              state={appState.martin}
              appState={appState}
              onChangeMode={(m) => handleModeChange('martin', m)}
              onChangeTotalPoints={(p) => handleTotalPointsChange('martin', p)}
              onChangeSprintPoints={(p) => handleSprintPointsChange('martin', p)}
              onChangeMainPoints={(p) => handleMainPointsChange('martin', p)}
            />

            {/* Section 3: Marco Bezzecchi */}
            <RiderCard
              config={RIDER_CONFIGS.bez}
              state={appState.bez}
              appState={appState}
              onChangeMode={(m) => handleModeChange('bez', m)}
              onChangeTotalPoints={(p) => handleTotalPointsChange('bez', p)}
              onChangeSprintPoints={(p) => handleSprintPointsChange('bez', p)}
              onChangeMainPoints={(p) => handleMainPointsChange('bez', p)}
            />

            {/* Results Section */}
            <ResultsPanel result={calculationResult} />
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
    </div>
  );
}
