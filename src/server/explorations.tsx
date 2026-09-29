import { createServerFn } from "@tanstack/react-start";
import { explorations } from "tomekit/content";

import { listDocuments, renderDocument } from "~/server/content";

const getExplorations = createServerFn({ method: "GET" }).handler(() =>
  listDocuments(explorations)
);

const getExploration = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) => renderDocument(explorations, slug));

export { getExploration, getExplorations };
