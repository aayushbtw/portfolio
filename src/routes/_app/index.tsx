import { Await, createFileRoute } from "@tanstack/react-router";
import {
  GithubIcon,
  MailIcon,
  NetisionIcon,
  TwitterIcon,
} from "~/components/icons";
import { PostList } from "~/components/post-list";
import { ProjectList } from "~/components/project-list";
import { ListSkeleton } from "~/components/ui/list";
import { Page } from "~/components/ui/page";
import { config } from "~/lib/config";
import { useHaptics } from "~/lib/haptics";
import { seo } from "~/lib/seo";
import { getProjectList } from "~/server/octo";
import { getPostList } from "~/server/posts";

export const Route = createFileRoute("/_app/")({
  // Only the post list is awaited: it reads local content. The octo call is
  // handed over as a promise and streams in behind a skeleton.
  loader: async () => ({
    projects: getProjectList(),
    posts: await getPostList(5),
  }),
  head: () => seo({ title: config.name, description: config.description }),
  headers: () => ({
    "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
  }),
  component: HomePage,
});

function HomePage() {
  const { projects, posts } = Route.useLoaderData();
  const { trigger } = useHaptics();
  const haptic = () => trigger("tick");

  return (
    <Page>
      <section>
        <h1 className="mb-md">{config.name}</h1>

        <div
          style={
            { "--typeset-flow": "var(--spacing-sm)" } as React.CSSProperties
          }
        >
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
              <MailIcon />
              Mail
            </HeaderLink>{" "}
            /{" "}
            <HeaderLink
              external
              href={`https://www.x.com/${config.socials.twitter}`}
              onMouseEnter={haptic}
            >
              <TwitterIcon />X
            </HeaderLink>
            , or find my work on{" "}
            <HeaderLink
              external
              href={`https://github.com/${config.socials.github}`}
              onMouseEnter={haptic}
            >
              <GithubIcon />
              Github
            </HeaderLink>
            .
          </p>
        </div>
      </section>

      <section>
        <h2>Projects</h2>
        <Await
          fallback={<ListSkeleton rowClassName="h-10" rows={4} />}
          promise={projects}
        >
          {(list) =>
            list ? (
              <ProjectList projects={list} />
            ) : (
              <p className="text-fg-3">Projects are unavailable right now.</p>
            )
          }
        </Await>
      </section>

      <section>
        <h2>Writings</h2>
        <PostList posts={posts} />
      </section>
    </Page>
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
