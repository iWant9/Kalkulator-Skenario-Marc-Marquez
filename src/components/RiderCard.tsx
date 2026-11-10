import React, { useState } from 'react';
import { AppState, RiderConfig, RiderState, SimulationMode } from '../types/motogp';
import { MAIN_OPTIONS, SPRINT_OPTIONS, calculateRiderSessionPoints, isPositionTaken } from '../utils/calculator';
import { RiderAvatar } from './RiderAvatar';
import { ChevronDown, X } from 'lucide-react';

interface RiderCardProps {
  config: RiderConfig;
  state: RiderState;
  appState: AppState;
  simulationMode?: SimulationMode;
  onChangeSprintPoints: (pts: number) => void;
  onChangeMainPoints: (pts: number) => void;
}

export const RiderCard: React.FC<RiderCardProps> = ({
  config,
  state,
  appState,
  simulationMode = 'semua',
  onChangeSprintPoints,
  onChangeMainPoints,
}) => {
  const [showSprintPicker, setShowSprintPicker] = useState(false);
  const [showMainPicker, setShowMainPicker] = useState(false);

  const sessionPoints = calculateRiderSessionPoints(state, simulationMode);
  const isMarc = config.id === 'marc';

  const cardContainerClass = isMarc
    ? 'bg-red-100 dark:bg-red-950/30 border-red-300 dark:border-red-900/60'
    : 'bg-purple-100 dark:bg-slate-900 border-purple-300 dark:border-slate-800';

  const headerBorderClass = isMarc ? 'border-red-200 dark:border-red-900/50' : 'border-purple-200 dark:border-slate-800';

  const selectedSprintOpt = SPRINT_OPTIONS.find((opt) => opt.points === state.sprintPoints);
  const selectedMainOpt = MAIN_OPTIONS.find((opt) => opt.points === state.mainPoints);

  return (
    <div
      id={`section-${config.id}`}
      className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg border shadow-xs transition-all duration-300 ${cardContainerClass}`}
    >
      {/* Rider Header Bar */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2.5 border-b pb-3 ${headerBorderClass}`}
      >
        <div className="flex items-center gap-2.5">
          <RiderAvatar
            riderId={config.id}
            name={config.name}
            number={config.number}
            size="md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">{config.name}</h3>
              <span
                className={`text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded text-white ${
                  isMarc ? 'bg-red-600' : 'bg-purple-600'
                }`}
              >
                {config.number}
              </span>
            </div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
              {config.role}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2.5 flex-wrap">
          <div className="text-left sm:text-right">
            <span className="text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 block sm:inline">Poin Seri Ini: </span>
            <span
              id={`points-${config.id}`}
              className="text-base sm:text-lg font-black text-amber-700 dark:text-amber-500 italic ml-1"
            >
              {sessionPoints !== null ? sessionPoints : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Position Selection Buttons (Sprint Race & Race Utama) */}
      <div className={`grid gap-3 ${simulationMode === 'sprint' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
        {/* Sprint Race Button Trigger */}
        <div className="bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-3 rounded-lg flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600" /> Sprint Race
            </span>
            {state.sprintPoints !== null && (
              <span className="text-[10px] font-bold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 px-1.5 py-0.5 rounded">
                {selectedSprintOpt ? `${selectedSprintOpt.label}` : `${state.sprintPoints} pts`}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowSprintPicker(true)}
            className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs py-2 px-3 rounded-md shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{state.sprintPoints !== null ? 'Ubah Posisi Sprint' : 'Pilih Posisi Sprint'}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Race Utama Button Trigger (Only shown in 'semua' mode) */}
        {simulationMode === 'semua' && (
          <div className="bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 p-3 rounded-lg flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] sm:text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" /> Race Utama
              </span>
              {state.mainPoints !== null && (
                <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded">
                  {selectedMainOpt ? `${selectedMainOpt.label}` : `${state.mainPoints} pts`}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowMainPicker(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs py-2 px-3 rounded-md shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{state.mainPoints !== null ? 'Ubah Posisi Utama' : 'Pilih Posisi Utama'}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Sprint Position Picker Modal */}
      {showSprintPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl max-w-sm w-full p-4 sm:p-5 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowSprintPicker(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 bg-gray-100 dark:bg-slate-800 w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Pilih Posisi Sprint ({config.name})
            </h4>

            <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
              {SPRINT_OPTIONS.map((opt) => {
                const check = isPositionTaken(appState, 'sprint', opt.points, config.id);
                const isTaken = check.taken;
                const isChecked = state.sprintPoints === opt.points;

                return (
                  <button
                    key={opt.position}
                    type="button"
                    disabled={isTaken}
                    onClick={() => {
                      onChangeSprintPoints(opt.points);
                      setShowSprintPicker(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-xs flex items-center justify-between transition-colors ${
                      isTaken
                        ? 'opacity-40 cursor-not-allowed bg-gray-50 dark:bg-slate-800/50'
                        : isChecked
                        ? 'bg-red-600 text-white font-bold'
                        : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isTaken && (
                      <span className="text-[10px] italic text-red-500 font-medium">
                        Diambil {check.takenBy?.name}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Race Position Picker Modal */}
      {showMainPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl max-w-sm w-full p-4 sm:p-5 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowMainPicker(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 bg-gray-100 dark:bg-slate-800 w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Pilih Posisi Utama ({config.name})
            </h4>

            <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
              {MAIN_OPTIONS.map((opt) => {
                const check = isPositionTaken(appState, 'main', opt.points, config.id);
                const isTaken = check.taken;
                const isChecked = state.mainPoints === opt.points;

                return (
                  <button
                    key={opt.position}
                    type="button"
                    disabled={isTaken}
                    onClick={() => {
                      onChangeMainPoints(opt.points);
                      setShowMainPicker(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-xs flex items-center justify-between transition-colors ${
                      isTaken
                        ? 'opacity-40 cursor-not-allowed bg-gray-50 dark:bg-slate-800/50'
                        : isChecked
                        ? 'bg-blue-600 text-white font-bold'
                        : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isTaken && (
                      <span className="text-[10px] italic text-blue-500 font-medium">
                        Diambil {check.takenBy?.name}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
