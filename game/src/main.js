// Boot and the one loop: clicks and keys are read every frame, the world
// advances in real time, and the renderer paints what is there. The game
// moves between five screens: title, play, paused, level-clear and over.
//
// ?seed=N fixes the hint pick. ?shot=start|play|end (with &seed=N) stages
// that scene instead of running the loop, paints it twice and sets
// window.__shotReady for a screenshot.
import { BEST_KEY } from './config.js';
import { createRandom } from './random.js';
import { createWorld, CLICK_FOUND, CLICK_MISS, STATUS_CLEAR, STATUS_OVER, STATUS_PAUSED, STATUS_PLAY, STATUS_TITLE } from './world.js';
import { ACTION_CONFIRM, ACTION_HINT, ACTION_MUTE, ACTION_PAUSE, ACTION_RESTART, createInput } from './input.js';
import { createRenderer, buttonAt, panelAt } from './render.js';
import { createAudio } from './audio.js';
import { stageShot } from './shots.js';

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seedParam = Number.parseInt(params.get('seed') ?? '', 10);
const seed = Number.isInteger(seedParam) ? seedParam : Math.floor(Math.random() * 4294967296);

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const world = createWorld(createRandom(seed));
const audio = createAudio();
const renderer = createRenderer(canvas);

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off (private windows): the best score then lasts this visit only.
  }
}

function runShot(name) {
  const best = stageShot(name, world);
  let painted = 0;
  function paint() {
    renderer.draw(world.state, best, audio.isMuted());
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas, (x, y) => renderer.toLogical(x, y));
  let best = readBest();
  let last = performance.now();
  let lastTickSecond = -1;

  function announce(message) {
    status.textContent = message;
  }

  function startGame() {
    world.reset();
    lastTickSecond = -1;
    audio.unlock();
    announce('Playing. Find 7 differences in each picture pair.');
  }

  function endGame() {
    if (world.state.score > best) {
      best = world.state.score;
      saveBest(best);
    }
    if (world.state.won) {
      audio.win();
      announce(`You found them all! Final score ${world.state.score}. Best ${best}.`);
    } else {
      announce(`Time's up. Score ${world.state.score}. Best ${best}.`);
    }
  }

  function handleClick(point) {
    const state = world.state;
    audio.unlock();
    const button = buttonAt(point.x, point.y);
    if (button === 'hint') {
      if (world.hint()) {
        audio.hint();
        announce(`Hint used. ${state.hints} left.`);
      }
      return;
    }
    if (button === 'mute') {
      const muted = audio.toggleMute();
      announce(muted ? 'Sound off.' : 'Sound on.');
      return;
    }
    if (button === 'restart') {
      startGame();
      return;
    }
    if (button === 'pause') {
      if (state.status === STATUS_PLAY) {
        state.status = STATUS_PAUSED;
        announce('Paused.');
      } else if (state.status === STATUS_PAUSED) {
        state.status = STATUS_PLAY;
        announce('Playing.');
      }
      return;
    }
    if (state.status === STATUS_TITLE || state.status === STATUS_OVER) {
      startGame();
      return;
    }
    if (state.status === STATUS_PAUSED) {
      state.status = STATUS_PLAY;
      announce('Playing.');
      return;
    }
    if (state.status !== STATUS_PLAY) return;
    const hit = panelAt(point.x, point.y);
    if (hit === null) return;
    const result = world.click(hit.x, hit.y);
    if (result === CLICK_FOUND) {
      audio.found();
      const found = world.foundCount();
      announce(`Found ${found} of 7. Score ${state.score}.`);
    } else if (result === CLICK_MISS) {
      audio.wrong();
      announce('Not a difference. 15 points lost.');
    }
  }

  function handleActions() {
    const actions = input.takeActions();
    const state = world.state;
    if (actions & ACTION_MUTE) {
      const muted = audio.toggleMute();
      announce(muted ? 'Sound off.' : 'Sound on.');
    }
    if (actions & ACTION_RESTART) startGame();
    if (actions & ACTION_HINT) {
      if (world.hint()) {
        audio.hint();
        announce(`Hint used. ${state.hints} left.`);
      }
    }
    if (actions & ACTION_CONFIRM) {
      if (state.status === STATUS_TITLE || state.status === STATUS_OVER) startGame();
      else if (state.status === STATUS_PAUSED) {
        state.status = STATUS_PLAY;
        announce('Playing.');
      }
    }
    if (actions & ACTION_PAUSE) {
      if (state.status === STATUS_PLAY) {
        state.status = STATUS_PAUSED;
        announce('Paused.');
      } else if (state.status === STATUS_PAUSED) {
        state.status = STATUS_PLAY;
        announce('Playing.');
      }
    }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.25);
    last = now;
    handleActions();
    for (const point of input.takeClicks()) handleClick(point);
    const wasOver = world.state.status === STATUS_OVER;
    const wasClear = world.state.status === STATUS_CLEAR;
    const timedOut = world.step(dt);
    if (timedOut) {
      endGame();
    } else if (wasClear && world.state.status === STATUS_PLAY) {
      announce(`Level ${world.state.levelIndex + 1}. Find 7 differences.`);
    } else if (!wasOver && world.state.status === STATUS_OVER && world.state.won) {
      endGame();
    }
    if (world.state.status === STATUS_CLEAR && !wasClear) audio.clear();
    const second = Math.ceil(world.state.timeLeft);
    if (world.state.status === STATUS_PLAY && second !== lastTickSecond) {
      lastTickSecond = second;
      if (second <= 10 && second > 0) audio.tick();
    }
    renderer.draw(world.state, best, audio.isMuted());
  }

  // Leaving the tab pauses a running game rather than letting the clock run unseen.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && world.state.status === STATUS_PLAY) {
      world.state.status = STATUS_PAUSED;
      announce('Paused.');
    }
  });

  announce('Spot the Difference. Press Space or click to start.');
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
