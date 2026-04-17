import {
  IconBrandGithubFilled,
  IconBrandTwitterFilled,
  IconMailFilled,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { NetisionIcon } from "@/components/icons";
import { ListPosts } from "@/components/list-posts";
import { ListProjects } from "@/components/list-projects";
import { ContributionGraph } from "@/components/ui/contribution-graph";
import { getAllPosts } from "@/lib/blog";
import { config } from "@/lib/config";
import { useHaptics } from "@/lib/haptics";
import { fetchContributions, fetchPinnedRepos } from "@/lib/octo";
import { seo } from "@/lib/seo";
import { getEnv } from "@/lib/server-fns";
import { cn } from "@/lib/utils";

const lastYear = new Date().getFullYear() - 1;

export const Route = createFileRoute("/_app/")({
  loader: async () => {
    const [posts, contributions, projects, env] = await Promise.all([
      getAllPosts(5),
      fetchContributions(lastYear),
      fetchPinnedRepos(),
      getEnv(),
    ]);
    return {
      posts,
      contributions,
      projects,
      seo: {
        title: config.name,
        description: config.description,
        domain: env.domain,
      },
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {};
    }
    return seo(loaderData.seo);
  },
  component: HomePage,
});

function HomePage() {
  const { posts, contributions, projects, seo } = Route.useLoaderData();
  const { trigger } = useHaptics();
  const haptic = () => trigger("tick");

  return (
    <>
      <section>
        <h1 className="mb-4">{seo.title}</h1>

        <div className="space-y-1.5 text-fg-3">
          <p>{seo.description}</p>

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
              href={`https://www.x.com/${config.socials.github}`}
              onMouseEnter={haptic}
            >
              <IconBrandGithubFilled />
              Github
            </HeaderLink>
            .
          </p>
        </div>
      </section>

      <section className="mt-6">
        <ContributionGraph
          data={contributions.contributions}
          total={contributions.total}
          year={contributions.year}
        />
      </section>

      <section className="mt-6">
        <h2 className="text-fg-3 text-xs uppercase tracking-widest">
          Projects
        </h2>
        <ListProjects projects={projects} />
      </section>

      <section className="mt-6">
        <h2 className="text-fg-3 text-xs uppercase tracking-widest">
          Writings
        </h2>
        <ListPosts className="mt-2" posts={posts} />
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
      href={href}
      {...props}
      className={cn(
        "animated-link",
        "[&_svg]:mr-1 [&_svg]:mb-0.5 [&_svg]:inline-block [&_svg]:size-4 [&_svg]:text-fg-3 hover:[&_svg]:text-fg-2"
      )}
      rel={external ? "noopener" : undefined}
      target={external ? "_blank" : undefined}
    />
  );
}
