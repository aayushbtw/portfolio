import { createFileRoute } from "@tanstack/react-router";
import {
  GithubIcon,
  MailIcon,
  NetisionIcon,
  TwitterIcon,
} from "~/components/icons";
import { Box } from "~/components/primitives/box";
import { InlineIcon, TextLink } from "~/components/primitives/link";
import { Text } from "~/components/primitives/text";
import { getContributions } from "~/components/rsc/contributions";
import { getPostListOrbit } from "~/components/rsc/posts";
import { getProjectListOrbit } from "~/components/rsc/projects";
import { config } from "~/lib/config";
import { useHaptics } from "~/lib/haptics";
import { seo } from "~/lib/seo";

export const Route = createFileRoute("/_app/")({
  loader: async () => {
    const [contributions, projects, posts] = await Promise.all([
      getContributions(),
      getProjectListOrbit(),
      getPostListOrbit(5),
    ]);
    return { contributions, projects, posts };
  },
  head: () => seo({ title: config.name, description: config.description }),
  headers: () => ({
    "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
  }),
  component: HomePage,
});

function HomePage() {
  const { contributions, projects, posts } = Route.useLoaderData();
  const { trigger } = useHaptics();
  const haptic = () => trigger("tick");

  return (
    <>
      <Box as="section">
        <Text as="h1" marginBottom="md" variant="heading">
          {config.name}
        </Text>

        <Box display="flex" flexDirection="column" gap="sm">
          <Text>{config.description}</Text>

          <Text>
            Currently a full-stack engineer at{" "}
            <TextLink
              external
              href="https://www.netision.com"
              onMouseEnter={haptic}
            >
              <InlineIcon as={NetisionIcon} />
              Netision
            </TextLink>
            , building a multi-agent platform that turns complex data into
            clear, intuitive insights.
          </Text>

          <Text>
            Reach me via{" "}
            <TextLink
              href={`mailto:${config.socials.mail}`}
              onMouseEnter={haptic}
            >
              <InlineIcon as={MailIcon} />
              Mail
            </TextLink>{" "}
            /{" "}
            <TextLink
              external
              href={`https://www.x.com/${config.socials.twitter}`}
              onMouseEnter={haptic}
            >
              <InlineIcon as={TwitterIcon} />X
            </TextLink>
            , or find my work on{" "}
            <TextLink
              external
              href={`https://github.com/${config.socials.github}`}
              onMouseEnter={haptic}
            >
              <InlineIcon as={GithubIcon} />
              Github
            </TextLink>
            .
          </Text>
        </Box>
      </Box>

      <Box as="section" marginTop="lg">
        {contributions}
      </Box>

      <Box as="section" marginTop="xl">
        <Text as="h2" variant="section-label">
          Projects
        </Text>
        {projects}
      </Box>

      <Box as="section" marginTop="xl">
        <Text as="h2" variant="section-label">
          Writings
        </Text>
        {posts}
      </Box>
    </>
  );
}
