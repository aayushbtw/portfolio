import { cn } from "@/lib/utils";

function LinkText({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-xs",
        "text-fg-2/70 transition-colors duration-200",
        "group-hover:text-fg-2 group-focus-visible:text-fg-2",
        className
      )}
      {...props}
    >
      <span className="transition-transform duration-300 ease-out group-hover:-translate-x-1 group-focus-visible:-translate-x-1">
        [
      </span>

      <span className="mx-xs opacity-80 transition-opacity duration-200 group-hover:opacity-100">
        {children}
      </span>

      <span className="transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1">
        ]
      </span>
    </span>
  );
}

export { LinkText };
