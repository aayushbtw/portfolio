import { createFileRoute } from "@tanstack/react-router";
import { getSkillList } from "~/components/rsc/skills";
import { PageHeader } from "~/components/ui/page-header";
import { seo } from "~/lib/seo";

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
    <section>
      <PageHeader title={title} />
      {skills}
    </section>
  );
}
