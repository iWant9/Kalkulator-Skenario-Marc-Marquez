import { AppState, CalculationResult, RacePositionOption, RiderConfig, RiderId, RiderState } from '../types/motogp';

export const CLINCH_MARTIN = 74;
export const CLINCH_BEZ = 75;

export const BASE_STANDINGS: Record<RiderId, number> = {
  marc: 399,
  martin: 355,
  bez: 332,
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
    totalPresets: [0, 10, 20, 29, 37],
    defaultSprint: 9, // P2
    defaultMain: 20,   // P2
    defaultTotal: 29,
    defaultMode: 'posisi',
  },
  martin: {
    id: 'martin',
    name: 'Jorge Martín',
    number: '89',
    role: 'Peringkat 2 Klasemen',
    basePoints: BASE_STANDINGS.martin,
    gapText: 'Gap: -44 pts',
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
    totalPresets: [0, 2, 4, 7, 12],
    defaultSprint: 12, // P1
    defaultMain: 25,   // P1
    defaultTotal: 12,
    defaultMode: 'total',
  },
  bez: {
    id: 'bez',
    name: 'Marco Bezzecchi',
    number: '72',
    role: 'Peringkat 3 Klasemen',
    basePoints: BASE_STANDINGS.bez,
    gapText: 'Gap: -67 pts',
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
    totalPresets: [0, 10, 22, 24, 29, 37],
    defaultSprint: 12, // P1
    defaultMain: 25,   // P1
    defaultTotal: 37,
    defaultMode: 'total',
  },
};

export const INITIAL_APP_STATE: AppState = {
  marc: {
    mode: 'posisi',
    totalPoints: 29,
    sprintPoints: 9,
    mainPoints: 20,
    isMinimized: false,
  },
  martin: {
    mode: 'total',
    totalPoints: 12,
    sprintPoints: 12,
    mainPoints: 25,
    isMinimized: false,
  },
  bez: {
    mode: 'total',
    totalPoints: 37,
    sprintPoints: 12,
    mainPoints: 25,
    isMinimized: false,
  },
};

export const EMPTY_APP_STATE: AppState = {
  marc: {
    mode: 'posisi',
    totalPoints: null,
    sprintPoints: null,
    mainPoints: null,
    isMinimized: false,
  },
  martin: {
    mode: 'total',
    totalPoints: null,
    sprintPoints: null,
    mainPoints: null,
    isMinimized: false,
  },
  bez: {
    mode: 'total',
    totalPoints: null,
    sprintPoints: null,
    mainPoints: null,
    isMinimized: false,
  },
};

export function isRiderSelected(riderState: RiderState): boolean {
  if (riderState.mode === 'posisi') {
    return riderState.sprintPoints !== null || riderState.mainPoints !== null;
  }
  return riderState.totalPoints !== null;
}

export function hasUserSelectedAny(state: AppState): boolean {
  return isRiderSelected(state.marc) || isRiderSelected(state.martin) || isRiderSelected(state.bez);
}

export function calculateRiderSessionPoints(riderState: RiderState): number | null {
  if (riderState.mode === 'posisi') {
    if (riderState.sprintPoints === null && riderState.mainPoints === null) {
      return null;
    }
    return (riderState.sprintPoints ?? 0) + (riderState.mainPoints ?? 0);
  }
  return riderState.totalPoints;
}

export function calculateScenario(state: AppState): CalculationResult {
  const hasSelection = hasUserSelectedAny(state);
  const marcSessionPoints = calculateRiderSessionPoints(state.marc);
  const martinSessionPoints = calculateRiderSessionPoints(state.martin);
  const bezSessionPoints = calculateRiderSessionPoints(state.bez);

  const marcTotal = BASE_STANDINGS.marc + (marcSessionPoints ?? 0);
  const martinTotal = BASE_STANDINGS.martin + (martinSessionPoints ?? 0);
  const bezTotal = BASE_STANDINGS.bez + (bezSessionPoints ?? 0);

  const advMartin = marcTotal - martinTotal;
  const advBez = marcTotal - bezTotal;

  // Title can only be clinched if actual selections were made
  const isMartinClenched = hasSelection && advMartin >= CLINCH_MARTIN;
  const isBezClenched = hasSelection && advBez >= CLINCH_BEZ;
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
  };
}

export function isPositionTaken(
  state: AppState,
  session: 'sprint' | 'main',
  points: number | null,
  currentRiderId: RiderId
): { taken: boolean; takenBy?: RiderConfig } {
  // Unset, DNF or 0 points can be shared
  if (points === null || points === 0) {
    return { taken: false };
  }

  const otherRiders: RiderId[] = (['marc', 'martin', 'bez'] as RiderId[]).filter(
    (id) => id !== currentRiderId
  );

  for (const otherId of otherRiders) {
    const otherState = state[otherId];
    if (otherState.mode === 'posisi') {
      const otherPoints = session === 'sprint' ? otherState.sprintPoints : otherState.mainPoints;
      if (otherPoints === points) {
        return { taken: true, takenBy: RIDER_CONFIGS[otherId] };
      }
    }
  }

  return { taken: false };
}

export function generateShareText(appState: AppState, result: CalculationResult): string {
  const getRiderDetail = (id: RiderId, name: string, total: number) => {
    const state = appState[id];
    if (state.mode === 'posisi') {
      const sprintLabel = SPRINT_OPTIONS.find((opt) => opt.points === state.sprintPoints)?.position || (state.sprintPoints !== null ? `${state.sprintPoints}p` : '-');
      const mainLabel = MAIN_OPTIONS.find((opt) => opt.points === state.mainPoints)?.position || (state.mainPoints !== null ? `${state.mainPoints}p` : '-');
      return `${name}: ${total} pts (Sprint ${sprintLabel}, Utama ${mainLabel})`;
    }
    return `${name}: ${total} pts (Total pilihan: ${state.totalPoints ?? 0} pts)`;
  };

  const marcInfo = getRiderDetail('marc', '🔴 Marc Márquez (#93)', result.marcTotal);
  const martinInfo = getRiderDetail('martin', '🟣 Jorge Martín (#89)', result.martinTotal);
  const bezInfo = getRiderDetail('bez', '🟣 Marco Bezzecchi (#72)', result.bezTotal);

  const statusText = !result.hasSelection
    ? 'ℹ️ STATUS: Belum ada poin atau posisi balapan yang dipilih.'
    : result.isChampion
    ? '🏆 STATUS: GELAR JUARA DUNIA TERKUNCI! Marc Márquez Resmi Juara Dunia MotoGP 2026! 🎉'
    : '⚠️ STATUS: GELAR BELUM TERKUNCI. Perebutan gelar berlanjut ke GP Portugal & GP Valencia!';

  return `🏁 SKENARIO JUARA DUNIA MOTOGP 2026 (Seri Qatar) 🏁
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
