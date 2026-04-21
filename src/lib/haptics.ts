import { useCallback, useRef } from "react";

interface AudioNodes {
  clickBuffer: AudioBuffer;
  clickFilter: BiquadFilterNode;
  clickGain: GainNode;
  tickGain: GainNode;
}

const nodeCache = new WeakMap<AudioContext, AudioNodes>();

function getNodes(ctx: AudioContext): AudioNodes {
  let nodes = nodeCache.get(ctx);
  if (!nodes) {
    const clickBuffer = ctx.createBuffer(
      1,
      ctx.sampleRate * 0.004,
      ctx.sampleRate
    );

    const clickFilter = ctx.createBiquadFilter();
    clickFilter.type = "bandpass";
    clickFilter.Q.value = 8;

    const clickGain = ctx.createGain();
    clickGain.gain.value = 1.0;
    clickFilter.connect(clickGain);
    clickGain.connect(ctx.destination);

    const tickGain = ctx.createGain();
    tickGain.connect(ctx.destination);

    nodes = { clickBuffer, clickFilter, clickGain, tickGain };
    nodeCache.set(ctx, nodes);
  }
  return nodes;
}

function click(ctx: AudioContext): AudioScheduledSourceNode {
  const t = ctx.currentTime;
  const { clickBuffer, clickFilter } = getNodes(ctx);

  const data = clickBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 25);
  }

  clickFilter.frequency.value = 4000 * (1 + (Math.random() - 0.5) * 0.3);

  const source = ctx.createBufferSource();
  source.buffer = clickBuffer;
  source.connect(clickFilter);
  source.onended = () => source.disconnect();
  source.start(t);

  return source;
}

function tick(ctx: AudioContext): AudioScheduledSourceNode {
  const t = ctx.currentTime;
  const { tickGain } = getNodes(ctx);

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(800, t);
  osc.frequency.exponentialRampToValueAtTime(300, t + 0.015);

  tickGain.gain.cancelScheduledValues(t);
  tickGain.gain.setValueAtTime(0.35, t);
  tickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.018);

  osc.connect(tickGain);
  osc.onended = () => osc.disconnect();
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
