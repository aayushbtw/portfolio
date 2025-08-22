import { cn } from "@/lib/utils";

function Panel({ className, ...props }: React.ComponentProps<"section">) {
  return <section data-slot="panel" className={cn("", className)} {...props} />;
}

function PanelHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="panel-header" className={cn("", className)} {...props} />
  );
}

function PanelEyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="panel-eyebrow"
      className={cn(
        "mb-2 font-mono font-semibold text-sm tracking-widest text-foreground/40 uppercase",
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
        "font-medium mb-6",
        as === "h1" && "text-[22px] tracking-tighter",
        as === "h2" && "text-base",
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
      className={cn("text-muted-foreground mb-6", className)}
      {...props}
    />
  );
}

function PanelContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="panel-body" className={cn("", className)} {...props} />
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
