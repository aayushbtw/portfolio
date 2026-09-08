import { createServerFn } from "@tanstack/react-start";

import type { SkillListItem } from "~/components/skill-list";
import { allSkills, loadEntry } from "~/server/content";

function sortedSkills() {
  return allSkills.toSorted((a, b) => a.title.localeCompare(b.title));
}

// Plain data, not a rendered element. See the note in server/posts.tsx.
const skillListFn = createServerFn({ method: "GET" }).handler(
  (): SkillListItem[] =>
    sortedSkills().map((skill) => ({
      slug: skill.slug,
      summary: skill.summary,
      title: skill.title,
    }))
);

const skillBySlugFn = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) => loadEntry(allSkills, slug));

function getSkillList() {
  return skillListFn();
}

function getSkillBySlug(slug: string) {
  return skillBySlugFn({ data: slug });
}

export { getSkillBySlug, getSkillList };
