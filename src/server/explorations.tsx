import { createServerFn } from "@tanstack/react-start";
import { collections } from "tomekit/content";

import { listDocuments, renderDocument } from "~/server/content";

const getExplorations = createServerFn({ method: "GET" }).handler(() =>
  listDocuments(collections.get("explorations"))
);

const getExploration = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) =>
    renderDocument(collections.get("explorations"), slug)
  );

export { getExploration, getExplorations };
