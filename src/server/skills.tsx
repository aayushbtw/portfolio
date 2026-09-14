import { createServerFn } from "@tanstack/react-start";
import { collections } from "tomekit/content";

import { listDocuments, renderDocument } from "~/server/content";

const getSkills = createServerFn({ method: "GET" }).handler(() =>
  listDocuments(collections.get("skills"))
);

const getSkill = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) => renderDocument(collections.get("skills"), slug));

export { getSkill, getSkills };
