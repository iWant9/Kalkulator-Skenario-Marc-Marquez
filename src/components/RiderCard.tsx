import React, { useState } from 'react';
import { AppState, CalculationMode, RiderConfig, RiderState } from '../types/motogp';
import { MAIN_OPTIONS, SPRINT_OPTIONS, calculateRiderSessionPoints, isPositionTaken } from '../utils/calculator';
import { RiderAvatar } from './RiderAvatar';
import { ChevronDown, X } from 'lucide-react';

interface RiderCardProps {
  config: RiderConfig;
  state: RiderState;
  appState: AppState;
  onChangeMode: (mode: CalculationMode) => void;
  onChangeTotalPoints: (pts: number) => void;
  onChangeSprintPoints: (pts: number) => void;
  onChangeMainPoints: (pts: number) => void;
}

export const RiderCard: React.FC<RiderCardProps> = ({
  config,
  state,
  appState,
  onChangeMode,
  onChangeTotalPoints,
  onChangeSprintPoints,
  onChangeMainPoints,
}) => {
  const [showTotalPicker, setShowTotalPicker] = useState(false);
  const [showSprintPicker, setShowSprintPicker] = useState(false);
  const [showMainPicker, setShowMainPicker] = useState(false);

  const sessionPoints = calculateRiderSessionPoints(state);
  const isMarc = config.id === 'marc';

  const cardContainerClass = isMarc
    ? 'bg-red-100 dark:bg-red-950/30 border-red-300 dark:border-red-900/60'
    : 'bg-purple-100 dark:bg-slate-900 border-purple-300 dark:border-slate-800';

  const headerBorderClass = isMarc ? 'border-red-200 dark:border-red-900/50' : 'border-purple-200 dark:border-slate-800';
  const modeActiveBtnClass = isMarc
    ? 'peer-checked:bg-red-600 peer-checked:text-white'
    : 'peer-checked:bg-purple-600 peer-checked:text-white';

  const selectedSprintOpt = SPRINT_OPTIONS.find((opt) => opt.points === state.sprintPoints);
  const selectedMainOpt = MAIN_OPTIONS.find((opt) => opt.points === state.mainPoints);

  const totalBtnBgClass = isMarc
    ? 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white'
    : 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white';

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

          <div className="flex items-center gap-1.5">
            {/* Mode switch (Total vs Posisi) */}
            <div className="flex bg-white dark:bg-slate-800 p-0.5 rounded-md border border-gray-300 dark:border-slate-700 shadow-2xs">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name={`${config.id}_mode`}
                  value="total"
                  checked={state.mode === 'total'}
                  onChange={() => onChangeMode('total')}
                  className="peer hidden"
                />
                <div
                  className={`px-2.5 py-1 rounded text-[11px] font-bold text-gray-500 dark:text-gray-400 peer-checked:shadow-xs transition-colors ${modeActiveBtnClass}`}
                >
                  Total
                </div>
              </label>

              <label className="cursor-pointer">
                <input
                  type="radio"
                  name={`${config.id}_mode`}
                  value="posisi"
                  checked={state.mode === 'posisi'}
                  onChange={() => onChangeMode('posisi')}
                  className="peer hidden"
                />
                <div
                  className={`px-2.5 py-1 rounded text-[11px] font-bold text-gray-500 dark:text-gray-400 peer-checked:shadow-xs transition-colors ${modeActiveBtnClass}`}
                >
                  Posisi
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Mode: Total Points Button Trigger */}
      {state.mode === 'total' && (
        <div id={`${config.id}_mode_total`} className="pt-1">
          <div className="bg-white/80 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 p-3 rounded-lg flex items-center justify-between gap-3">
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 block font-medium">Pilihan Total Poin:</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {state.totalPoints !== null ? `${state.totalPoints} Poin` : 'Belum dipilih'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowTotalPicker(true)}
              className={`font-bold text-xs py-2 px-4 rounded-md shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer ${totalBtnBgClass}`}
            >
              <span>{state.totalPoints !== null ? 'Ubah Total Poin' : 'Pilih Total Poin'}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Mode: Position Selection Buttons (Sprint & Main Race) */}
      {state.mode === 'posisi' && (
        <div
          id={`${config.id}_mode_posisi`}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {/* Sprint Race Button Trigger */}
          <div className="bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-3 rounded-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
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

          {/* Main Race Button Trigger */}
          <div className="bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 p-3 rounded-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] sm:text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Race Utama
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
        </div>
      )}

      {/* Total Points Picker Modal */}
      {showTotalPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl max-w-sm w-full p-4 sm:p-5 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowTotalPicker(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 bg-gray-100 dark:bg-slate-800 w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              Pilih Total Poin ({config.name})
            </h4>

            <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
              {config.totalPresets.map((pts) => {
                const isChecked = state.totalPoints === pts;
                return (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => {
                      onChangeTotalPoints(pts);
                      setShowTotalPicker(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-xs flex items-center justify-between transition-colors ${
                      isChecked
                        ? isMarc
                          ? 'bg-red-600 text-white font-bold'
                          : 'bg-purple-600 text-white font-bold'
                        : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <span>{pts} Poin</span>
                    {isChecked && <span className="text-[10px] uppercase font-bold tracking-wider">Dipilih</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

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
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Pilih Posisi Race Utama ({config.name})
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
