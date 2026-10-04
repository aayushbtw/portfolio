import "@tanstack/react-start/server-only";
import * as stylex from "@stylexjs/stylex";
import { createHighlighter } from "@tanstack/highlight/core";
import { shell } from "@tanstack/highlight/languages/shell";
import { ts } from "@tanstack/highlight/languages/ts";
import { createTanStackMarkdownHighlighter } from "@tanstack/highlight/markdown";
import type { MarkdownDocument } from "@tanstack/markdown";
import { Markdown } from "@tanstack/markdown/react";
import type { MarkdownComponents } from "@tanstack/markdown/react";
import type { ComponentPropsWithoutRef, ReactElement } from "react";

import { After, Before, Compare } from "~/components/compare";
import { Demo } from "~/components/demo";
import { ShowcaseImage } from "~/components/showcase";
import {
  colors,
  fonts,
  fontSizes,
  layout,
  lineHeights,
  media,
  radii,
  space,
} from "~/styles/tokens.stylex";

// Prose renders on the server and never hydrates, so it can carry more
// languages than the shared client registry without growing the bundle.
const highlightCode = createTanStackMarkdownHighlighter(
  createHighlighter({ languages: [shell, ts] })
);

const flow = {
  marginBlockEnd: { default: space.md, ":last-child": 0 },
} as const;

const styles = stylex.create({
  prose: {
    color: colors.textSecondary,
    lineHeight: lineHeights.prose,
    minWidth: 0,
    overflowWrap: "break-word",
  },
  p: flow,
  block: flow,
  h2: {
    color: colors.textPrimary,
    lineHeight: lineHeights.row,
    marginBlockEnd: space.sm,
    marginBlockStart: { default: space.xl, ":first-child": 0 },
    scrollMarginTop: { default: space.xl, [media.lg]: layout.pageTop },
  },
  headingLink: {
    color: "inherit",
    position: "relative",
  },
  hash: {
    color: colors.textMuted,
    insetInlineEnd: "100%",
    opacity: { default: 0, [stylex.when.ancestor(":hover")]: 1 },
    paddingInlineEnd: 6,
    position: "absolute",
    userSelect: "none",
  },
  a: {
    color: colors.textPrimary,
    textDecorationColor: {
      default: colors.borderStrong,
      ":hover": colors.textPrimary,
    },
    textDecorationLine: "underline",
    textUnderlineOffset: 3,
  },
  strong: {
    color: colors.textPrimary,
    fontWeight: 500,
  },
  ul: {
    ...flow,
    listStyle: "disc",
    paddingInlineStart: space.lg,
  },
  li: {
    "::marker": { color: colors.textMuted },
    marginBlockEnd: space.xxs,
  },
  blockquote: {
    ...flow,
    borderInlineStartColor: colors.borderStrong,
    borderInlineStartStyle: "solid",
    borderInlineStartWidth: 2,
    paddingInlineStart: space.md,
  },
  code: {
    backgroundColor: colors.fillSubtle,
    borderColor: colors.fill,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: radii.xs,
    color: colors.textPrimary,
    fontFamily: fonts.mono,
    fontSize: fontSizes.xs,
    paddingBlock: 1,
    paddingInline: 3,
  },
  pre: {
    ...flow,
    backgroundColor: colors.fillSubtle,
    borderColor: colors.fill,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: radii.md,
    color: colors.textPrimary,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.code,
    overflowX: "auto",
    paddingBlock: space.sm,
    paddingInline: space.md,
    scrollbarWidth: "none",
    tabSize: 2,
  },
  preCode: {
    display: "inline-block",
    fontFamily: fonts.mono,
    minWidth: "100%",
  },
  figure: flow,
  figcaption: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    marginBlockStart: space.xs,
    textAlign: "center",
  },
});

function MarkdownLink({ href, ...props }: ComponentPropsWithoutRef<"a">) {
  const external = href?.startsWith("http") ?? false;

  return (
    <a
      href={href}
      rel={external ? "noopener" : undefined}
      target={external ? "_blank" : undefined}
      {...props}
      {...stylex.props(styles.a)}
    />
  );
}

// The renderer's own `headingAnchors` hangs a separate `#` link off the
// heading; the whole title is the target here instead.
function MarkdownHeading({
  children,
  id,
  ...props
}: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2 id={id} {...props} {...stylex.props(styles.h2)}>
      {id ? (
        <a
          href={`#${id}`}
          {...stylex.props(stylex.defaultMarker(), styles.headingLink)}
        >
          <span aria-hidden="true" {...stylex.props(styles.hash)}>
            #
          </span>
          {children}
        </a>
      ) : (
        children
      )}
    </h2>
  );
}

// Only a fenced block's `code` carries a `language-*` class.
function MarkdownCode({
  className,
  ...props
}: ComponentPropsWithoutRef<"code">) {
  const inPre = className?.startsWith("language-") ?? false;

  return (
    <code {...props} {...stylex.props(inPre ? styles.preCode : styles.code)} />
  );
}

const components = {
  a: MarkdownLink,
  blockquote: (props) => (
    <blockquote {...props} {...stylex.props(styles.blockquote)} />
  ),
  code: MarkdownCode,
  h2: MarkdownHeading,
  li: (props) => <li {...props} {...stylex.props(styles.li)} />,
  "md-after": After,
  "md-before": Before,
  "md-compare": (props) => <Compare {...props} style={styles.block} />,
  "md-demo": (props) => <Demo {...props} style={styles.block} />,
  "md-showcase": (props) => (
    <figure {...props} {...stylex.props(styles.figure)} />
  ),
  "md-showcase-caption": (props) => (
    <figcaption {...props} {...stylex.props(styles.figcaption)} />
  ),
  "md-showcase-image": ShowcaseImage,
  p: (props) => <p {...props} {...stylex.props(styles.p)} />,
  // Replacing the class keeps `data-lang`, which the line-number CSS keys on.
  pre: (props) => <pre {...props} {...stylex.props(styles.pre)} />,
  strong: (props) => <strong {...props} {...stylex.props(styles.strong)} />,
  ul: (props) => <ul {...props} {...stylex.props(styles.ul)} />,
} satisfies MarkdownComponents;

function renderMarkdown(document: MarkdownDocument): ReactElement {
  return (
    <div {...stylex.props(styles.prose)}>
      <Markdown
        codeLineNumbers
        components={components}
        highlighter={highlightCode}
      >
        {document}
      </Markdown>
    </div>
  );
}

export { renderMarkdown };
