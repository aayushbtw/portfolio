import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import * as stylex from "@stylexjs/stylex";
import { background, foreground } from "~/styles/tokens/color.stylex";
import { radius, spacing } from "~/styles/tokens/layout.stylex";

/* Base UI owns these elements, so styles reach them as `className`/`style`
   props rather than through `Box`. `stylex.props()` returns exactly that pair,
   so it spreads on directly. This is the sanctioned bridge to a third-party
   component, not an escape hatch. */
const styles = stylex.create({
  positioner: {
    isolation: "isolate",
    zIndex: 50,
  },
  popup: {
    backgroundColor: background.contrast,
    color: foreground.contrast,
    borderRadius: radius.md,
    paddingInline: spacing.sm,
    paddingBlock: spacing.xs,
  },
});

function ContributionTooltip({
  anchor,
  open,
  text,
}: {
  anchor: React.RefObject<SVGRectElement | null>;
  open: boolean;
  text: string;
}) {
  return (
    <TooltipPrimitive.Root open={open}>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner
          anchor={anchor}
          side="top"
          sideOffset={4}
          {...stylex.props(styles.positioner)}
        >
          <TooltipPrimitive.Popup {...stylex.props(styles.popup)}>
            {text}
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

export { ContributionTooltip };
