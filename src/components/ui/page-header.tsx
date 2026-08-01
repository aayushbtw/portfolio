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
      <h1 className="text-eyebrow">{title}</h1>

      {children ? (
        <div className="ml-auto flex items-center gap-sm">{children}</div>
      ) : null}
    </div>
  );
}

export { PageHeader };
