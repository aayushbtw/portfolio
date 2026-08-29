import { cn } from "~/lib/utils";

/* Sibling of the page `h1`, so typeset's `h1 + *` rule supplies the gap above
   it; the tighter flow makes the title and its copy read as one block. */
function PageDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("[--typeset-flow:var(--spacing-sm)]", className)}
      data-slot="page-description"
      {...props}
    />
  );
}

export { PageDescription };
