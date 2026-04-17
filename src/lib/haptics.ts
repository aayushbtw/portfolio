import { useCallback, useRef } from "react";

const bufferCache = new WeakMap<AudioContext, Map<string, AudioBuffer>>();

function getCachedBuffer(ctx: AudioContext, key: string, create: () => AudioBuffer): AudioBuffer {
  let cache = bufferCache.get(ctx);
  if (!cache) {
    cache = new Map();
    bufferCache.set(ctx, cache);
  }
  let buffer = cache.get(key);
  if (!buffer) {
    buffer = create();
    cache.set(key, buffer);
  }
  return buffer;
}

function click(ctx: AudioContext): AudioScheduledSourceNode {
  const buffer = getCachedBuffer(ctx, "click", () => {
    const duration = 0.008;
    const buf = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 40);
    }
    return buf;
  });

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 3200;
  filter.Q.value = 3;

  const gain = ctx.createGain();
  gain.gain.value = 1.5;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.onended = () => source.disconnect();
  source.start(ctx.currentTime);

  if (navigator.vibrate) {
    navigator.vibrate(8);
  }

  return source;
}

function tick(ctx: AudioContext): AudioScheduledSourceNode {
  const t = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(800, t);
  osc.frequency.exponentialRampToValueAtTime(300, t + 0.015);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.35, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.018);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.02);

  return osc;
}

const sounds = { click, tick } as const;

type Sound = keyof typeof sounds;

export function useHaptics() {
  const ctx = useRef<AudioContext | null>(null);
  const activeSource = useRef<AudioScheduledSourceNode | null>(null);

  const trigger = useCallback((sound: Sound) => {
    ctx.current ??= new AudioContext();
    const audioCtx = ctx.current;
    const play = () => {
      try {
        activeSource.current?.stop();
      } catch {
        // already stopped
      }
      activeSource.current = sounds[sound](audioCtx);
    };
    if (audioCtx.state === "suspended") {
      audioCtx.resume().then(play);
    } else {
      play();
    }
  }, []);

  return { trigger };
}
