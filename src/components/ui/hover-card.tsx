"use client";

import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";
import * as stylex from "@stylexjs/stylex";

import { colors, radii } from "~/styles/tokens.stylex";

const styles = stylex.create({
  positioner: {
    isolation: "isolate",
    zIndex: 50,
  },
  popup: {
    backgroundColor: colors.background,
    borderColor: colors.fillStrong,
    borderRadius: radii.md,
    borderStyle: "solid",
    borderWidth: 1,
    boxShadow: `0 4px 16px ${colors.shadow}`,
    overflow: "hidden",
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
        <PreviewCardPrimitive.Popup {...stylex.props(styles.popup)}>
          {children}
        </PreviewCardPrimitive.Popup>
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardContent, HoverCardTrigger };
