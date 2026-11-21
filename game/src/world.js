// The game's rules and state, with no drawing and no browser in it: which
// level is live, which differences are found, score, combo, hints and the
// clock. Clicks come in as panel-local coordinates; the world answers with
// what happened so the caller can play a sound or announce it.
import {
  CLEAR_SECONDS,
  COMBO_BONUS,
  FIND_POINTS,
  HINTS_PER_GAME,
  HINT_COST,
  HINT_SECONDS,
  LEVEL_TIME,
  MISS_PENALTY,
  TIME_BONUS,
} from './config.js';
import { LEVELS } from './levels.js';

export const STATUS_TITLE = 'title';
export const STATUS_PLAY = 'play';
export const STATUS_PAUSED = 'paused';
export const STATUS_CLEAR = 'clear';
export const STATUS_OVER = 'over';

export const CLICK_FOUND = 1;
export const CLICK_MISS = 2;
export const CLICK_NONE = 0;

export function createWorld(random) {
  const state = {
    status: STATUS_TITLE,
    levelIndex: 0,
    found: [],
    score: 0,
    combo: 0,
    bestCombo: 0,
    hints: HINTS_PER_GAME,
    hintTarget: -1,
    hintUntil: 0,
    timeLeft: LEVEL_TIME,
    elapsed: 0,
    clearTimer: 0,
    clearBonus: 0,
    won: false,
    misses: 0,
    finds: 0,
    wrongFlash: null,
    wrongUntil: 0,
    shake: 0,
  };

  function level() {
    return LEVELS[state.levelIndex];
  }

  function resetLevel() {
    state.found = level().diffs.map(() => false);
    state.timeLeft = LEVEL_TIME;
    state.hintTarget = -1;
    state.combo = 0;
  }

  function reset() {
    state.levelIndex = 0;
    state.score = 0;
    state.combo = 0;
    state.bestCombo = 0;
    state.hints = HINTS_PER_GAME;
    state.won = false;
    state.misses = 0;
    state.finds = 0;
    state.wrongFlash = null;
    resetLevel();
    state.status = STATUS_PLAY;
  }

  function foundCount() {
    let count = 0;
    for (const f of state.found) if (f) count += 1;
    return count;
  }

  /** Click inside one picture panel, in panel coordinates. */
  function click(x, y) {
    if (state.status !== STATUS_PLAY) return CLICK_NONE;
    const diffs = level().diffs;
    for (let i = 0; i < diffs.length; i += 1) {
      if (state.found[i]) continue;
      const dx = x - diffs[i].x;
      const dy = y - diffs[i].y;
      const reach = diffs[i].r + 8;
      if (dx * dx + dy * dy <= reach * reach) {
        state.found[i] = true;
        state.finds += 1;
        const gained = FIND_POINTS + state.combo * COMBO_BONUS;
        state.score += gained;
        state.combo += 1;
        state.bestCombo = Math.max(state.bestCombo, state.combo);
        if (foundCount() === diffs.length) {
          state.clearBonus = Math.ceil(state.timeLeft) * TIME_BONUS;
          state.score += state.clearBonus;
          state.status = STATUS_CLEAR;
          state.clearTimer = CLEAR_SECONDS;
        }
        return CLICK_FOUND;
      }
    }
    state.score = Math.max(0, state.score - MISS_PENALTY);
    state.combo = 0;
    state.misses += 1;
    state.wrongFlash = { x, y };
    state.wrongUntil = state.elapsed + 0.6;
    state.shake = 0.35;
    return CLICK_MISS;
  }

  /** Spend a hint: pulse a random still-hidden difference for a while. */
  function hint() {
    if (state.status !== STATUS_PLAY || state.hints <= 0) return false;
    const hidden = [];
    for (let i = 0; i < state.found.length; i += 1) if (!state.found[i]) hidden.push(i);
    if (hidden.length === 0) return false;
    state.hints -= 1;
    state.score = Math.max(0, state.score - HINT_COST);
    state.hintTarget = hidden[Math.floor(random() * hidden.length)];
    state.hintUntil = state.elapsed + HINT_SECONDS;
    return true;
  }

  function nextLevel() {
    state.levelIndex += 1;
    if (state.levelIndex >= LEVELS.length) {
      state.won = true;
      state.status = STATUS_OVER;
      return;
    }
    resetLevel();
    state.status = STATUS_PLAY;
  }

  /** Advance the clock; returns true when the level just ran out of time. */
  function step(dt) {
    state.elapsed += dt;
    if (state.shake > 0) state.shake = Math.max(0, state.shake - dt);
    if (state.status === STATUS_CLEAR) {
      state.clearTimer -= dt;
      if (state.clearTimer <= 0) nextLevel();
      return false;
    }
    if (state.status !== STATUS_PLAY) return false;
    state.timeLeft -= dt;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.won = false;
      state.status = STATUS_OVER;
      return true;
    }
    return false;
  }

  resetLevel();
  return { state, level, reset, resetLevel, foundCount, click, hint, nextLevel, step };
}
