import { createFileRoute } from "@tanstack/react-router";

import { SkillList } from "~/components/skill-list";
import { Page } from "~/components/ui/page";
import { seo } from "~/lib/seo";
import { getSkillList } from "~/server/skills";

const title = "Skills";
const description =
  "A collection of skills crafted for quality of life with your AI coding agent.";

export const Route = createFileRoute("/_app/skills/")({
  loader: () => getSkillList(),
  head: () => seo({ title, description }),
  component: SkillsPage,
});

function SkillsPage() {
  const skills = Route.useLoaderData();

  return (
    <Page>
      <section>
        <h1>{title}</h1>
        <SkillList skills={skills} />
      </section>
    </Page>
  );
}
