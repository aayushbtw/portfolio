import type { MarkdownDocument } from "@tanstack/markdown";
import { notFound } from "@tanstack/react-router";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import type { Collection } from "tomekit";

import { renderMarkdown } from "~/server/markdown";

interface MarkdownEntry<TMetadata extends object, TSlug extends string> {
  body: MarkdownDocument;
  metadata: TMetadata;
  slug: TSlug;
}

// Lists leave out `body`: a page that needs it reads one document.
function listDocuments<TMetadata extends object, TSlug extends string>(
  collection: Collection<MarkdownEntry<TMetadata, TSlug>>
) {
  return collection
    .documents()
    .map(({ metadata, slug }) => ({ ...metadata, slug }));
}

// The document itself never leaves the server: callers get the rendered body.
async function renderDocument<TMetadata extends object, TSlug extends string>(
  collection: Collection<MarkdownEntry<TMetadata, TSlug>>,
  slug: string
) {
  const document = collection.get(slug);
  if (!document) {
    throw notFound();
  }

  return {
    ...document.metadata,
    body: await renderServerComponent(renderMarkdown(document.body)),
    slug: document.slug,
  };
}

export { listDocuments, renderDocument };
