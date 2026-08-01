/**
 * The `h1` row every page but home opens with: the title, and optionally one
 * piece of metadata pushed to the far right. Owning the `h1` here is the point.
 * The page title's treatment lives in one file instead of being restated at
 * five call sites, so changing it stays a one-line change.
 */
function PageHeader({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-sm" data-slot="page-header">
      {/* No size class: typeset already sets `h1` to body size, weight 500,
          `fg-1`. That is the page title treatment, and it is the same one the
          home page's `h1` gets, so every page now agrees. */}
      <h1>{title}</h1>

      {children ? (
        <div className="ml-auto flex items-center gap-sm">{children}</div>
      ) : null}
    </div>
  );
}

export { PageHeader };
