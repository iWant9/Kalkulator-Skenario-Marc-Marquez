export type RiderId = 'marc' | 'martin' | 'bez';
export type SimulationMode = 'sprint' | 'semua';

export interface RiderConfig {
  id: RiderId;
  name: string;
  number: string;
  role: string;
  basePoints: number;
  gapText?: string;
  theme: {
    accent: string;
    bgBadge: string;
    cardBg: string;
    border: string;
    pillActive: string;
    avatarBg: string;
    textLight: string;
    textDark: string;
  };
  defaultSprint: number;
  defaultMain: number;
}

export interface RiderState {
  sprintPoints: number | null;
  mainPoints: number | null;
  isMinimized: boolean;
}

export type AppState = Record<RiderId, RiderState>;

export interface RacePositionOption {
  position: string;
  points: number;
  label: string;
}

export interface CalculationResult {
  marcSessionPoints: number | null;
  martinSessionPoints: number | null;
  bezSessionPoints: number | null;
  marcTotal: number;
  martinTotal: number;
  bezTotal: number;
  advMartin: number;
  advBez: number;
  isMartinClenched: boolean;
  isBezClenched: boolean;
  isChampion: boolean;
  hasSelection: boolean;
  clinchThreshold: number;
  simulationMode: SimulationMode;
}
