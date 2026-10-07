import * as stylex from "@stylexjs/stylex";
import { createFileRoute } from "@tanstack/react-router";

import {
  GithubIcon,
  MailIcon,
  MarkIcon,
  TwitterIcon,
} from "~/components/icons";
import { NowPlaying } from "~/components/now-playing";
import { PageDescription } from "~/components/page-description";
import { PostList, postListItems } from "~/components/post-list";
import { ProjectList } from "~/components/project-list";
import { IconLink } from "~/components/ui/icon-link";
import { Page, PageHeader, Section, usePageEnter } from "~/components/ui/page";
import { config } from "~/lib/config";
import { useHaptics } from "~/lib/haptics";
import { projects } from "~/lib/projects";
import { seo } from "~/lib/seo";
import { getExplorations } from "~/server/explorations";
import { getWritings } from "~/server/writings";
import { colors, easings, media } from "~/styles/tokens.stylex";

export const Route = createFileRoute("/_app/")({
  loader: async () => {
    const [posts, explorations] = await Promise.all([
      getWritings(),
      getExplorations(),
    ]);

    return {
      explorations: postListItems(explorations).slice(0, 5),
      posts: postListItems(posts).slice(0, 5),
    };
  },
  head: () => seo({ title: config.name, description: config.description }),
  headers: () => ({
    "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
  }),
  component: HomePage,
});

const spin = stylex.keyframes({
  from: { opacity: 0, transform: "rotate(-180deg) scale(0.85)" },
});

const write = stylex.keyframes({
  from: { filter: "blur(4px)", opacity: 0, transform: "translateX(-4px)" },
});

const fade = stylex.keyframes({
  from: { opacity: 0 },
});

const LETTER_MS = 20;

const letters = Array.from(
  new Intl.Segmenter("en", { granularity: "grapheme" }).segment(config.name),
  ({ segment }) => segment
);

const styles = stylex.create({
  spin: {
    animationDuration: "700ms",
    animationFillMode: "both",
    animationName: { default: spin, [media.reducedMotion]: fade },
    animationTimingFunction: easings.out,
  },
  srOnly: {
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1,
  },
  letter: {
    animationDuration: "400ms",
    animationFillMode: "both",
    animationName: { default: write, [media.reducedMotion]: fade },
    animationTimingFunction: easings.out,
    display: "inline-block",
    whiteSpace: "pre",
  },
  mark: {
    color: colors.accent,
    flexShrink: 0,
    fontSize: 16,
  },
  nowPlaying: {
    insetInlineEnd: 0,
    position: "absolute",
    top: -4,
  },
});

function Title() {
  const entering = usePageEnter() !== null;

  return (
    <>
      <MarkIcon {...stylex.props(styles.mark, entering && styles.spin)} />
      {entering ? (
        <span>
          <span {...stylex.props(styles.srOnly)}>{config.name}</span>
          {letters.map((letter, i) => (
            <span
              aria-hidden="true"
              key={i}
              {...stylex.props(styles.letter)}
              // Overlaps the glyph spin so the two read as one gesture.
              style={{ animationDelay: `${60 + i * LETTER_MS}ms` }}
            >
              {letter}
            </span>
          ))}
        </span>
      ) : (
        <span>{config.name}</span>
      )}
    </>
  );
}

function HomePage() {
  const { explorations, posts } = Route.useLoaderData();
  const { trigger } = useHaptics();

  function haptic() {
    trigger("tick");
  }

  return (
    <Page enter>
      <PageHeader title={<Title />}>
        <PageDescription>
          <p>{config.description}</p>

          <p>
            Reach me via{" "}
            <IconLink
              href={`mailto:${config.socials.mail}`}
              icon={<MailIcon />}
              onMouseEnter={haptic}
            >
              Mail
            </IconLink>{" "}
            /{" "}
            <IconLink
              external
              href={`https://www.x.com/${config.socials.twitter}`}
              icon={<TwitterIcon />}
              onMouseEnter={haptic}
            >
              X
            </IconLink>
            , or find my work on{" "}
            <IconLink
              external
              href={`https://github.com/${config.socials.github}`}
              icon={<GithubIcon />}
              onMouseEnter={haptic}
            >
              Github
            </IconLink>
            .
          </p>
        </PageDescription>

        <NowPlaying style={styles.nowPlaying} />
      </PageHeader>

      <Section title="Projects">
        <ProjectList projects={projects} />
      </Section>

      <Section title="Writings">
        <PostList posts={posts} />
      </Section>

      {explorations.length > 0 && (
        <Section title="Explorations">
          <PostList posts={explorations} to="/explorations/$slug" />
        </Section>
      )}
    </Page>
  );
}
