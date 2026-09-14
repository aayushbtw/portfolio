import { createServerFn } from "@tanstack/react-start";

import type { SkillListItem } from "~/components/skill-list";
import { loadEntry, skills } from "~/server/content";

// Plain data, not a rendered element. See the note in server/posts.tsx.
const skillListFn = createServerFn({ method: "GET" }).handler(
  (): SkillListItem[] =>
    skills.all
      .toSorted((a, b) => a.title.localeCompare(b.title))
      .map(({ category, slug, title }) => ({ category, slug, title }))
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
