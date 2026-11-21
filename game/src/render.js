// Drawing only: the world's state and the current screen in, pixels out.
// The 1280x720 playfield is scaled to fit the window and centred, the margin
// filled with the backdrop colour. Both panels paint the same scene — the
// left in its "A" state, the right in its "B" state — and found differences
// get a green ring on both sides.
import { FIELD, FONT, PALETTE, PANEL, PANEL_LEFT, PANEL_RIGHT } from './config.js';
import { LEVELS } from './levels.js';
import { STATUS_CLEAR, STATUS_OVER, STATUS_PAUSED, STATUS_PLAY, STATUS_TITLE } from './world.js';

export const BUTTONS = {
  hint: { x: 24, y: 652, w: 150, h: 52, label: 'Hint (H)' },
  pause: { x: 186, y: 652, w: 150, h: 52, label: 'Pause (P)' },
  mute: { x: 348, y: 652, w: 150, h: 52, label: 'Sound (M)' },
  restart: { x: 510, y: 652, w: 170, h: 52, label: 'Restart (R)' },
};

export function buttonAt(x, y) {
  for (const [name, b] of Object.entries(BUTTONS)) {
    if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return name;
  }
  return null;
}

/** Which panel (0 left, 1 right) a playfield point is in, with panel coords. */
export function panelAt(x, y) {
  for (const [index, p] of [PANEL_LEFT, PANEL_RIGHT].entries()) {
    if (x >= p.x && x <= p.x + PANEL.width && y >= p.y && y <= p.y + PANEL.height) {
      return { panel: index, x: x - p.x, y: y - p.y };
    }
  }
  return null;
}

export function createRenderer(canvas) {
  const context = canvas.getContext('2d');
  const view = { scale: 1, x: 0, y: 0 };
  const fonts = new Map();

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    const width = Math.round(window.innerWidth * ratio);
    const height = Math.round(window.innerHeight * ratio);
    canvas.width = width;
    canvas.height = height;
    view.scale = Math.min(width / FIELD.width, height / FIELD.height);
    view.x = (width - FIELD.width * view.scale) / 2;
    view.y = (height - FIELD.height * view.scale) / 2;
  }

  /** Convert a CSS pixel position on the canvas to playfield coordinates. */
  function toLogical(cssX, cssY) {
    const ratio = window.devicePixelRatio || 1;
    return {
      x: (cssX * ratio - view.x) / view.scale,
      y: (cssY * ratio - view.y) / view.scale,
    };
  }

  function text(value, x, y, size, color, align, baseline) {
    if (!fonts.has(size)) fonts.set(size, `${size}px ${FONT}`);
    context.font = fonts.get(size);
    context.fillStyle = color;
    context.textAlign = align ?? 'left';
    context.textBaseline = baseline ?? 'top';
    context.fillText(value, x, y);
  }

  function frame(x, y, w, h, color, width) {
    context.strokeStyle = color;
    context.lineWidth = width;
    context.strokeRect(x, y, w, h);
  }

  function drawMarkers(state, panel, variant) {
    const lvl = LEVELS[state.levelIndex];
    const diffs = lvl.diffs;
    for (let i = 0; i < diffs.length; i += 1) {
      if (!state.found[i]) continue;
      const d = diffs[i];
      context.strokeStyle = PALETTE.green;
      context.lineWidth = 4;
      context.beginPath();
      context.arc(d.x, d.y, d.r + 4, 0, Math.PI * 2);
      context.stroke();
      context.strokeStyle = 'rgba(74,222,128,0.35)';
      context.lineWidth = 2;
      context.beginPath();
      context.arc(d.x, d.y, d.r + 10, 0, Math.PI * 2);
      context.stroke();
    }
    // The hint target pulses gold on both panels.
    if (state.hintTarget >= 0 && state.elapsed < state.hintUntil && state.status === STATUS_PLAY) {
      const d = diffs[state.hintTarget];
      const pulse = 1 + 0.15 * Math.sin(state.elapsed * 10);
      context.strokeStyle = PALETTE.gold;
      context.lineWidth = 4;
      context.beginPath();
      context.arc(d.x, d.y, (d.r + 6) * pulse, 0, Math.PI * 2);
      context.stroke();
    }
    // A wrong click flashes a red X where it landed.
    if (state.wrongFlash !== null && state.elapsed < state.wrongUntil) {
      const { x, y } = state.wrongFlash;
      context.strokeStyle = PALETTE.red;
      context.lineWidth = 5;
      context.lineCap = 'round';
      context.beginPath();
      context.moveTo(x - 14, y - 14);
      context.lineTo(x + 14, y + 14);
      context.moveTo(x + 14, y - 14);
      context.lineTo(x - 14, y + 14);
      context.stroke();
    }
    void variant;
    void panel;
  }

  function drawPanel(state, origin, variant) {
    const lvl = LEVELS[state.levelIndex];
    context.save();
    context.beginPath();
    context.rect(origin.x, origin.y, PANEL.width, PANEL.height);
    context.clip();
    context.translate(origin.x, origin.y);
    const flags = lvl.diffs.map(() => variant === 'B');
    lvl.paint(context, flags);
    drawMarkers(state, origin, variant);
    context.restore();
    frame(origin.x - 2, origin.y - 2, PANEL.width + 4, PANEL.height + 4, '#454b6e', 3);
    text(variant === 'A' ? 'A' : 'B', origin.x + 14, origin.y + 12, 22, 'rgba(255,255,255,0.85)', 'left');
  }

  function drawHeader(state, best) {
    context.fillStyle = PALETTE.header;
    context.fillRect(0, 0, FIELD.width, 64);
    const lvl = LEVELS[state.levelIndex];
    text('🔍 Spot the Difference', 24, 12, 28, PALETTE.text, 'left');
    text(`${lvl.name}  ·  Level ${state.levelIndex + 1} of ${LEVELS.length}`, 24, 42, 16, PALETTE.muted, 'left');
    const found = state.found.filter(Boolean).length;
    text(`Found ${found}/${lvl.diffs.length}`, 640, 12, 26, PALETTE.gold, 'center');
    text(`Score ${state.score}   Best ${best}`, 640, 40, 16, PALETTE.muted, 'center');
    // Timer bar, right.
    const frac = Math.max(0, state.timeLeft / 90);
    const bx = 900;
    const bw = 320;
    context.fillStyle = '#3b4270';
    context.fillRect(bx, 18, bw, 18);
    context.fillStyle = frac > 0.25 ? PALETTE.green : PALETTE.red;
    context.fillRect(bx, 18, bw * frac, 18);
    text(`${Math.ceil(state.timeLeft)}s`, bx + bw / 2, 16, 16, '#ffffff', 'center');
    text(state.hints > 0 ? `Hints left: ${state.hints}` : 'No hints left', 900, 42, 16, PALETTE.muted, 'left');
    if (state.combo >= 2) text(`Combo x${state.combo} 🔥`, 1256, 42, 16, PALETTE.gold, 'right');
  }

  function drawBottomBar(state, muted) {
    // Level dots.
    for (let i = 0; i < LEVELS.length; i += 1) {
      context.fillStyle = i < state.levelIndex ? PALETTE.green : i === state.levelIndex ? PALETTE.gold : '#3b4270';
      context.beginPath();
      context.arc(730 + i * 34, 668, 9, 0, Math.PI * 2);
      context.fill();
    }
    text(`Level ${state.levelIndex + 1}/${LEVELS.length}`, 730, 688, 14, PALETTE.muted, 'left');
    for (const b of Object.values(BUTTONS)) {
      context.fillStyle = PALETTE.button;
      context.beginPath();
      context.roundRect(b.x, b.y, b.w, b.h, 10);
      context.fill();
      let label = b.label;
      if (b === BUTTONS.hint) label = `Hint (H) · ${state.hints}`;
      if (b === BUTTONS.mute) label = muted ? 'Muted (M)' : 'Sound (M)';
      text(label, b.x + b.w / 2, b.y + 15, 20, PALETTE.text, 'center');
    }
  }

  function drawPanelOverlay(title, lines, prompt) {
    context.fillStyle = 'rgba(10,12,26,0.72)';
    context.fillRect(0, 0, FIELD.width, FIELD.height);
    const w = 640;
    const h = 150 + lines.length * 34;
    const x = (FIELD.width - w) / 2;
    const y = (FIELD.height - h) / 2;
    context.fillStyle = PALETTE.panel;
    context.beginPath();
    context.roundRect(x, y, w, h, 16);
    context.fill();
    text(title, FIELD.width / 2, y + 28, 44, PALETTE.text, 'center');
    for (let i = 0; i < lines.length; i += 1) {
      text(lines[i], FIELD.width / 2, y + 92 + i * 34, 21, PALETTE.muted, 'center');
    }
    text(prompt, FIELD.width / 2, y + h - 38, 22, PALETTE.gold, 'center');
  }

  function draw(state, best, muted) {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.fillStyle = PALETTE.backdrop;
    context.fillRect(0, 0, canvas.width, canvas.height);
    const shakeX = state.shake > 0 ? (Math.random() - 0.5) * state.shake * 24 : 0;
    const shakeY = state.shake > 0 ? (Math.random() - 0.5) * state.shake * 24 : 0;
    context.setTransform(view.scale, 0, 0, view.scale, view.x + shakeX * view.scale, view.y + shakeY * view.scale);
    drawHeader(state, best);
    drawPanel(state, PANEL_LEFT, 'A');
    drawPanel(state, PANEL_RIGHT, 'B');
    // "VS" badge between the panels.
    context.fillStyle = PALETTE.gold;
    context.beginPath();
    context.arc(640, 356, 26, 0, Math.PI * 2);
    context.fill();
    text('VS', 640, 344, 22, '#22223a', 'center');
    drawBottomBar(state, muted);
    if (state.status === STATUS_TITLE) {
      drawPanelOverlay('Spot the Difference', [
        'Two pictures look the same — but 7 things changed.',
        'Click a difference on either picture to ring it.',
        '5 levels · 90 seconds each · H for a hint · wrong clicks cost points',
      ], 'Click or press Space to start');
    } else if (state.status === STATUS_PAUSED) {
      drawPanelOverlay('Paused', ['The clock is waiting for you.'], 'Press P or click to resume');
    } else if (state.status === STATUS_CLEAR) {
      const lvl = LEVELS[state.levelIndex];
      drawPanelOverlay('Level clear!', [
        `You found all ${lvl.diffs.length} differences in ${lvl.name}.`,
        `Time bonus +${state.clearBonus}   ·   Score ${state.score}`,
      ], 'Next level coming up…');
    } else if (state.status === STATUS_OVER) {
      if (state.won) {
        drawPanelOverlay('You found them all! 🎉', [
          `All 5 levels cleared — ${state.finds} differences found, best combo x${state.bestCombo}.`,
          `Final score ${state.score}   ·   Best ${best}`,
        ], 'Press Space or click to play again');
      } else {
        drawPanelOverlay("Time's up!", [
          `You found ${state.finds} differences across ${state.levelIndex + 1} level(s).`,
          `Score ${state.score}   ·   Best ${best}`,
        ], 'Press Space or click to try again');
      }
    }
  }

  resize();
  window.addEventListener('resize', resize);
  return { draw, toLogical, buttonAt };
}
