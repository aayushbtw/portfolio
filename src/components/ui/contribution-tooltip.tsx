import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";

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
          className="isolate z-50"
          side="top"
          sideOffset={4}
        >
          <TooltipPrimitive.Popup className="rounded-md bg-bg-contrast px-sm py-xs text-fg-contrast">
            {text}
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

export { ContributionTooltip };
