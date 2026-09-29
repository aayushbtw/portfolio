import { createServerFn } from "@tanstack/react-start";
import { writings } from "tomekit/content";

import { listDocuments, renderDocument } from "~/server/content";

const getWritings = createServerFn({ method: "GET" }).handler(() =>
  listDocuments(writings)
);

const getWriting = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) => renderDocument(writings, slug));

export { getWriting, getWritings };
