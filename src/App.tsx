import React, { useState, useEffect } from 'react';
import { AppState, CalculationMode, RiderId } from './types/motogp';
import {
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

const STORAGE_KEY = 'motogp_simulator_state_v2';

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

  const [showRulesModal, setShowRulesModal] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [appState]);

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
        const sprintConflict = isPositionTaken(nextState, 'sprint', curSprint, riderId);
        if (sprintConflict.taken) {
          const availableSprint = SPRINT_OPTIONS.find(
            (opt) => !isPositionTaken(nextState, 'sprint', opt.points, riderId).taken
          );
          if (availableSprint) {
            nextState[riderId].sprintPoints = availableSprint.points;
          }
        }

        // Check main conflict
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

  const handleToggleMinimize = (riderId: RiderId) => {
    setAppState((prev) => ({
      ...prev,
      [riderId]: {
        ...prev[riderId],
        isMinimized: !prev[riderId].isMinimized,
      },
    }));
  };

  const handleReset = () => {
    setAppState(INITIAL_APP_STATE);
  };

  const calculationResult = calculateScenario(appState);

  return (
    <div className="antialiased min-h-screen pb-12 bg-slate-50 text-slate-900">
      <Header
        onReset={handleReset}
        onOpenRules={() => setShowRulesModal(true)}
      />

      <main className="max-w-3xl mx-auto px-3 sm:px-4 mt-4 sm:mt-6">
        <StandingsHeader />

        {/* Calculator Main Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-4 sm:mb-6 border-b border-gray-200 pb-3">
            <h2 className="motogp-font font-bold text-base sm:text-lg text-gray-900 uppercase tracking-tight">
              Kalkulator poin Qatar
            </h2>
            <span className="text-[11px] sm:text-xs text-gray-500 font-medium hidden sm:inline">
              Pilih posisi atau total poin per pembalap
            </span>
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
              onToggleMinimize={() => handleToggleMinimize('marc')}
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
              onToggleMinimize={() => handleToggleMinimize('martin')}
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
              onToggleMinimize={() => handleToggleMinimize('bez')}
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
    </div>
  );
}
