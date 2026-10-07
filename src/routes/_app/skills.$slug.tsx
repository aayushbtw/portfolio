import { createFileRoute } from "@tanstack/react-router";

import { GithubIcon, VercelIcon } from "~/components/icons";
import {
  Install,
  InstallCommand,
  InstallLink,
  InstallLinks,
} from "~/components/install";
import { Page, PageHeader } from "~/components/ui/page";
import { config } from "~/lib/config";
import { seo } from "~/lib/seo";
import { getSkill } from "~/server/skills";

export const Route = createFileRoute("/_app/skills/$slug")({
  loader: async ({ params: { slug } }) => await getSkill({ data: slug }),
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
    <Page variant="compact">
      <PageHeader title={skill.title} />

      <Install>
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
    </Page>
  );
}
