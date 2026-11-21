// Synthesized sound effects (WebAudio, no audio files): a found chime, a
// wrong buzz, a hint blip, level-clear arpeggio and a win fanfare. The
// context is created on the first user gesture; everything is silent before.
export function createAudio() {
  let context = null;
  let muted = false;

  function ensure() {
    if (context === null) {
      try {
        const Ctor = window.AudioContext || window.webkitAudioContext;
        context = new Ctor();
      } catch {
        context = null;
      }
    }
    if (context !== null && context.state === 'suspended') context.resume();
    return context;
  }

  function tone(freq, start, length, type, volume) {
    const ctx = ensure();
    if (ctx === null || muted) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + length);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + length + 0.05);
  }

  return {
    unlock() {
      ensure();
    },
    toggleMute() {
      muted = !muted;
      return muted;
    },
    isMuted() {
      return muted;
    },
    click() {
      tone(660, 0, 0.07, 'sine', 0.08);
    },
    found() {
      tone(880, 0, 0.14, 'sine', 0.16);
      tone(1318, 0.09, 0.2, 'sine', 0.16);
    },
    wrong() {
      tone(160, 0, 0.22, 'square', 0.1);
      tone(110, 0.05, 0.25, 'square', 0.08);
    },
    hint() {
      tone(520, 0, 0.1, 'sine', 0.1);
      tone(780, 0.08, 0.14, 'sine', 0.1);
    },
    clear() {
      [523, 659, 784, 1046].forEach((freq, index) => tone(freq, index * 0.09, 0.22, 'triangle', 0.14));
    },
    win() {
      [523, 659, 784, 1046, 784, 1046, 1318].forEach((freq, index) => tone(freq, index * 0.11, 0.26, 'triangle', 0.14));
    },
    tick() {
      tone(980, 0, 0.06, 'sine', 0.07);
    },
  };
}
