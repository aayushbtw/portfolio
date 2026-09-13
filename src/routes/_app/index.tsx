import { createFileRoute } from "@tanstack/react-router";

import {
  GithubIcon,
  MailIcon,
  NetisionIcon,
  TwitterIcon,
} from "~/components/icons";
import { NowPlaying } from "~/components/now-playing";
import { PageDescription } from "~/components/page-description";
import { PostList } from "~/components/post-list";
import { ProjectList } from "~/components/project-list";
import { IconLink } from "~/components/ui/icon-link";
import { Page } from "~/components/ui/page";
import { config } from "~/lib/config";
import { useHaptics } from "~/lib/haptics";
import { projects } from "~/lib/projects";
import { seo } from "~/lib/seo";
import { getExplorationList } from "~/server/explorations";
import { getPostList } from "~/server/posts";

export const Route = createFileRoute("/_app/")({
  loader: async () => {
    const [posts, explorations] = await Promise.all([
      getPostList(5),
      getExplorationList(5),
    ]);
    return { explorations, posts };
  },
  head: () => seo({ title: config.name, description: config.description }),
  headers: () => ({
    "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
  }),
  component: HomePage,
});

function HomePage() {
  const { explorations, posts } = Route.useLoaderData();
  const { trigger } = useHaptics();
  function haptic() {
    trigger("tick");
  }

  return (
    <Page>
      <section className="relative">
        <h1>{config.name}</h1>

        <PageDescription>
          <p>{config.description}</p>

          <p>
            Currently a full-stack engineer at{" "}
            <IconLink
              external
              variant="pill"
              href="https://www.netision.com"
              onMouseEnter={haptic}
            >
              <NetisionIcon />
              Netision
            </IconLink>
            , building a multi-agent platform that turns complex data into
            clear, intuitive insights.
          </p>

          <p>
            Reach me via{" "}
            <IconLink
              href={`mailto:${config.socials.mail}`}
              onMouseEnter={haptic}
            >
              <MailIcon />
              Mail
            </IconLink>{" "}
            /{" "}
            <IconLink
              external
              href={`https://www.x.com/${config.socials.twitter}`}
              onMouseEnter={haptic}
            >
              <TwitterIcon />X
            </IconLink>
            , or find my work on{" "}
            <IconLink
              external
              href={`https://github.com/${config.socials.github}`}
              onMouseEnter={haptic}
            >
              <GithubIcon />
              Github
            </IconLink>
            .
          </p>
        </PageDescription>

        {/* Out of flow so a track arriving shifts nothing, and so the `h1` keeps
            `PageDescription` as its typeset sibling. */}
        <NowPlaying className="-top-xs absolute end-0" />
      </section>

      <section>
        <h2>Projects</h2>
        <ProjectList projects={projects} />
      </section>

      <section>
        <h2>Writings</h2>
        <PostList posts={posts} />
      </section>

      <section>
        <h2>Explorations</h2>
        <PostList posts={explorations} to="/explorations/$slug" />
      </section>
    </Page>
  );
}
