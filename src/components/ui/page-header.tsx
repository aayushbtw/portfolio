import * as stylex from "@stylexjs/stylex";
import { text } from "~/styles/text";
import { spacing } from "~/styles/tokens/layout.stylex";

const styles = stylex.create({
  row: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
  },
  /* Pushed to the far right of the row rather than laid out after the title, so
     the metadata's position does not depend on how long the title is. */
  meta: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    marginInlineStart: "auto",
  },
});

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
    <div {...stylex.props(styles.row)}>
      {/* `heading` is the same treatment the home page's `h1` gets, which is
          what keeps every page title on one decision. */}
      <h1 {...stylex.props(text.heading)}>{title}</h1>

      {children ? <div {...stylex.props(styles.meta)}>{children}</div> : null}
    </div>
  );
}

export { PageHeader };
