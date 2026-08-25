import { cn } from "~/lib/utils";

function PageHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={className} data-slot="page-header" {...props} />;
}

function PageTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return <h1 className={className} data-slot="page-title" {...props} />;
}

function PageDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("[--typeset-flow:var(--spacing-sm)]", className)}
      data-slot="page-description"
      {...props}
    />
  );
}

export { PageDescription, PageHeader, PageTitle };
