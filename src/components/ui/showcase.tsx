import * as stylex from "@stylexjs/stylex";
import { Image } from "@unpic/react";
import { Box } from "~/components/primitives/box";
import type { StyleProp } from "~/components/primitives/style-prop";
import { Text } from "~/components/primitives/text";
import { breakpoint } from "~/styles/breakpoints.stylex";
import { foreground } from "~/styles/tokens/color.stylex";
import { radius, shadow, spacing } from "~/styles/tokens/layout.stylex";

/* The backdrop only appears once there is width to show it. Below the
   breakpoint the screenshot runs edge to edge and the frame would be a border
   around nothing. */
const styles = stylex.create({
  frame: {
    position: "relative",
    overflow: "hidden",
    borderRadius: { default: null, [breakpoint.md]: radius.md },
  },
  backdrop: {
    position: "absolute",
    inset: 0,
    display: { default: "none", [breakpoint.md]: "block" },
    height: "100%",
    width: "100%",
    objectFit: "cover",
    pointerEvents: "none",
    userSelect: "none",
  },
  veil: {
    position: "absolute",
    inset: 0,
    display: { default: "none", [breakpoint.md]: "block" },
  },
  stage: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    padding: { default: null, [breakpoint.md]: spacing.md },
  },
  shot: {
    width: "100%",
    boxShadow: shadow.lifted,
    outlineWidth: "1px",
    outlineStyle: "solid",
    outlineColor: `color-mix(in oklch, ${foreground["fg-1"]} 10%, transparent)`,
  },
});

export function Showcase({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: StyleProp;
}) {
  return (
    <Box as="figure" style={style}>
      {children}
    </Box>
  );
}

export function ShowcaseImage({
  src,
  alt = "",
  height,
}: {
  src: string;
  alt?: string;
  height: number;
}) {
  return (
    <Box style={styles.frame}>
      <Image
        alt=""
        aria-hidden={true}
        draggable={false}
        height={1084}
        src="/showcase-background.png"
        width={1920}
        {...stylex.props(styles.backdrop)}
      />
      <Box backgroundColor="bg-1-veil" style={styles.veil} />
      <Box style={styles.stage}>
        <Image
          alt={alt}
          height={height}
          layout="fullWidth"
          src={src}
          {...stylex.props(styles.shot)}
        />
      </Box>
    </Box>
  );
}

export function ShowcaseCaption({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: StyleProp;
}) {
  return (
    <Text as="figcaption" style={style} variant="label">
      {children}
    </Text>
  );
}
