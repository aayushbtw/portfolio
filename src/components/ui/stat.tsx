import * as stylex from "@stylexjs/stylex";
import { Box } from "~/components/primitives/box";
import type { StyleProp } from "~/components/primitives/style-prop";
import { Text } from "~/components/primitives/text";
import { breakpoint } from "~/styles/breakpoints.stylex";
import { spacing } from "~/styles/tokens/layout.stylex";

/* The strip owns its own grid rather than taking `Box`'s `columns`, because
   two-then-four is a decision about this component: it is tuned for four peers
   and collapses to pairs, not to a single column. */
const styles = stylex.create({
  strip: {
    display: "grid",
    gap: spacing.lg,
    gridTemplateColumns: {
      default: "repeat(2, minmax(0, 1fr))",
      [breakpoint.sm]: "repeat(4, minmax(0, 1fr))",
    },
  },
});

/**
 * A row of peer figures. Every `Stat` inside shares one treatment, because the
 * whole point of a strip is that its members are comparable: the moment one
 * gets a bigger value or a longer label it must not get bigger type.
 */
function StatStrip({
  children,
  marginTop,
  style,
}: {
  children: React.ReactNode;
  marginTop?: "sm" | "md" | "lg" | "xl";
  style?: StyleProp;
}) {
  return (
    <Box marginTop={marginTop} style={[styles.strip, style]}>
      {children}
    </Box>
  );
}

/**
 * Label, value, and an optional subordinate detail. The value sits at `lead`
 * rather than a display size on purpose: several of these on one page are
 * secondary to whatever single figure the page is actually about.
 */
function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: React.ReactNode;
  detail?: React.ReactNode;
}) {
  return (
    <Box display="flex" flexDirection="column" gap="xs">
      <Text as="span" variant="label">
        {label}
      </Text>
      <Text as="span" color="fg-2" numeric="tabular" variant="lead">
        {value}
      </Text>
      {detail ? (
        <Text as="span" numeric="tabular" variant="label">
          {detail}
        </Text>
      ) : null}
    </Box>
  );
}

export { Stat, StatStrip };
