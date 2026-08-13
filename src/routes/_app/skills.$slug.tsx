import { createFileRoute } from "@tanstack/react-router";
import { GithubIcon, VercelIcon } from "~/components/icons";
import { Box } from "~/components/primitives/box";
import { Icon } from "~/components/primitives/icon";
import { Text } from "~/components/primitives/text";
import { getSkillBySlug } from "~/components/rsc/skills";
import { Install, InstallLink } from "~/components/ui/install";
import { config } from "~/lib/config";
import { seo } from "~/lib/seo";

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
    <Box as="section">
      <Box as="article">
        <Text as="h1" variant="heading">
          {skill.title}
        </Text>
        <Text>{skill.description}</Text>

        <Install
          command={`npx skills add ${config.skillsRepo} --skill ${skill.slug}`}
          marginTop="lg"
        >
          <InstallLink
            href={`https://skills.sh/${config.skillsRepo}/${skill.slug}`}
          >
            <Icon as={VercelIcon} size="md" />
            Skills
          </InstallLink>
          <InstallLink
            href={`https://github.com/${config.skillsRepo}/blob/main/${skill.slug}/SKILL.md`}
          >
            <Icon as={GithubIcon} size="md" />
            GitHub
          </InstallLink>
        </Install>

        <Box
          backgroundColor="bg-2-soft"
          borderColor="default"
          borderRadius="md"
          data-slot="skill-body"
          marginTop="lg"
          paddingBottom="sm"
          paddingInline="md"
        >
          {skill.body}
        </Box>
      </Box>
    </Box>
  );
}
