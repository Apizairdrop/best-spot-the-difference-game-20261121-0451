// Tuning numbers and colours for Spot the Difference: Detective Duo.
// The playfield is a fixed 1280x720 logical area; the renderer scales it to
// fit the window, so no rule below depends on the screen size.
export const FIELD = { width: 1280, height: 720 };

/** Two picture panels, side by side, each showing the same scene. */
export const PANEL = { width: 600, height: 560, gap: 32, top: 76 };
export const PANEL_LEFT = { x: 24, y: PANEL.top };
export const PANEL_RIGHT = { x: 24 + PANEL.width + PANEL.gap, y: PANEL.top };

/** Seconds on the clock for every level. */
export const LEVEL_TIME = 90;

/** Points for a found difference, plus this much per combo step. */
export const FIND_POINTS = 100;
export const COMBO_BONUS = 25;
/** Points lost on a wrong click, and the cost of one hint. */
export const MISS_PENALTY = 15;
export const HINT_COST = 25;
/** Time bonus per second left when a level is cleared. */
export const TIME_BONUS = 10;
/** Hints per game, and how long a hint ring pulses. */
export const HINTS_PER_GAME = 3;
export const HINT_SECONDS = 2.5;
/** Seconds the level-clear panel stays up before the next level. */
export const CLEAR_SECONDS = 2.6;

export const PALETTE = {
  backdrop: '#171a2e',
  header: '#232744',
  text: '#f4f1e6',
  muted: '#a9aec9',
  gold: '#f2c94c',
  green: '#4ade80',
  red: '#ef4444',
  panel: '#2a2f4d',
  button: '#3b4270',
  buttonHover: '#4a528a',
  accent: '#7dd3fc',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

/** Where the best score is kept between visits (this browser only). */
export const BEST_KEY = 'spot-the-difference.best';
