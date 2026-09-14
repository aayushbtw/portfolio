import { createServerFn } from "@tanstack/react-start";

import type { SkillListItem } from "~/components/skill-list";
import { loadEntry, skills } from "~/server/content";

// Plain data, not a rendered element. See the note in server/posts.tsx.
const skillListFn = createServerFn({ method: "GET" }).handler(
  (): SkillListItem[] =>
    skills
      .documents()
      .toSorted((a, b) => a.metadata.title.localeCompare(b.metadata.title))
      .map(({ metadata: { category, title }, slug }) => ({
        category,
        slug,
        title,
      }))
);

const skillBySlugFn = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) => loadEntry(skills, slug));

function getSkillList() {
  return skillListFn();
}

function getSkillBySlug(slug: string) {
  return skillBySlugFn({ data: slug });
}

export { getSkillBySlug, getSkillList };
