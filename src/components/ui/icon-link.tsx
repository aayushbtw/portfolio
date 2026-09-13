import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const iconLinkVariants = cva(
  "gap-xs px-sm py-xs [&_svg]:text-fg-3 hover:[&_svg]:text-fg-2 inline-flex translate-y-[-0.06em] items-center rounded-full align-middle leading-none transition-colors duration-150 ease-out [&_svg]:size-[0.9em] [&_svg]:shrink-0",
  {
    defaultVariants: { variant: "underline" },
    variants: {
      variant: {
        pill: "bg-bg-2 text-fg-1 hover:bg-border no-underline",
        underline: "animated-link px-[0.5px]",
      },
    },
  }
);

function IconLink({
  className,
  external,
  variant,
  ...props
}: React.ComponentProps<"a"> &
  VariantProps<typeof iconLinkVariants> & { external?: boolean }) {
  return (
    <a
      className={cn(iconLinkVariants({ variant }), className)}
      data-slot="icon-link"
      data-variant={variant ?? "underline"}
      rel={external ? "noopener" : undefined}
      target={external ? "_blank" : undefined}
      {...props}
    />
  );
}

export { IconLink };
