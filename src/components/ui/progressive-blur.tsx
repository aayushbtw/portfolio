import * as stylex from "@stylexjs/stylex";

import { layout, media, space } from "~/styles/tokens.stylex";

const LAYERS = [
  { blur: 1, transparent: 0 },
  { blur: 3, transparent: 33 },
  { blur: 8, transparent: 66 },
];

const styles = stylex.create({
  blur: {
    insetInline: 0,
    pointerEvents: "none",
    position: "fixed",
    zIndex: 30,
  },
  // Ends where an anchored heading lands, so the fade frames it.
  top: { height: { default: space.xl, [media.lg]: layout.pageTop }, top: 0 },
  bottom: { bottom: 0, height: space.xl },
  layer: {
    inset: 0,
    position: "absolute",
  },
});

function ProgressiveBlur({
  position = "bottom",
}: {
  position?: "top" | "bottom";
}) {
  const direction = `to ${position}`;

  return (
    <div aria-hidden="true" {...stylex.props(styles.blur, styles[position])}>
      {LAYERS.map(({ blur, transparent }, i) => {
        const maskImage = `linear-gradient(${direction}, transparent ${transparent}%, black 100%)`;

        return (
          <div
            key={blur}
            {...stylex.props(styles.layer)}
            style={{
              WebkitBackdropFilter: `blur(${blur}px)`,
              WebkitMaskImage: maskImage,
              backdropFilter: `blur(${blur}px)`,
              maskImage,
              zIndex: i + 1,
            }}
          />
        );
      })}
    </div>
  );
}

export { ProgressiveBlur };
