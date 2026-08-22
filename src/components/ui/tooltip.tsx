import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";

function Tooltip({
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
          <TooltipPrimitive.Popup className="rounded-md bg-fg-1 px-sm py-xs text-bg-1">
            {text}
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

export { Tooltip };
