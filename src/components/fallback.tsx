import { ArrowRight } from "@phosphor-icons/react/ArrowRight";
import * as stylex from "@stylexjs/stylex";

import {
  List,
  ListItem,
  ListItemLeader,
  ListItemMeta,
  ListItemTitle,
} from "~/components/ui/list";
import { Section } from "~/components/ui/page";
import { colors, fontSizes, layout, space } from "~/styles/tokens.stylex";

const pages = [
  { href: "/", name: "Home", tag: "Start here" },
  { href: "/writings", name: "Writings", tag: "Posts" },
  { href: "/skills", name: "Skills", tag: "Agent instructions" },
  { href: "/explorations", name: "Explorations", tag: "Components" },
];

const styles = stylex.create({
  main: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: layout.sectionGap,
    justifyContent: "center",
    minHeight: "100dvh",
    paddingBlock: layout.pageTop,
    paddingInline: layout.gutter,
  },
  hero: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    textAlign: "center",
  },
  code: {
    color: colors.textPrimary,
    fontSize: fontSizes.display,
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "-0.04em",
    lineHeight: 1,
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  message: {
    color: colors.textSecondary,
  },
  pages: {
    maxWidth: 420,
    width: "100%",
  },
});

function Fallback({
  code,
  label,
  message,
}: {
  code: string;
  label: string;
  message: string;
}) {
  return (
    <main {...stylex.props(styles.main)}>
      <div {...stylex.props(styles.hero)}>
        <h1 {...stylex.props(styles.code)}>{code}</h1>
        <p {...stylex.props(styles.label)}>{label}</p>
        <p {...stylex.props(styles.message)}>{message}</p>
      </div>

      {/* Plain links: after an error, a full load is the safer reset. */}
      <div {...stylex.props(styles.pages)}>
        <Section title="Pages">
          <List>
            {pages.map((page) => (
              <ListItem href={page.href} key={page.href}>
                <ListItemTitle>{page.name}</ListItemTitle>
                <ListItemLeader />
                <ListItemMeta>
                  {page.tag}
                  <ArrowRight aria-hidden="true" size={13} weight="light" />
                </ListItemMeta>
              </ListItem>
            ))}
          </List>
        </Section>
      </div>
    </main>
  );
}

export { Fallback };
