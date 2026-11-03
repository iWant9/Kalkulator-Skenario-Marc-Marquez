import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BASE_STANDINGS,
  CLINCH_BEZ,
  CLINCH_MARTIN,
  INITIAL_APP_STATE,
  calculateRiderSessionPoints,
  calculateScenario,
  isPositionTaken,
} from './calculator';
import { AppState } from '../types/motogp';

test('Initial default setup matches the original file baseline', () => {
  const result = calculateScenario(INITIAL_APP_STATE);

  // Marc: 399 + (9 + 20) = 428
  assert.equal(result.marcSessionPoints, 29);
  assert.equal(result.marcTotal, 428);

  // Martin: 355 + 12 = 367
  assert.equal(result.martinSessionPoints, 12);
  assert.equal(result.martinTotal, 367);

  // Bezzecchi: 332 + 37 = 369
  assert.equal(result.bezSessionPoints, 37);
  assert.equal(result.bezTotal, 369);

  // Advantages
  // advMartin = 428 - 367 = 61 (Needs 74)
  assert.equal(result.advMartin, 61);
  assert.equal(result.isMartinClenched, false);

  // advBez = 428 - 369 = 59 (Needs 75)
  assert.equal(result.advBez, 59);
  assert.equal(result.isBezClenched, false);

  // Title not clenched yet
  assert.equal(result.isChampion, false);
});

test('Clinch scenario: Marc max points (37) and rivals low points', () => {
  const state: AppState = {
    marc: {
      mode: 'posisi',
      totalPoints: 37,
      sprintPoints: 12, // P1 (12)
      mainPoints: 25,   // P1 (25)
      isMinimized: false,
    },
    martin: {
      mode: 'total',
      totalPoints: 0,
      sprintPoints: 0,
      mainPoints: 0,
      isMinimized: false,
    },
    bez: {
      mode: 'total',
      totalPoints: 0,
      sprintPoints: 0,
      mainPoints: 0,
      isMinimized: false,
    },
  };

  const result = calculateScenario(state);

  assert.equal(result.marcTotal, 399 + 37); // 436
  assert.equal(result.martinTotal, 355 + 0); // 355
  assert.equal(result.bezTotal, 332 + 0);    // 332

  // Gaps:
  // Martin: 436 - 355 = 81 >= 74 -> Clenched!
  assert.equal(result.advMartin, 81);
  assert.equal(result.isMartinClenched, true);

  // Bez: 436 - 332 = 104 >= 75 -> Clenched!
  assert.equal(result.advBez, 104);
  assert.equal(result.isBezClenched, true);

  assert.equal(result.isChampion, true);
});

test('Exact threshold verification for Clinch', () => {
  // Marc needs 74 pts over Martin and 75 pts over Bezzecchi
  // Total Marc = 430
  // If Martin Total = 356 -> Adv Martin = 74 (exact clinch)
  // If Bez Total = 355 -> Adv Bez = 75 (exact clinch)
  const state: AppState = {
    marc: {
      mode: 'total',
      totalPoints: 31, // 399 + 31 = 430
      sprintPoints: 0,
      mainPoints: 0,
      isMinimized: false,
    },
    martin: {
      mode: 'total',
      totalPoints: 1, // 355 + 1 = 356. Adv = 430 - 356 = 74 -> True!
      sprintPoints: 0,
      mainPoints: 0,
      isMinimized: false,
    },
    bez: {
      mode: 'total',
      totalPoints: 23, // 332 + 23 = 355. Adv = 430 - 355 = 75 -> True!
      sprintPoints: 0,
      mainPoints: 0,
      isMinimized: false,
    },
  };

  const result = calculateScenario(state);
  assert.equal(result.advMartin, 74);
  assert.equal(result.isMartinClenched, true);
  assert.equal(result.advBez, 75);
  assert.equal(result.isBezClenched, true);
  assert.equal(result.isChampion, true);
});

test('Position collision logic avoids double booking race positions', () => {
  const state: AppState = {
    marc: {
      mode: 'posisi',
      totalPoints: 0,
      sprintPoints: 12, // P1
      mainPoints: 20,   // P2
      isMinimized: false,
    },
    martin: {
      mode: 'posisi',
      totalPoints: 0,
      sprintPoints: 9,  // P2
      mainPoints: 25,   // P1
      isMinimized: false,
    },
    bez: {
      mode: 'posisi',
      totalPoints: 0,
      sprintPoints: 7,  // P3
      mainPoints: 16,   // P3
      isMinimized: false,
    },
  };

  // Marc has Sprint P1 (12 pts). Martin checking P1 should show taken by Marc
  const checkSprintP1ForMartin = isPositionTaken(state, 'sprint', 12, 'martin');
  assert.equal(checkSprintP1ForMartin.taken, true);
  assert.equal(checkSprintP1ForMartin.takenBy?.id, 'marc');

  // Marc checking Sprint P1 for himself should NOT show taken by himself
  const checkSprintP1ForMarc = isPositionTaken(state, 'sprint', 12, 'marc');
  assert.equal(checkSprintP1ForMarc.taken, false);

  // Martin has Main P1 (25 pts). Marc checking Main P1 should show taken by Martin
  const checkMainP1ForMarc = isPositionTaken(state, 'main', 25, 'marc');
  assert.equal(checkMainP1ForMarc.taken, true);
  assert.equal(checkMainP1ForMarc.takenBy?.id, 'martin');

  // DNF (0 pts) is allowed for everyone simultaneously
  const checkDNF = isPositionTaken(state, 'sprint', 0, 'bez');
  assert.equal(checkDNF.taken, false);
});
