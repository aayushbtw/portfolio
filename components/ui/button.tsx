import type { VariantProps } from "cva";
import { cva } from "@/cva.config";
import { cn } from "@/lib/utils";

const buttonVariants = cva({
  base: [
    "cursor-pointer rounded-4xl font-medium leading-4",
    "transition-all duration-300 ease-in-out",
  ],
  variants: {
    intent: {
      default: [
        "bg-foreground text-background outline outline-foreground",
        "hover:bg-background hover:text-foreground hover:outline-border",
      ],
      outline: ["outline", "hover:bg-foreground hover:text-background"],
    },
    size: {
      default: "px-4.5 py-3 text-base",
    },
  },
  defaultVariants: {
    intent: "default",
    size: "default",
  },
});

function Button({
  className,
  intent,
  size,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      className={cn(buttonVariants({ intent, size, className }))}
      data-slot="button"
      {...props}
    />
  );
}

export { Button, buttonVariants };
