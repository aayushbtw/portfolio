/**
 * The `h1` row every page but home opens with: the title, and optionally one
 * piece of metadata pushed to the far right.
 */
function PageHeader({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="not-typeset flex items-center gap-sm"
      data-slot="page-header"
    >
      {/* No size class: typeset's `h1` rules reach into `not-typeset` subtrees
          on purpose, so this is the same title the home page's `h1` gets. */}
      <h1>{title}</h1>

      {children ? (
        <div className="ml-auto flex items-center gap-sm">{children}</div>
      ) : null}
    </div>
  );
}

export { PageHeader };
