import "@tanstack/react-start/server-only";
import { createTanStackMarkdownHighlighter } from "@tanstack/highlight/markdown";
import type { MarkdownDocument } from "@tanstack/markdown";
import { Markdown } from "@tanstack/markdown/react";
import type { MarkdownComponents } from "@tanstack/markdown/react";
import type { ComponentPropsWithoutRef, ReactElement } from "react";

import { After, Before, Compare } from "~/components/compare";
import { Demo } from "~/components/demo";
import { ShowcaseImage } from "~/components/showcase";
import { highlighter } from "~/lib/highlight";

const highlightCode = createTanStackMarkdownHighlighter(highlighter);

function MarkdownLink({ href, ...props }: ComponentPropsWithoutRef<"a">) {
  const external = href?.startsWith("http") ?? false;
  return (
    <a
      href={href}
      rel={external ? "noopener" : undefined}
      target={external ? "_blank" : undefined}
      {...props}
    />
  );
}

// Comment-component attributes arrive as strings, so the numeric prop the image
// needs for its aspect ratio has to be recovered here.
function MarkdownShowcaseImage({
  height,
  ...props
}: { height: string } & Omit<
  ComponentPropsWithoutRef<typeof ShowcaseImage>,
  "height"
>) {
  return <ShowcaseImage height={Number(height)} {...props} />;
}

// The renderer's own `headingAnchors` hangs a separate `#` link off the
// heading; the whole title is the target here instead, so the link takes the
// heading's children and the `#` is drawn in CSS.
function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const Tag = `h${level}` as const;
  return function MarkdownHeading({
    children,
    id,
    ...props
  }: ComponentPropsWithoutRef<"h2">) {
    return (
      <Tag id={id} {...props}>
        {id ? (
          <a className="heading-anchor" href={`#${id}`}>
            {children}
          </a>
        ) : (
          children
        )}
      </Tag>
    );
  };
}

const components = {
  a: MarkdownLink,
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  "md-after": After,
  "md-before": Before,
  "md-compare": Compare,
  "md-demo": Demo,
  "md-showcase": "figure",
  "md-showcase-caption": "figcaption",
  "md-showcase-image": MarkdownShowcaseImage,
} satisfies MarkdownComponents;

function renderMarkdown(document: MarkdownDocument): ReactElement {
  return (
    <Markdown
      codeLineNumbers
      components={components}
      highlighter={highlightCode}
    >
      {document}
    </Markdown>
  );
}

export { renderMarkdown };
