import { createFileRoute } from "@tanstack/react-router";
import {
  GithubIcon,
  MailIcon,
  NetisionIcon,
  TwitterIcon,
} from "~/components/icons";
import {
  PageDescription,
  PageHeader,
  PageTitle,
} from "~/components/page-header";
import { PostList } from "~/components/post-list";
import { ProjectList } from "~/components/project-list";
import { Page } from "~/components/ui/page";
import { config } from "~/lib/config";
import { useHaptics } from "~/lib/haptics";
import { projects } from "~/lib/projects";
import { seo } from "~/lib/seo";
import { getPostList } from "~/server/posts";

export const Route = createFileRoute("/_app/")({
  loader: async () => ({ posts: await getPostList(5) }),
  head: () => seo({ title: config.name, description: config.description }),
  headers: () => ({
    "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
  }),
  component: HomePage,
});

function HomePage() {
  const { posts } = Route.useLoaderData();
  const { trigger } = useHaptics();
  const haptic = () => trigger("tick");

  return (
    <Page>
      <section>
        <PageHeader>
          <PageTitle>{config.name}</PageTitle>

          <PageDescription>
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
          </PageDescription>
        </PageHeader>
      </section>

      <section>
        <h2>Projects</h2>
        <ProjectList projects={projects} />
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
