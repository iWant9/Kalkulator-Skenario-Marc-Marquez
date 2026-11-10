import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BASE_STANDINGS,
  CLINCH_SPRINT,
  CLINCH_FINAL,
  EMPTY_APP_STATE,
  calculateScenario,
  isPositionTaken,
} from './calculator';
import { AppState } from '../types/motogp';

test('Mode "Sprint Race": Selisih poin dari total harus minimal 62 terhadap Martin dan Bezzecchi', () => {
  // Base: Marc 431, Martin 371 (diff 60), Bez 357 (diff 74)
  // Sprint: Marc P2 (9 pts), Martin P3 (7 pts) -> Marc: 440, Martin: 378 (diff 62)
  // Bez DNF (0 pts) -> Bez: 357 (diff 83 >= 62)
  const state: AppState = {
    marc: { sprintPoints: 9, mainPoints: null, isMinimized: false },
    martin: { sprintPoints: 7, mainPoints: null, isMinimized: false },
    bez: { sprintPoints: 0, mainPoints: null, isMinimized: false },
  };
  const result = calculateScenario(state, 'sprint');
  assert.equal(result.simulationMode, 'sprint');
  assert.equal(result.clinchThreshold, CLINCH_SPRINT); // 62
  assert.equal(result.advMartin, 62);
  assert.equal(result.isMartinClenched, true);
  assert.equal(result.isBezClenched, true);
  assert.equal(result.isChampion, true);
});

test('Mode "Sprint Race": Selisih kurang dari 62 poin terhadap Martin belum mengunci gelar', () => {
  // Sprint: Marc P2 (9 pts), Martin P2 (9 pts) -> Marc 440, Martin 380 (diff 60 < 62)
  const state: AppState = {
    marc: { sprintPoints: 9, mainPoints: null, isMinimized: false },
    martin: { sprintPoints: 9, mainPoints: null, isMinimized: false },
    bez: { sprintPoints: 0, mainPoints: null, isMinimized: false },
  };
  const result = calculateScenario(state, 'sprint');
  assert.equal(result.simulationMode, 'sprint');
  assert.equal(result.clinchThreshold, CLINCH_SPRINT); // 62
  assert.equal(result.advMartin, 60);
  assert.equal(result.isMartinClenched, false);
  assert.equal(result.isChampion, false);
});

test('Mode "Semua Race": Poin akhir Marc setelah balapan utama harus unggul minimal 37 poin', () => {
  // Main race involved: threshold 37
  // Marc Total 431 + 10 = 441. Martin Total 371 + 25 = 396 -> diff 45 >= 37
  const state: AppState = {
    marc: { sprintPoints: 0, mainPoints: 10, isMinimized: false }, // 441
    martin: { sprintPoints: 0, mainPoints: 25, isMinimized: false }, // 396 -> diff 45 >= 37
    bez: { sprintPoints: 0, mainPoints: 20, isMinimized: false }, // 377 -> diff 64 >= 37
  };
  const result = calculateScenario(state, 'semua');
  assert.equal(result.simulationMode, 'semua');
  assert.equal(result.clinchThreshold, CLINCH_FINAL); // 37
  assert.equal(result.advMartin, 45);
  assert.equal(result.isMartinClenched, true);
  assert.equal(result.isBezClenched, true);
  assert.equal(result.isChampion, true);
});

test('Mode "Semua Race": Selisih kurang dari 37 poin belum mengunci gelar', () => {
  // Marc 431 + 0 = 431. Martin 371 + 37 = 408 (diff 23 < 37)
  const state: AppState = {
    marc: { sprintPoints: 0, mainPoints: 0, isMinimized: false },
    martin: { sprintPoints: 12, mainPoints: 25, isMinimized: false },
    bez: { sprintPoints: 0, mainPoints: 0, isMinimized: false },
  };
  const result = calculateScenario(state, 'semua');
  assert.equal(result.simulationMode, 'semua');
  assert.equal(result.clinchThreshold, CLINCH_FINAL); // 37
  assert.equal(result.advMartin, 23);
  assert.equal(result.isMartinClenched, false);
  assert.equal(result.isChampion, false);
});

test('Position collision logic avoids double booking race positions', () => {
  const state: AppState = {
    marc: { sprintPoints: 12, mainPoints: 20, isMinimized: false },
    martin: { sprintPoints: 9, mainPoints: 25, isMinimized: false },
    bez: { sprintPoints: 7, mainPoints: 16, isMinimized: false },
  };

  const checkSprintP1ForMartin = isPositionTaken(state, 'sprint', 12, 'martin');
  assert.equal(checkSprintP1ForMartin.taken, true);
  assert.equal(checkSprintP1ForMartin.takenBy?.id, 'marc');

  const checkSprintP1ForMarc = isPositionTaken(state, 'sprint', 12, 'marc');
  assert.equal(checkSprintP1ForMarc.taken, false);

  const checkMainP1ForMarc = isPositionTaken(state, 'main', 25, 'marc');
  assert.equal(checkMainP1ForMarc.taken, true);
  assert.equal(checkMainP1ForMarc.takenBy?.id, 'martin');

  const checkDNF = isPositionTaken(state, 'sprint', 0, 'bez');
  assert.equal(checkDNF.taken, false);
});
