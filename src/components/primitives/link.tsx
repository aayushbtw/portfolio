import * as stylex from "@stylexjs/stylex";
import { border, foreground } from "~/styles/tokens/color.stylex";
import { spacing } from "~/styles/tokens/layout.stylex";
import { fontWeight } from "~/styles/tokens/typography.stylex";

const styles = stylex.create({
  link: {
    color: foreground["fg-2"],
    fontWeight: fontWeight.medium,
    textDecorationLine: "underline",
    textDecorationColor: {
      default: border.strong,
      ":hover": border.brand,
    },
    textUnderlineOffset: "3px",
    transitionProperty: "color, text-decoration-color",
    transitionDuration: "200ms",
    transitionTimingFunction: "ease-out",
  },
  /* An icon inside a link tracks the link's hover rather than its own. StyleX
     has no descendant selector, so the link is marked and the icon reads the
     marked ancestor's state. This replaces `hover:[&_svg]:text-fg-2`. */
  icon: {
    display: "inline-block",
    width: "1rem",
    height: "1rem",
    marginInlineEnd: spacing.xs,
    marginBlockEnd: "2px",
    verticalAlign: "baseline",
    color: {
      default: foreground["fg-3"],
      [stylex.when.ancestor(":hover")]: foreground["fg-2"],
    },
  },
});

type TextLinkProps = React.ComponentProps<"a"> & { external?: boolean };

export function TextLink({ external, ...props }: TextLinkProps) {
  return (
    <a
      {...props}
      {...stylex.props(
        styles.link,
        // Marks this element as the ancestor `InlineIcon` watches for :hover.
        stylex.defaultMarker()
      )}
      rel={external ? "noopener" : undefined}
      target={external ? "_blank" : undefined}
    />
  );
}

interface InlineIconProps {
  as: React.ComponentType<React.ComponentProps<"svg">>;
}

export function InlineIcon({ as: Icon }: InlineIconProps) {
  return <Icon {...stylex.props(styles.icon)} />;
}
