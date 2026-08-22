import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import type { SkillListItem } from "~/components/skill-list";
import { allSkills } from "~/server/content";
import { renderMarkdown } from "~/server/markdown";

function sortedSkills() {
  return allSkills.toSorted((a, b) => a.title.localeCompare(b.title));
}

// Plain data, not a rendered element. See the note in server/posts.tsx.
const getSkillList = createServerFn({ method: "GET" }).handler(
  (): SkillListItem[] =>
    sortedSkills().map((skill) => ({
      slug: skill.slug,
      title: skill.title,
      summary: skill.summary,
    }))
);

const skillBySlugFn = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const skill = allSkills.find((s) => s.slug === slug);
    if (!skill) {
      throw notFound();
    }

    const { document, ...meta } = skill;

    return {
      ...meta,
      body: await renderServerComponent(renderMarkdown(document)),
    };
  });

function getSkillBySlug(slug: string) {
  return skillBySlugFn({ data: slug });
}

export { getSkillBySlug, getSkillList };
