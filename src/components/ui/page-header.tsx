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
    <div
      className="not-typeset flex items-center gap-sm"
      data-slot="page-header"
    >
      {/* No size class. The colour guide in app.css sets every `h1` to body
          size, weight 500, `fg-1`, and it reaches into `not-typeset` subtrees
          on purpose, so this is the same title the home page's `h1` gets. */}
      <h1>{title}</h1>

      {/* No `mt-0` needed: typeset gives anything following a heading a 1em
          top margin, and `not-typeset` above is what excludes this from it. */}
      {children ? (
        <div className="ml-auto flex items-center gap-sm">{children}</div>
      ) : null}
    </div>
  );
}

export { PageHeader };
