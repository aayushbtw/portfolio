import { createServerFn } from "@tanstack/react-start";
import { collections } from "tomekit/content";

import { listDocuments, renderDocument } from "~/server/content";

const getWritings = createServerFn({ method: "GET" }).handler(() =>
  listDocuments(collections.get("writings"))
);

const getWriting = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) =>
    renderDocument(collections.get("writings"), slug)
  );

export { getWriting, getWritings };
