// The screenshot scenes behind ?shot=start|play|end. Each one sets the world
// to a fixed, deterministic state and returns the best score to show, so the
// frame is what a real game looks like and the same seed always gives the
// same frame.
import { STATUS_OVER, STATUS_PLAY, STATUS_TITLE } from './world.js';

/**
 * Set `world` to the named scene (start, play or end; any other name is
 * start) and return the best score to show.
 */
export function stageShot(name, world) {
  const state = world.state;
  if (name !== 'play' && name !== 'end') {
    world.resetLevel();
    state.levelIndex = 0;
    state.status = STATUS_TITLE;
    state.score = 0;
    state.timeLeft = 90;
    state.hints = 3;
    return 0;
  }
  if (name === 'play') {
    // Kitchen level, mid-game: three differences already ringed, one hint
    // pulsing on a fourth, the clock at 62 seconds.
    world.resetLevel();
    state.levelIndex = 1;
    state.status = STATUS_PLAY;
    state.found = [true, true, true, false, false, false, false];
    state.score = 385;
    state.combo = 2;
    state.bestCombo = 3;
    state.finds = 3;
    state.hints = 2;
    state.timeLeft = 62;
    state.elapsed = 28;
    state.hintTarget = 3;
    state.hintUntil = 30.5;
    return 385;
  }
  // end: every level cleared, victory screen with the final score.
  world.resetLevel();
  state.levelIndex = 4;
  state.status = STATUS_OVER;
  state.won = true;
  state.found = [true, true, true, true, true, true, true];
  state.score = 2840;
  state.combo = 0;
  state.bestCombo = 5;
  state.finds = 35;
  state.misses = 4;
  state.hints = 0;
  state.timeLeft = 41;
  return 2840;
}
