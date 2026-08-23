import { createFileRoute } from "@tanstack/react-router";
import { GithubIcon, VercelIcon } from "~/components/icons";
import {
  Install,
  InstallCommand,
  InstallLink,
  InstallLinks,
} from "~/components/install";
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

        <Install className="mt-lg">
          <InstallCommand
            command={`npx skills add ${config.skillsRepo} --skill ${skill.slug}`}
          />
          <InstallLinks>
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
          </InstallLinks>
        </Install>

        <div
          className="mt-lg rounded-md border bg-bg-2/50 p-xs"
          data-slot="skill-body"
        >
          <div className="rounded-sm border bg-bg-1 p-md">{skill.body}</div>
        </div>
      </article>
    </section>
  );
}
