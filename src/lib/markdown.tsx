import { createHighlighter } from "@tanstack/highlight/core";
import { shell } from "@tanstack/highlight/languages/shell";
import { createTanStackMarkdownHighlighter } from "@tanstack/highlight/markdown";
import type { ComponentNode, MarkdownHeading } from "@tanstack/markdown";
import { commentComponentsExtension } from "@tanstack/markdown/extensions/comment-components";
import { headingCollectionExtension } from "@tanstack/markdown/extensions/headings";
import { parseMarkdown } from "@tanstack/markdown/parser";
import { Markdown, type MarkdownComponents } from "@tanstack/markdown/react";
import type { ComponentPropsWithoutRef, ReactElement } from "react";
import {
  Showcase,
  ShowcaseCaption,
  ShowcaseImage,
} from "~/components/ui/showcase";

// `shell` already answers to bash, sh, zsh, cmd and console. Register a language
// here only once a fence in content/ actually uses it: every one adds a
// tokenizer to the server bundle. Built once: `createHighlighter` compiles a
// registry, so calling it per render would rebuild it every time.
const highlighter = createHighlighter({ languages: [shell] });

const highlightCode = createTanStackMarkdownHighlighter(highlighter);

// A comment component with no `tagName` renders as one generic element for every
// name, so the components map cannot tell `showcase` from `showcase-image`.
// Naming the tag is what makes it addressable.
function transformComponent(node: ComponentNode): ComponentNode {
  return { ...node, tagName: `md-${node.name}`, properties: node.attributes };
}

// One array, shared by every parse: the renderer has to be handed the same
// extensions the document was parsed with.
const extensions = [
  commentComponentsExtension({ transformComponent }),
  headingCollectionExtension(),
];

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

const components = {
  a: MarkdownLink,
  "md-showcase": Showcase,
  "md-showcase-image": MarkdownShowcaseImage,
  "md-showcase-caption": ShowcaseCaption,
} satisfies MarkdownComponents;

interface RenderedMarkdown {
  element: ReactElement;
  headings: MarkdownHeading[];
}

function renderMarkdown(source: string): RenderedMarkdown {
  const document = parseMarkdown(source, { extensions, headingIds: true });

  return {
    element: (
      <Markdown
        codeLineNumbers
        components={components}
        headingAnchors={{ className: "heading-anchor" }}
        highlighter={highlightCode}
      >
        {document}
      </Markdown>
    ),
    headings: document.headings ?? [],
  };
}

export { renderMarkdown };
