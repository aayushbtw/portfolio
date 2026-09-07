import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import type { SkillListItem } from "~/components/skill-list";
import { allSkills } from "~/server/content";

function sortedSkills() {
  return allSkills.toSorted((a, b) => a.title.localeCompare(b.title));
}

// Plain data, not a rendered element. See the note in server/posts.tsx.
const getSkillList = createServerFn({ method: "GET" }).handler(
  (): SkillListItem[] =>
    sortedSkills().map((skill) => ({
      slug: skill.slug,
      summary: skill.summary,
      title: skill.title,
    }))
);

const skillBySlugFn = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) => {
    const skill = allSkills.find((s) => s.slug === slug);
    if (!skill) {
      throw notFound();
    }

    // The skill's text is on GitHub and skills.sh. This page argues for it
    // instead of reprinting it, so the rendered markdown never ships.
    return {
      description: skill.description,
      slug: skill.slug,
      summary: skill.summary,
      title: skill.title,
    };
  });

function getSkillBySlug(slug: string) {
  return skillBySlugFn({ data: slug });
}

export { getSkillBySlug, getSkillList };
