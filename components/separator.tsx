import { cn } from "@/lib/utils";

function SeparatorPattern({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-full",
        "before:absolute before:-left-[100vw] before:-z-1 before:h-10 before:w-[200vw]",
        "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-border)]",
        className,
      )}
    />
  );
}

function SeparatorLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "line-after h-6 sm:h-10 flex items-end text-xs/6 text-foreground/25 font-mono whitespace-pre",
        className,
      )}
      {...props}
    />
  );
}

export { SeparatorPattern, SeparatorLabel };
