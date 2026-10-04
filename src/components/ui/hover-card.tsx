"use client";

import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";
import * as stylex from "@stylexjs/stylex";

import {
  colors,
  durations,
  easings,
  radii,
  shadows,
} from "~/styles/tokens.stylex";

const styles = stylex.create({
  positioner: {
    isolation: "isolate",
    zIndex: 50,
  },
  popup: {
    backgroundColor: colors.background,
    borderRadius: radii.md,
    boxShadow: shadows.popover,
    overflow: "hidden",
    transformOrigin: "var(--transform-origin)",
    transitionDuration: durations.popover,
    transitionProperty: "opacity, transform",
    transitionTimingFunction: easings.out,
  },
  hidden: {
    opacity: 0,
    transform: "scale(0.96)",
  },
  // Leaving is the system responding, so it is quicker than arriving.
  leaving: {
    transitionDuration: "120ms",
  },
});

function HoverCard(props: PreviewCardPrimitive.Root.Props) {
  return <PreviewCardPrimitive.Root {...props} />;
}

function HoverCardTrigger(props: PreviewCardPrimitive.Trigger.Props) {
  return <PreviewCardPrimitive.Trigger delay={100} {...props} />;
}

function HoverCardContent({
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 4,
  children,
}: Pick<PreviewCardPrimitive.Popup.Props, "children"> &
  Pick<
    PreviewCardPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <PreviewCardPrimitive.Portal>
      <PreviewCardPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        {...stylex.props(styles.positioner)}
      >
        <PreviewCardPrimitive.Popup
          className={({ transitionStatus }) =>
            stylex.props(
              styles.popup,
              transitionStatus !== undefined &&
                transitionStatus !== "idle" &&
                styles.hidden,
              transitionStatus === "ending" && styles.leaving
            ).className ?? ""
          }
        >
          {children}
        </PreviewCardPrimitive.Popup>
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardContent, HoverCardTrigger };
