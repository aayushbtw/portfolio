import { useCallback, useRef } from "react";

function click(ctx: AudioContext) {
  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const when = ctx.currentTime + 0.01;
  const duration = 0.008;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 40);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 3200;
  filter.Q.value = 3;

  const gain = ctx.createGain();
  gain.gain.value = 1.0;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.onended = () => source.disconnect();
  source.start(when);

  if (navigator.vibrate) {
    navigator.vibrate(8);
  }
}

function tick(ctx: AudioContext) {
  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const t = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(800, t);
  osc.frequency.exponentialRampToValueAtTime(300, t + 0.015);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.06, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.018);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.02);
}

const sounds = { click, tick } as const;

type Sound = keyof typeof sounds;

export function useHaptics() {
  const ctx = useRef<AudioContext | null>(null);

  const trigger = useCallback((sound: Sound) => {
    ctx.current ??= new AudioContext();
    sounds[sound](ctx.current);
  }, []);

  return { trigger };
}
