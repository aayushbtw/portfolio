import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

function Panel({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="panel"
      className={cn("line-before line-after", className)}
      {...props}
    />
  );
}

function PanelHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-header"
      className={cn("line-after px-2 max-sm:px-4", className)}
      {...props}
    />
  );
}

function PanelEyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="panel-eyebrow"
      className={cn(
        "line-after mb-4 font-mono font-semibold text-sm tracking-widest text-foreground/40 uppercase",
        className,
      )}
      {...props}
    />
  );
}

function PanelTitle({
  className,
  as = "h2",
  ...props
}: React.ComponentProps<"h2"> & { as?: "h1" | "h2" }) {
  const Comp = as;

  return (
    <Comp
      data-slot="panel-title"
      className={cn(
        "line-before line-after font-medium tracking-tighter text-balance",
        as === "h1" ? "text-[2.5rem]/10" : "text-2xl/10",
        className,
      )}
      {...props}
    />
  );
}

function PanelDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="panel-description"
      className={cn("max-w-2xl text-base/7 text-muted-foreground", className)}
      {...props}
    />
  );
}

function PanelContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-body"
      className={cn("px-2 mt-12 line-before", className)}
      {...props}
    />
  );
}

export {
  Panel,
  PanelHeader,
  PanelEyebrow,
  PanelTitle,
  PanelDescription,
  PanelContent,
};
