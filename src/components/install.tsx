import { Check } from "@phosphor-icons/react/Check";
import { Copy } from "@phosphor-icons/react/Copy";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useRef, useState } from "react";

import { useHaptics } from "~/lib/haptics";
import { highlighter, SHELL_LANG } from "~/lib/highlight";
import {
  colors,
  fonts,
  fontSizes,
  lineHeights,
  radii,
  space,
} from "~/styles/tokens.stylex";

const RESET_DELAY = 1500;

const styles = stylex.create({
  install: {
    backgroundColor: colors.fill,
    borderRadius: radii.md,
    display: "flex",
    flexDirection: "column",
    gap: space.xxs,
    padding: space.xxs,
  },
  command: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.sm,
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
    color: { default: colors.textMuted, ":hover": colors.textPrimary },
    display: "flex",
    padding: space.xxs,
  },
  links: {
    display: "flex",
    gap: space.xxs,
  },
  link: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    color: { default: colors.textSecondary, ":hover": colors.textPrimary },
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

function Install({ children }: { children: React.ReactNode }) {
  return <div {...stylex.props(styles.install)}>{children}</div>;
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
        {copied ? (
          <Check aria-hidden="true" size={16} weight="light" />
        ) : (
          <Copy aria-hidden="true" size={16} weight="light" />
        )}
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

export { Install, InstallCommand, InstallLink, InstallLinks };
