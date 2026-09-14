import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { collections } from "tomekit/content";

import { listDocuments, renderDocument } from "~/server/content";

const getExplorations = createServerFn({ method: "GET" }).handler(() =>
  listDocuments(collections.get("explorations")).filter(
    ({ draft }) => import.meta.env.DEV || !draft
  )
);

const getExploration = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) => {
    const explorations = collections.get("explorations");

    if (!import.meta.env.DEV && explorations.get(slug)?.metadata.draft) {
      throw notFound();
    }

    return renderDocument(explorations, slug);
  });

export { getExploration, getExplorations };
