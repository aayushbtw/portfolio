import * as stylex from "@stylexjs/stylex";

/* Five stacked panes, each blurrier than the last and masked to start further
   in, so the blur ramps up instead of stepping. The numbers are a curve, not a
   scale: they belong to this effect and nothing else reads them. */
const LAYERS = [
  { blur: 0.5, transparent: 0 },
  { blur: 1, transparent: 20 },
  { blur: 2, transparent: 40 },
  { blur: 4, transparent: 60 },
  { blur: 8, transparent: 80 },
];

const styles = stylex.create({
  frame: {
    pointerEvents: "none",
    // Both users pin it to the viewport; there is no scrolling variant.
    position: "fixed",
    insetInline: 0,
    zIndex: 30,
    height: "3rem",
  },
  top: { top: 0 },
  bottom: { bottom: 0 },
  pane: { position: "absolute", inset: 0 },
  layer: (zIndex: number, blur: number, mask: string) => ({
    zIndex,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    maskImage: mask,
    WebkitMaskImage: mask,
  }),
});

export function ProgressiveBlur({
  position = "bottom",
}: {
  position?: "top" | "bottom";
}) {
  return (
    <div
      data-slot="progressive-blur"
      {...stylex.props(styles.frame, styles[position])}
    >
      {LAYERS.map(({ blur, transparent }, i) => {
        const mask = `linear-gradient(to ${position}, transparent ${transparent}%, black 100%)`;
        return (
          <div
            key={blur}
            {...stylex.props(styles.pane, styles.layer(i + 1, blur, mask))}
          />
        );
      })}
    </div>
  );
}
