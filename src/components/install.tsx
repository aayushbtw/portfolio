"use client";

import { Check } from "@phosphor-icons/react/Check";
import { Copy } from "@phosphor-icons/react/Copy";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useEffect, useRef, useState } from "react";

import { useHaptics } from "~/lib/haptics";
import { highlighter, SHELL_LANG } from "~/lib/highlight";
import {
  colors,
  durations,
  easings,
  fonts,
  fontSizes,
  lineHeights,
  media,
  presses,
  radii,
  shadows,
  space,
} from "~/styles/tokens.stylex";

const RESET_DELAY = 1500;

const styles = stylex.create({
  install: {
    backgroundColor: colors.fill,
    borderRadius: radii.md,
    boxShadow: shadows.card,
    display: "flex",
    flexDirection: "column",
    gap: space.xxs,
    padding: space.xxs,
  },
  command: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    boxShadow: shadows.card,
    display: "flex",
    fontFamily: fonts.mono,
    fontSize: fontSizes.xs,
    gap: space.md,
    lineHeight: lineHeights.code,
    paddingBlock: space.xs,
    paddingInlineEnd: space.xs,
    paddingInlineStart: space.md,
  },
  code: {
    flexGrow: 1,
    minWidth: 0,
    overflowX: "auto",
    scrollbarWidth: "none",
    whiteSpace: "nowrap",
  },
  prompt: {
    color: colors.textMuted,
    userSelect: "none",
  },
  copy: {
    borderRadius: radii.xs,
    color: {
      default: colors.textMuted,
      [media.hover]: {
        default: colors.textMuted,
        ":hover": colors.textPrimary,
      },
    },
    display: "flex",
    padding: space.xxs,
    transform: { default: null, ":active": presses.icon },
    transitionDuration: `${durations.hover}, ${durations.press}`,
    transitionProperty: "color, transform",
    transitionTimingFunction: `ease, ${easings.out}`,
  },
  // Both icons share one cell, so the swap is a crossfade in place.
  icons: {
    display: "grid",
  },
  icon: {
    display: "flex",
    gridArea: "1 / 1",
    transitionDuration: "300ms",
    transitionProperty: {
      default: "opacity, filter, transform",
      [media.reducedMotion]: "opacity, filter",
    },
    transitionTimingFunction: "ease-in-out",
  },
  // Blur bridges the two shapes so they read as one morph.
  hidden: {
    filter: "blur(4px)",
    opacity: 0,
    transform: "scale(0.25)",
  },
  links: {
    display: "flex",
    gap: space.xxs,
  },
  link: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    boxShadow: shadows.card,
    color: {
      default: colors.textSecondary,
      [media.hover]: {
        default: colors.textSecondary,
        ":hover": colors.textPrimary,
      },
    },
    display: "flex",
    flexGrow: 1,
    flexBasis: 0,
    fontSize: fontSizes.sm,
    gap: space.xs,
    justifyContent: "center",
    lineHeight: lineHeights.row,
    paddingBlock: space.xs,
  },
});

function Install({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleXStyles;
}) {
  return <div {...stylex.props(styles.install, style)}>{children}</div>;
}

function InstallCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(null);
  const { trigger } = useHaptics();

  useEffect(() => () => clearTimeout(timeout.current ?? undefined), []);

  async function copy() {
    await navigator.clipboard.writeText(command);
    trigger("click");
    setCopied(true);
    clearTimeout(timeout.current ?? undefined);
    timeout.current = setTimeout(() => setCopied(false), RESET_DELAY);
  }

  return (
    <div {...stylex.props(styles.command)}>
      <code translate="no" {...stylex.props(styles.code)}>
        <span {...stylex.props(styles.prompt)}>$ </span>
        {highlightShell(command).map((token) => (
          <span
            className={token.className && `th-token th-${token.className}`}
            key={token.key}
          >
            {token.value}
          </span>
        ))}
      </code>

      <button
        aria-label={copied ? "Copied" : "Copy command"}
        onClick={copy}
        type="button"
        {...stylex.props(styles.copy)}
      >
        <span aria-hidden="true" {...stylex.props(styles.icons)}>
          <span {...stylex.props(styles.icon, !copied && styles.hidden)}>
            <Check size={16} weight="light" />
          </span>
          <span {...stylex.props(styles.icon, copied && styles.hidden)}>
            <Copy size={16} weight="light" />
          </span>
        </span>
      </button>
    </div>
  );
}

function InstallLinks({ children }: { children: React.ReactNode }) {
  return <div {...stylex.props(styles.links)}>{children}</div>;
}

function InstallLink(
  props: Omit<React.ComponentProps<"a">, "className" | "style">
) {
  return (
    <a
      rel="noopener"
      target="_blank"
      {...props}
      {...stylex.props(styles.link)}
    />
  );
}

/* Keyed by offset, not index: two identical words would collide. */
function highlightShell(command: string) {
  let offset = 0;

  return highlighter
    .tokenize(command, { lang: SHELL_LANG })
    .tokens.map((token) => {
      const key = `${offset}-${token.value}`;
      offset += token.value.length;

      return { className: token.className, key, value: token.value };
    });
}

/** Markdown's `::install`: just the command, for a package a post introduces. */
function InstallBlock({
  command,
  style,
}: {
  command: string;
  style?: StyleXStyles;
}) {
  return (
    <Install style={style}>
      <InstallCommand command={command} />
    </Install>
  );
}

export { Install, InstallBlock, InstallCommand, InstallLink, InstallLinks };
