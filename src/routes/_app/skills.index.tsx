import { createFileRoute } from "@tanstack/react-router";

import { SkillList } from "~/components/skill-list";
import { Page, PageHeader } from "~/components/ui/page";
import { seo } from "~/lib/seo";
import { getSkills } from "~/server/skills";

const title = "Skills";

const description =
  "A collection of skills crafted for quality of life with your AI coding agent.";

export const Route = createFileRoute("/_app/skills/")({
  loader: async () => {
    const skills = await getSkills();

    // Calendar-day strings sort chronologically as text.
    return skills.toSorted((a, b) =>
      b.publishedAt.localeCompare(a.publishedAt)
    );
  },
  head: () => seo({ title, description }),
  component: SkillsPage,
});

function SkillsPage() {
  const skills = Route.useLoaderData();

  return (
    <Page variant="compact">
      <PageHeader description={description} title={title} />

      <SkillList skills={skills} />
    </Page>
  );
}
