import { AppState, CalculationResult, RacePositionOption, RiderConfig, RiderId, RiderState, SimulationMode } from '../types/motogp';

export const CLINCH_SPRINT = 62;
export const CLINCH_FINAL = 37;
export const CLINCH_MARTIN = CLINCH_FINAL;
export const CLINCH_BEZ = CLINCH_FINAL;

export const BASE_STANDINGS: Record<RiderId, number> = {
  marc: 431,
  martin: 371,
  bez: 357,
};

export const SPRINT_OPTIONS: RacePositionOption[] = [
  { position: 'P1', points: 12, label: 'P1 — 12 poin' },
  { position: 'P2', points: 9, label: 'P2 — 9 poin' },
  { position: 'P3', points: 7, label: 'P3 — 7 poin' },
  { position: 'P4', points: 6, label: 'P4 — 6 poin' },
  { position: 'P5', points: 5, label: 'P5 — 5 poin' },
  { position: 'P6', points: 4, label: 'P6 — 4 poin' },
  { position: 'P7', points: 3, label: 'P7 — 3 poin' },
  { position: 'P8', points: 2, label: 'P8 — 2 poin' },
  { position: 'P9', points: 1, label: 'P9 — 1 poin' },
  { position: 'DNF', points: 0, label: 'DNF/Luar Poin — 0' },
];

export const MAIN_OPTIONS: RacePositionOption[] = [
  { position: 'P1', points: 25, label: 'P1 — 25 poin' },
  { position: 'P2', points: 20, label: 'P2 — 20 poin' },
  { position: 'P3', points: 16, label: 'P3 — 16 poin' },
  { position: 'P4', points: 13, label: 'P4 — 13 poin' },
  { position: 'P5', points: 11, label: 'P5 — 11 poin' },
  { position: 'P6', points: 10, label: 'P6 — 10 poin' },
  { position: 'P7', points: 9, label: 'P7 — 9 poin' },
  { position: 'P8', points: 8, label: 'P8 — 8 poin' },
  { position: 'P9', points: 7, label: 'P9 — 7 poin' },
  { position: 'P10', points: 6, label: 'P10 — 6 poin' },
  { position: 'P11', points: 5, label: 'P11 — 5 poin' },
  { position: 'P12', points: 4, label: 'P12 — 4 poin' },
  { position: 'P13', points: 3, label: 'P13 — 3 poin' },
  { position: 'P14', points: 2, label: 'P14 — 2 poin' },
  { position: 'P15', points: 1, label: 'P15 — 1 poin' },
  { position: 'DNF', points: 0, label: 'DNF/Luar Poin — 0' },
];

export const RIDER_CONFIGS: Record<RiderId, RiderConfig> = {
  marc: {
    id: 'marc',
    name: 'Marc Márquez',
    number: '93',
    role: 'Pimpinan Klasemen',
    basePoints: BASE_STANDINGS.marc,
    theme: {
      accent: '#e20613',
      bgBadge: 'bg-red-600',
      cardBg: 'bg-red-100',
      border: 'border-red-300',
      pillActive: 'bg-red-600',
      avatarBg: 'bg-red-600',
      textLight: 'text-red-600',
      textDark: 'text-gray-900',
    },
    defaultSprint: 9, // P2
    defaultMain: 20,   // P2
  },
  martin: {
    id: 'martin',
    name: 'Jorge Martín',
    number: '89',
    role: 'Peringkat 2 Klasemen',
    basePoints: BASE_STANDINGS.martin,
    gapText: 'Gap: -60 pts',
    theme: {
      accent: '#6b21a8',
      bgBadge: 'bg-purple-600',
      cardBg: 'bg-purple-100',
      border: 'border-purple-300',
      pillActive: 'bg-purple-600',
      avatarBg: 'bg-purple-700',
      textLight: 'text-purple-600',
      textDark: 'text-gray-900',
    },
    defaultSprint: 12, // P1
    defaultMain: 25,   // P1
  },
  bez: {
    id: 'bez',
    name: 'Marco Bezzecchi',
    number: '72',
    role: 'Peringkat 3 Klasemen',
    basePoints: BASE_STANDINGS.bez,
    gapText: 'Gap: -74 pts',
    theme: {
      accent: '#6b21a8',
      bgBadge: 'bg-purple-600',
      cardBg: 'bg-purple-100',
      border: 'border-purple-300',
      pillActive: 'bg-purple-600',
      avatarBg: 'bg-purple-700',
      textLight: 'text-purple-600',
      textDark: 'text-gray-900',
    },
    defaultSprint: 12, // P1
    defaultMain: 25,   // P1
  },
};

export const INITIAL_APP_STATE: AppState = {
  marc: {
    sprintPoints: 9,
    mainPoints: 20,
    isMinimized: false,
  },
  martin: {
    sprintPoints: 12,
    mainPoints: 25,
    isMinimized: false,
  },
  bez: {
    sprintPoints: 12,
    mainPoints: 25,
    isMinimized: false,
  },
};

export const EMPTY_APP_STATE: AppState = {
  marc: {
    sprintPoints: null,
    mainPoints: null,
    isMinimized: false,
  },
  martin: {
    sprintPoints: null,
    mainPoints: null,
    isMinimized: false,
  },
  bez: {
    sprintPoints: null,
    mainPoints: null,
    isMinimized: false,
  },
};

export function isRiderSelected(riderState: RiderState): boolean {
  return riderState.sprintPoints !== null || riderState.mainPoints !== null;
}

export function hasUserSelectedAny(state: AppState): boolean {
  return isRiderSelected(state.marc) || isRiderSelected(state.martin) || isRiderSelected(state.bez);
}

export function calculateRiderSessionPoints(riderState: RiderState, mode: SimulationMode = 'semua'): number | null {
  if (mode === 'sprint') {
    return riderState.sprintPoints;
  }
  if (riderState.sprintPoints === null && riderState.mainPoints === null) {
    return null;
  }
  return (riderState.sprintPoints ?? 0) + (riderState.mainPoints ?? 0);
}

export function hasUserSelectedInMode(state: AppState, mode: SimulationMode = 'semua'): boolean {
  if (mode === 'sprint') {
    return state.marc.sprintPoints !== null || state.martin.sprintPoints !== null || state.bez.sprintPoints !== null;
  }
  return hasUserSelectedAny(state);
}

export function calculateScenario(state: AppState, simulationMode: SimulationMode = 'semua'): CalculationResult {
  const hasSelection = hasUserSelectedInMode(state, simulationMode);
  const marcSessionPoints = calculateRiderSessionPoints(state.marc, simulationMode);
  const martinSessionPoints = calculateRiderSessionPoints(state.martin, simulationMode);
  const bezSessionPoints = calculateRiderSessionPoints(state.bez, simulationMode);

  const marcTotal = BASE_STANDINGS.marc + (marcSessionPoints ?? 0);
  const martinTotal = BASE_STANDINGS.martin + (martinSessionPoints ?? 0);
  const bezTotal = BASE_STANDINGS.bez + (bezSessionPoints ?? 0);

  const advMartin = marcTotal - martinTotal;
  const advBez = marcTotal - bezTotal;

  // Ketentuan rumus kalkulator:
  // - "sprint race": Poin akhir Marc Márquez setelah Sprint Race harus unggul minimal 62 poin dari total poin Jorge Martín dan Marco Bezzecchi untuk mengunci gelar juara dunia di hari Sabtu.
  // - "semua race": Poin akhir Marc Márquez setelah balapan utama hari Minggu harus unggul minimal 37 poin dari total poin Jorge Martín dan Marco Bezzecchi.
  const clinchThreshold = simulationMode === 'sprint' ? CLINCH_SPRINT : CLINCH_FINAL;

  const isMartinClenched = hasSelection && advMartin >= clinchThreshold;
  const isBezClenched = hasSelection && advBez >= clinchThreshold;
  const isChampion = hasSelection && isMartinClenched && isBezClenched;

  return {
    marcSessionPoints,
    martinSessionPoints,
    bezSessionPoints,
    marcTotal,
    martinTotal,
    bezTotal,
    advMartin,
    advBez,
    isMartinClenched,
    isBezClenched,
    isChampion,
    hasSelection,
    clinchThreshold,
    simulationMode,
  };
}

export function isPositionTaken(
  state: AppState,
  session: 'sprint' | 'main',
  points: number | null,
  currentRiderId: RiderId
): { taken: boolean; takenBy?: RiderConfig } {
  if (points === null || points === 0) {
    return { taken: false };
  }

  const otherRiders: RiderId[] = (['marc', 'martin', 'bez'] as RiderId[]).filter(
    (id) => id !== currentRiderId
  );

  for (const otherId of otherRiders) {
    const otherState = state[otherId];
    const otherPoints = session === 'sprint' ? otherState.sprintPoints : otherState.mainPoints;
    if (otherPoints === points) {
      return { taken: true, takenBy: RIDER_CONFIGS[otherId] };
    }
  }

  return { taken: false };
}

export function generateShareText(appState: AppState, result: CalculationResult): string {
  const getRiderDetail = (id: RiderId, name: string, total: number) => {
    const state = appState[id];
    const sprintLabel = SPRINT_OPTIONS.find((opt) => opt.points === state.sprintPoints)?.position || (state.sprintPoints !== null ? `${state.sprintPoints}p` : '-');
    const mainLabel = MAIN_OPTIONS.find((opt) => opt.points === state.mainPoints)?.position || (state.mainPoints !== null ? `${state.mainPoints}p` : '-');
    return `${name}: ${total} pts (Sprint ${sprintLabel}, Utama ${mainLabel})`;
  };

  const marcInfo = getRiderDetail('marc', '🔴 Marc Márquez (#93)', result.marcTotal);
  const martinInfo = getRiderDetail('martin', '🟣 Jorge Martín (#89)', result.martinTotal);
  const bezInfo = getRiderDetail('bez', '🟣 Marco Bezzecchi (#72)', result.bezTotal);

  const isTieBreak = result.isChampion && (result.advMartin === result.clinchThreshold || result.advBez === result.clinchThreshold);

  const statusText = !result.hasSelection
    ? 'ℹ️ STATUS: Belum ada poin atau posisi balapan yang dipilih.'
    : result.isChampion
    ? `🏆 STATUS: GELAR JUARA DUNIA TERKUNCI! Marc Márquez Resmi Juara Dunia MotoGP 2026! 🎉${isTieBreak ? ' (Aturan Tie-Break)' : ''}`
    : '⚠️ STATUS: GELAR BELUM TERKUNCI. Marc Marquez lanjut bertarung (melanjutkan race utama Portugal) atau di seri terakhir yaitu di sirkuit Valencia!!';

  const modeLabel = result.simulationMode === 'sprint' ? 'Sprint Race (Sabtu)' : 'Semua Race (Portugal)';

  return `🏁 SKENARIO JUARA DUNIA MOTOGP 2026 (Seri Portugal) 🏁
Mode Simulasi: ${modeLabel}
by iWant MotoLab

📊 Hasil Perolehan Poin Akhir:
• ${marcInfo}
• ${martinInfo} [Selisih dari Marc: ${result.advMartin} pts]
• ${bezInfo} [Selisih dari Marc: ${result.advBez} pts]

${statusText}

Simulasi skenario balapan MotoGP 2026 di iWant MotoLab!`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
    console.warn('navigator.clipboard.writeText failed, trying fallback', e);
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    textArea.remove();
    return successful;
  } catch (err) {
    console.error('Clipboard copy fallback failed', err);
    return false;
  }
}
