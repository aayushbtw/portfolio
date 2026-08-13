import * as stylex from "@stylexjs/stylex";
import { Box } from "~/components/primitives/box";
import { breakpoint } from "~/styles/breakpoints.stylex";
import { spacing } from "~/styles/tokens/layout.stylex";

/* A column that rides alongside the content and is simply absent when there is
   no room for it. Hidden rather than reflowed on purpose: both users of this
   are secondary navigation that the page already provides another way to.

   `top` matches the shell's own top padding at `lg`, so a stuck sidebar lines
   up with the first line of content rather than floating above it. */
const styles = stylex.create({
  rail: {
    position: "sticky",
    top: spacing["2xl"],
    display: { default: "none", [breakpoint.lg]: "block" },
  },
});

export function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <Box as="aside" style={styles.rail}>
      {children}
    </Box>
  );
}
