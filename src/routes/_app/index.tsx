import {
  IconBrandGithubFilled,
  IconBrandTwitterFilled,
  IconMailFilled,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { NetisionIcon } from "~/components/icons";
import { ListPosts } from "~/components/list-posts";
import { ListProjects } from "~/components/list-projects";
import { ContributionGraph } from "~/components/ui/contribution-graph";
import { config } from "~/lib/config";
import { useHaptics } from "~/lib/haptics";
import { fetchContributions, fetchPinnedRepos } from "~/lib/octo";
import { getAllPosts } from "~/lib/posts";
import { seo } from "~/lib/seo";

export const Route = createFileRoute("/_app/")({
  loader: async () => {
    const [contributions, projects, posts] = await Promise.all([
      fetchContributions(),
      fetchPinnedRepos(),
      getAllPosts(),
    ]);
    return { contributions, projects, posts: posts.slice(0, 5) };
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
      <section>
        <h1 className="mb-4 text-balance">{config.name}</h1>

        <div>
          <p>{config.description}</p>

          <p>
            Currently a full-stack engineer at{" "}
            <HeaderLink
              external
              href="https://www.netision.com"
              onMouseEnter={haptic}
            >
              <NetisionIcon />
              Netision
            </HeaderLink>
            , building a multi-agent platform that turns complex data into
            clear, intuitive insights.
          </p>

          <p>
            Reach me via{" "}
            <HeaderLink
              href={`mailto:${config.socials.mail}`}
              onMouseEnter={haptic}
            >
              <IconMailFilled />
              Mail
            </HeaderLink>{" "}
            /{" "}
            <HeaderLink
              external
              href={`https://www.x.com/${config.socials.twitter}`}
              onMouseEnter={haptic}
            >
              <IconBrandTwitterFilled />X
            </HeaderLink>
            , or find my work on{" "}
            <HeaderLink
              external
              href={`https://github.com/${config.socials.github}`}
              onMouseEnter={haptic}
            >
              <IconBrandGithubFilled />
              Github
            </HeaderLink>
            .
          </p>
        </div>
      </section>

      <section className="mt-section">
        <ContributionGraph
          data={contributions.contributions}
          total={contributions.total}
        />
      </section>

      <section className="mt-section">
        <h2 className="text-eyebrow">Projects</h2>
        <ListProjects projects={projects} />
      </section>

      <section className="mt-section">
        <h2 className="text-eyebrow">Writings</h2>
        <ListPosts posts={posts} />
      </section>
    </>
  );
}

function HeaderLink({
  external,
  href,
  ...props
}: React.ComponentProps<"a"> & { external?: boolean }) {
  return (
    <a
      className="icon-link"
      href={href}
      {...props}
      rel={external ? "noopener" : undefined}
      target={external ? "_blank" : undefined}
    />
  );
}
