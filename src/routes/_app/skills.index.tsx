import { createFileRoute } from "@tanstack/react-router";

import { SkillList } from "~/components/skill-list";
import { Page } from "~/components/ui/page";
import { seo } from "~/lib/seo";
import { skills } from "~/lib/skills";

const title = "Skills";
const description =
  "A collection of skills crafted for quality of life with your AI coding agent.";

export const Route = createFileRoute("/_app/skills/")({
  head: () => seo({ title, description }),
  component: SkillsPage,
});

function SkillsPage() {
  return (
    <Page>
      <section>
        <h1>{title}</h1>
        <SkillList skills={skills} />
      </section>
    </Page>
  );
}
