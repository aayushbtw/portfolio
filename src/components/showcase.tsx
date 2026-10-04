import * as stylex from "@stylexjs/stylex";

import { colors, radii } from "~/styles/tokens.stylex";

const styles = stylex.create({
  image: {
    borderRadius: radii.md,
    boxShadow: `0 0 0 1px ${colors.fill}`,
    height: "auto",
    width: "100%",
  },
});

function ShowcaseImage({ src, alt = "" }: { src: string; alt?: string }) {
  return (
    <img
      alt={alt}
      decoding="async"
      loading="lazy"
      src={src}
      {...stylex.props(styles.image)}
    />
  );
}

export { ShowcaseImage };
