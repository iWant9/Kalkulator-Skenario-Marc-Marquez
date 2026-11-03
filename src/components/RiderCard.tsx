import React from 'react';
import { AppState, CalculationMode, RiderConfig, RiderId, RiderState } from '../types/motogp';
import { MAIN_OPTIONS, SPRINT_OPTIONS, calculateRiderSessionPoints, isPositionTaken } from '../utils/calculator';
import { RiderAvatar } from './RiderAvatar';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface RiderCardProps {
  config: RiderConfig;
  state: RiderState;
  appState: AppState;
  onChangeMode: (mode: CalculationMode) => void;
  onChangeTotalPoints: (pts: number) => void;
  onChangeSprintPoints: (pts: number) => void;
  onChangeMainPoints: (pts: number) => void;
  onToggleMinimize: () => void;
}

export const RiderCard: React.FC<RiderCardProps> = ({
  config,
  state,
  appState,
  onChangeMode,
  onChangeTotalPoints,
  onChangeSprintPoints,
  onChangeMainPoints,
  onToggleMinimize,
}) => {
  const sessionPoints = calculateRiderSessionPoints(state);
  const isMarc = config.id === 'marc';

  // Find labels for minimized summary
  const sprintLabel = SPRINT_OPTIONS.find((opt) => opt.points === state.sprintPoints)?.position || 'P?';
  const mainLabel = MAIN_OPTIONS.find((opt) => opt.points === state.mainPoints)?.position || 'P?';

  const cardContainerClass = isMarc
    ? 'bg-red-100 dark:bg-red-950/30 border-red-300 dark:border-red-900/60'
    : 'bg-purple-100 dark:bg-slate-900 border-purple-300 dark:border-slate-800';

  const headerBorderClass = isMarc ? 'border-red-200 dark:border-red-900/50' : 'border-purple-200 dark:border-slate-800';
  const accentTextClass = isMarc ? 'text-red-600 dark:text-red-400' : 'text-purple-600 dark:text-purple-400';
  const modeActiveBtnClass = isMarc
    ? 'peer-checked:bg-red-600 peer-checked:text-white'
    : 'peer-checked:bg-purple-600 peer-checked:text-white';

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

            {/* Minimize/Maximize toggle */}
            <button
              type="button"
              data-target={config.id}
              onClick={onToggleMinimize}
              aria-expanded={!state.isMinimized}
              aria-label={`Toggle minimize ${config.name}`}
              className="toggle-minimize bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 text-xs w-7 h-7 flex items-center justify-center rounded border border-gray-300 dark:border-slate-700 transition-colors shadow-2xs cursor-pointer"
              title={state.isMinimized ? 'Perluas tampilan' : 'Kecilkan tampilan'}
            >
              {state.isMinimized ? (
                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              ) : (
                <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Minimized Summary Box */}
      {state.isMinimized ? (
        <div
          id={`${config.id}_minimized_summary`}
          className={`text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 p-2.5 rounded border flex items-center justify-between ${
            isMarc ? 'border-red-200 dark:border-red-900/50' : 'border-purple-200 dark:border-slate-700'
          }`}
        >
          <span className="italic text-gray-600 dark:text-gray-400">
            {state.mode === 'total' ? (
              state.totalPoints !== null ? (
                <>
                  Pilihan: Total Poin (
                  <span className={`font-bold ${accentTextClass}`}>{state.totalPoints}</span> pts)
                </>
              ) : (
                <span className="text-gray-400 dark:text-gray-500">Belum ada poin yang dipilih</span>
              )
            ) : state.sprintPoints !== null || state.mainPoints !== null ? (
              <>
                Sprint: <span className={`font-bold ${accentTextClass}`}>{sprintLabel}</span> (
                {state.sprintPoints ?? '-'}p) | Utama:{' '}
                <span className={`font-bold ${accentTextClass}`}>{mainLabel}</span> (
                {state.mainPoints ?? '-'}p)
              </>
            ) : (
              <span className="text-gray-400 dark:text-gray-500">Belum ada posisi yang dipilih</span>
            )}
          </span>
          <span className={`font-bold ${accentTextClass}`}>
            Total: {sessionPoints !== null ? `${sessionPoints} poin` : '-'}
          </span>
        </div>
      ) : (
        <>
          {/* Mode: Total Points */}
          {state.mode === 'total' && (
            <div id={`${config.id}_mode_total`} className="space-y-2 flex flex-col pt-1">
              {config.totalPresets.map((pts) => {
                const isChecked = state.totalPoints === pts;
                return (
                  <label
                    key={pts}
                    className="custom-radio flex items-center gap-2.5 cursor-pointer group w-fit select-none"
                  >
                    <input
                      type="radio"
                      name={`${config.id}_points`}
                      value={pts}
                      checked={isChecked}
                      onChange={() => onChangeTotalPoints(pts)}
                      className="peer hidden"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        isChecked
                          ? isMarc
                            ? 'border-red-600 bg-white dark:bg-slate-900'
                            : 'border-purple-600 bg-white dark:bg-slate-900'
                          : 'border-gray-400 dark:border-slate-600 bg-white dark:bg-slate-900 group-hover:border-gray-600 dark:group-hover:border-slate-400'
                      }`}
                    >
                      {isChecked && (
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isMarc ? 'bg-red-600' : 'bg-purple-600'
                          }`}
                        />
                      )}
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        isChecked
                          ? 'text-gray-950 dark:text-white font-bold'
                          : 'text-gray-800 dark:text-gray-300 group-hover:text-gray-950 dark:group-hover:text-white'
                      }`}
                    >
                      {pts} poin
                    </span>
                  </label>
                );
              })}
            </div>
          )}

          {/* Mode: Position Selection (Sprint & Main Race) */}
          {state.mode === 'posisi' && (
            <div
              id={`${config.id}_mode_posisi`}
              className={`grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-white dark:bg-slate-800/90 p-2.5 sm:p-4 rounded-lg border shadow-inner ${
                isMarc ? 'border-red-200 dark:border-red-900/50' : 'border-purple-200 dark:border-slate-700'
              }`}
            >
              {/* Sprint Race Column */}
              <div className="bg-red-50/60 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-2.5 sm:p-3 rounded-md">
                <h4 className="text-[11px] sm:text-xs font-bold text-red-600 dark:text-red-400 mb-2.5 border-b border-red-200 dark:border-red-900/50 pb-1 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600" /> Sprint Race
                </h4>
                <div className="space-y-1.5 sm:space-y-2 flex flex-col">
                  {SPRINT_OPTIONS.map((opt) => {
                    const check = isPositionTaken(appState, 'sprint', opt.points, config.id);
                    const isTaken = check.taken;
                    const isChecked = state.sprintPoints === opt.points;

                    return (
                      <label
                        key={opt.position}
                        className={`custom-radio flex items-center gap-2.5 select-none ${
                          isTaken
                            ? 'cursor-not-allowed opacity-40'
                            : 'cursor-pointer group'
                        }`}
                        title={isTaken ? `Sudah diambil oleh ${check.takenBy?.name}` : undefined}
                      >
                        <input
                          type="radio"
                          name={`${config.id}_sprint`}
                          value={opt.points}
                          checked={isChecked}
                          disabled={isTaken}
                          onChange={() => onChangeSprintPoints(opt.points)}
                          className="peer hidden"
                        />
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                            isChecked
                              ? 'border-red-600 bg-white dark:bg-slate-900'
                              : 'border-gray-400 dark:border-slate-600 bg-white dark:bg-slate-900 group-hover:border-gray-600 dark:group-hover:border-slate-400'
                          }`}
                        >
                          {isChecked && <div className="w-2 h-2 rounded-full bg-red-600" />}
                        </div>
                        <span
                          className={`text-xs sm:text-sm ${
                            isChecked
                              ? 'text-gray-950 dark:text-white font-bold'
                              : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
                          }`}
                        >
                          {opt.label}
                        </span>

                        {isTaken && (
                          <span className="taken-note text-[9px] sm:text-[10px] text-red-600 dark:text-red-400 italic ml-auto font-bold bg-red-100/80 dark:bg-red-950 px-1.5 py-0.5 rounded">
                            P {check.takenBy?.name}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Main Race Column */}
              <div className="bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 p-2.5 sm:p-3 rounded-md">
                <h4 className="text-[11px] sm:text-xs font-bold text-blue-600 dark:text-blue-400 mb-2.5 border-b border-blue-200 dark:border-blue-900/50 pb-1 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Race Utama
                </h4>
                <div className="space-y-1.5 sm:space-y-2 flex flex-col">
                  {MAIN_OPTIONS.map((opt) => {
                    const check = isPositionTaken(appState, 'main', opt.points, config.id);
                    const isTaken = check.taken;
                    const isChecked = state.mainPoints === opt.points;

                    return (
                      <label
                        key={opt.position}
                        className={`custom-radio flex items-center gap-2.5 select-none ${
                          isTaken
                            ? 'cursor-not-allowed opacity-40'
                            : 'cursor-pointer group'
                        }`}
                        title={isTaken ? `Sudah diambil oleh ${check.takenBy?.name}` : undefined}
                      >
                        <input
                          type="radio"
                          name={`${config.id}_main`}
                          value={opt.points}
                          checked={isChecked}
                          disabled={isTaken}
                          onChange={() => onChangeMainPoints(opt.points)}
                          className="peer hidden"
                        />
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                            isChecked
                              ? 'border-blue-600 bg-white dark:bg-slate-900'
                              : 'border-gray-400 dark:border-slate-600 bg-white dark:bg-slate-900 group-hover:border-gray-600 dark:group-hover:border-slate-400'
                          }`}
                        >
                          {isChecked && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                        </div>
                        <span
                          className={`text-xs sm:text-sm ${
                            isChecked
                              ? 'text-gray-950 dark:text-white font-bold'
                              : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
                          }`}
                        >
                          {opt.label}
                        </span>

                        {isTaken && (
                          <span className="taken-note text-[9px] sm:text-[10px] text-blue-700 dark:text-blue-400 italic ml-auto font-bold bg-blue-100/80 dark:bg-blue-950 px-1.5 py-0.5 rounded">
                            P {check.takenBy?.name}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
