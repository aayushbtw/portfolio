import { createFileRoute, notFound } from "@tanstack/react-router";

import { GithubIcon, VercelIcon } from "~/components/icons";
import {
  Install,
  InstallCommand,
  InstallLink,
  InstallLinks,
} from "~/components/install";
import { Crumb } from "~/components/layout-provider";
import { SkillDemo } from "~/components/skill-demo";
import { config } from "~/lib/config";
import { seo } from "~/lib/seo";
import { getSkill } from "~/lib/skills";

export const Route = createFileRoute("/_app/skills/$slug")({
  loader: ({ params: { slug } }) => {
    const skill = getSkill(slug);
    if (!skill) {
      throw notFound();
    }
    return skill;
  },
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
      <Crumb>{skill.title}</Crumb>

      <article>
        <h1 className="text-balance">{skill.title}</h1>
        <p>{skill.summary}</p>

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

        <SkillDemo {...skill} />
      </article>
    </section>
  );
}
