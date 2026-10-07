import { createServerFn } from "@tanstack/react-start";
import { skills } from "tomekit/content";

import { listDocuments, renderDocument } from "~/server/content";

const getSkills = createServerFn({ method: "GET" }).handler(() =>
  listDocuments(skills)
);

const getSkill = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => await renderDocument(skills, slug));

export { getSkill, getSkills };
