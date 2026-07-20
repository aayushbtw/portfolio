import { createFileRoute } from "@tanstack/react-router";
import { getSkillList } from "~/components/rsc/skills";
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
      <h1 className="text-eyebrow">{title}</h1>
      {skills}
    </section>
  );
}
