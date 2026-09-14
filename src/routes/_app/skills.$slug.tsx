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
import { getSkill } from "~/server/skills";

export const Route = createFileRoute("/_app/skills/$slug")({
  loader: ({ params: { slug } }) => getSkill({ data: slug }),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {};
    }

    return seo({
      title: loaderData.title,
      description: loaderData.description,
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

        {skill.body}
      </article>
    </section>
  );
}
