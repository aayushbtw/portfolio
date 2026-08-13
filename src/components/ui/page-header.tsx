import { Box } from "~/components/primitives/box";
import { Text } from "~/components/primitives/text";

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
    <Box alignItems="center" data-not-typeset display="flex" gap="sm">
      {/* `heading` is the same treatment the home page's `h1` gets, which is
          what keeps every page title on one decision. */}
      <Text as="h1" variant="heading">
        {title}
      </Text>

      {children ? (
        <Box
          alignItems="center"
          display="flex"
          gap="sm"
          marginInlineStart="auto"
        >
          {children}
        </Box>
      ) : null}
    </Box>
  );
}

export { PageHeader };
