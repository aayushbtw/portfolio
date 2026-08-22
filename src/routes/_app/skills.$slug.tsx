import { createFileRoute } from "@tanstack/react-router";
import { GithubIcon, VercelIcon } from "~/components/icons";
import { Install, InstallLink } from "~/components/ui/install";
import { config } from "~/lib/config";
import { seo } from "~/lib/seo";
import { getSkillBySlug } from "~/server/skills";

export const Route = createFileRoute("/_app/skills/$slug")({
  loader: ({ params: { slug } }) => getSkillBySlug(slug),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {};
    }
    return seo({
      title: loaderData.title,
      description: loaderData.summary,
    });
  },
  component: SkillPage,
});

function SkillPage() {
  const skill = Route.useLoaderData();

  return (
    <section>
      <article>
        <h1 className="text-balance">{skill.title}</h1>
        <p>{skill.description}</p>

        <Install
          className="mt-lg"
          command={`npx skills add ${config.skillsRepo} --skill ${skill.slug}`}
        >
          <InstallLink
            href={`https://skills.sh/${config.skillsRepo}/${skill.slug}`}
          >
            <VercelIcon />
            Skills
          </InstallLink>
          <InstallLink
            href={`https://github.com/${config.skillsRepo}/blob/main/${skill.slug}/SKILL.md`}
          >
            <GithubIcon />
            GitHub
          </InstallLink>
        </Install>

        <div
          className="mt-lg rounded-md border bg-bg-2/50 px-md pb-sm"
          data-slot="skill-body"
        >
          {skill.body}
        </div>
      </article>
    </section>
  );
}
