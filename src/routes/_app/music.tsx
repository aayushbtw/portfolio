import * as stylex from "@stylexjs/stylex";
import { Await, createFileRoute } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { Suspense, useEffect, useState } from "react";

import { SpotifyIcon } from "~/components/icons";
import { Page, PageHeader } from "~/components/ui/page";
import { Skeleton } from "~/components/ui/skeleton";
import { seo } from "~/lib/seo";
import { useLive } from "~/lib/spotify";
import { getTopsFn } from "~/server/spotify";
import type { SpotifyArtist, SpotifyTrack } from "~/server/spotify";
import {
  colors,
  durations,
  easings,
  fontSizes,
  layout,
  lineHeights,
  media,
  presses,
  radii,
  shadows,
  space,
} from "~/styles/tokens.stylex";

const title = "Music";

const description = "What I’m listening to on Spotify.";

export const Route = createFileRoute("/_app/music")({
  loader: () => ({ tops: getTopsOrNull() }),
  head: () => seo({ title, description }),
  headers: () => ({
    "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
  }),
  component: MusicPage,
});

// Runs from where the last poll left off to the end of the song.
const progress = stylex.keyframes({
  to: { transform: "scaleX(1)" },
});

const styles = stylex.create({
  // One Page child holds both tables, so it carries Page's section gap itself.
  stack: {
    display: "flex",
    flexDirection: "column",
    gap: layout.sectionGap,
  },
  mark: {
    flexShrink: 0,
    fontSize: 16,
  },
  list: {
    color: colors.textMuted,
    lineHeight: lineHeights.row,
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  head: {
    alignItems: "center",
    boxShadow: shadows.rule,
    color: colors.textMuted,
    display: "flex",
    fontSize: fontSizes.sm,
    gap: space.xs,
    lineHeight: lineHeights.row,
    paddingBlock: space.xs,
  },
  // A hovered row drops the lines above and below it, so its fill isn't boxed in.
  divided: {
    boxShadow: {
      default: shadows.divider,
      ":last-child": "none",
      [media.hover]: {
        default: shadows.divider,
        ":last-child": "none",
        ":has(> a:hover)": "none",
        ":has(+ * > a:hover)": "none",
      },
    },
  },
  // Bleeds past the column so the hover fill frames the row, not the text.
  link: {
    backgroundColor: {
      default: null,
      [media.hover]: { default: null, ":hover": colors.fill },
    },
    borderRadius: radii.sm,
    marginInline: `calc(-1 * ${space.xs})`,
    paddingInline: space.xs,
    transform: { default: null, ":active": presses.row },
    transitionDuration: `${durations.hover}, ${durations.press}`,
    transitionProperty: "background-color, transform",
    transitionTimingFunction: `ease, ${easings.out}`,
  },
  row: {
    alignItems: "center",
    display: "flex",
    gap: space.sm,
    paddingBlock: space.xs,
    textDecoration: "none",
  },
  cover: {
    borderRadius: radii.xs,
    boxShadow: shadows.ring,
    flexShrink: 0,
    height: 24,
    width: 24,
  },
  round: {
    borderRadius: radii.full,
  },
  text: {
    display: "flex",
    gap: space.xs,
    minWidth: 0,
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  name: {
    color: colors.textPrimary,
    flexShrink: 0,
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  artists: {
    color: {
      default: colors.textMuted,
      [media.hover]: {
        default: colors.textMuted,
        [stylex.when.ancestor(":hover")]: colors.textSecondary,
      },
    },
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    transitionDuration: durations.hover,
    transitionProperty: "color",
    transitionTimingFunction: "ease",
  },
  spacer: {
    flexGrow: 1,
    minWidth: space.md,
  },
  meta: {
    alignItems: "center",
    display: "flex",
    flexShrink: 0,
    gap: space.xs,
    fontSize: fontSizes.sm,
    fontVariantNumeric: "tabular-nums",
    textAlign: "end",
  },
  bar: {
    backgroundColor: colors.fill,
    borderRadius: radii.full,
    flexShrink: 0,
    height: 2,
    overflow: "hidden",
    width: 64,
  },
  fill: {
    animationFillMode: "forwards",
    animationName: progress,
    animationTimingFunction: "linear",
    backgroundColor: colors.accent,
    height: "100%",
    display: "block",
    transformOrigin: "left",
  },
  // Keyed on every poll, so each one restarts the run from the reported position.
  playing: (from: number, remainingMs: number) => ({
    animationDuration: `${remainingMs}ms`,
    transform: `scaleX(${from})`,
  }),
  paused: {
    animationPlayState: "paused",
  },
  // Cover height, so an empty row is as tall as a filled one.
  empty: {
    alignItems: "center",
    display: "flex",
    minHeight: 24,
  },
  skeletonCover: {
    flexShrink: 0,
    height: 24,
    width: 24,
  },
  skeletonLine: {
    height: 12,
    width: 160,
  },
});

const relative = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
  style: "short",
});

function formatAgo(iso: string) {
  const minutes = Math.round((Date.parse(iso) - Date.now()) / 60_000);

  if (minutes > -60) {
    return relative.format(minutes, "minute");
  }

  if (minutes > -60 * 24) {
    return relative.format(Math.round(minutes / 60), "hour");
  }

  return relative.format(Math.round(minutes / 60 / 24), "day");
}

function formatDuration(ms: number) {
  const seconds = Math.round(ms / 1000);

  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

// A Spotify outage or rate limit empties the tables instead of failing the page.
async function getTopsOrNull() {
  try {
    return await getTopsFn();
  } catch {
    return null;
  }
}

function smallest(images: { url: string }[]) {
  return images.at(-1)?.url ?? images[0]?.url;
}

function MusicPage() {
  const { tops } = Route.useLoaderData();

  // `NowPlaying`'s key, so this reads the cache instead of polling twice.
  const { data: live, isPending } = useLive();
  const nowPlaying = live?.nowPlaying;

  return (
    <Page>
      <PageHeader
        description={description}
        title={
          <>
            <SpotifyIcon {...stylex.props(styles.mark)} />
            {title}
          </>
        }
      />

      <Table
        heading={
          nowPlaying?.track && !nowPlaying.isPlaying ? "Paused" : "Now playing"
        }
      >
        <Rows
          empty="Nothing playing"
          items={nowPlaying?.track ? [nowPlaying.track] : []}
          pending={isPending}
          skeletons={1}
        >
          {(track) => (
            <TrackRow
              key={track.id}
              meta={
                <Progress
                  durationMs={track.durationMs}
                  isPlaying={nowPlaying?.isPlaying ?? false}
                  progressMs={nowPlaying?.progressMs ?? 0}
                  reportedAt={live?.fetchedAt ?? 0}
                />
              }
              track={track}
            />
          )}
        </Rows>
      </Table>

      <div {...stylex.props(styles.stack)}>
        <Suspense
          fallback={
            <>
              <Table heading="Top tracks">
                <SkeletonRows count={3} />
              </Table>
              <Table heading="Top artists">
                <SkeletonRows count={3} round />
              </Table>
            </>
          }
        >
          <Await promise={tops}>
            {(data) => (
              <>
                <Table heading="Top tracks">
                  <Rows
                    empty={data ? "Nothing yet" : "Couldn’t reach Spotify"}
                    items={data?.topTracks ?? []}
                  >
                    {(track) => <TrackRow key={track.id} track={track} />}
                  </Rows>
                </Table>
                <Table heading="Top artists">
                  <Rows
                    empty={data ? "Nothing yet" : "Couldn’t reach Spotify"}
                    items={data?.topArtists ?? []}
                  >
                    {(artist) => <ArtistRow artist={artist} key={artist.id} />}
                  </Rows>
                </Table>
              </>
            )}
          </Await>
        </Suspense>
      </div>

      <Table column="Played" heading="Recently played">
        <Rows
          empty="Nothing yet"
          items={live?.recentlyPlayed ?? []}
          pending={isPending}
          skeletons={5}
        >
          {(track) => (
            <TrackRow
              key={`${track.id}-${track.playedAt}`}
              meta={
                track.playedAt === undefined ? null : formatAgo(track.playedAt)
              }
              track={track}
            />
          )}
        </Rows>
      </Table>
    </Page>
  );
}

function Table({
  children,
  column,
  heading,
}: {
  children: React.ReactNode;
  column?: string;
  heading: string;
}) {
  return (
    <section>
      <div {...stylex.props(styles.head)}>
        <h2>{heading}</h2>
        <span aria-hidden="true" {...stylex.props(styles.spacer)} />
        {column === undefined ? null : <span>{column}</span>}
      </div>
      <ul {...stylex.props(styles.list)}>{children}</ul>
    </section>
  );
}

/** A table's body in any state, so the table itself never mounts late. */
function Rows<T>({
  children,
  empty,
  items,
  pending = false,
  skeletons = 0,
}: {
  children: (item: T) => React.ReactNode;
  empty: string;
  items: T[];
  pending?: boolean;
  skeletons?: number;
}) {
  if (pending) {
    return <SkeletonRows count={skeletons} />;
  }

  if (items.length === 0) {
    return (
      <li {...stylex.props(styles.row, styles.divided)}>
        <span {...stylex.props(styles.empty)}>{empty}</span>
      </li>
    );
  }

  return items.map(children);
}

function SkeletonRows({
  count,
  round = false,
}: {
  count: number;
  round?: boolean;
}) {
  return Array.from({ length: count }, (_, i) => (
    <li key={i} {...stylex.props(styles.row, styles.divided)}>
      <Skeleton style={[styles.skeletonCover, round && styles.round]} />
      <Skeleton style={styles.skeletonLine} />
    </li>
  ));
}

function TrackRow({
  meta,
  track,
}: {
  meta?: React.ReactNode;
  track: SpotifyTrack;
}) {
  const cover = smallest(track.album.images);

  return (
    <li {...stylex.props(styles.divided)}>
      <a
        href={track.url}
        rel="noopener"
        target="_blank"
        {...stylex.props(stylex.defaultMarker(), styles.row, styles.link)}
      >
        {cover ? (
          <Image
            alt=""
            height={24}
            src={cover}
            width={24}
            {...stylex.props(styles.cover)}
          />
        ) : null}
        <span {...stylex.props(styles.text)}>
          <span {...stylex.props(styles.name)}>{track.name}</span>
          <span {...stylex.props(styles.artists)}>
            {track.artists.map((a) => a.name).join(", ")}
          </span>
        </span>
        <span aria-hidden="true" {...stylex.props(styles.spacer)} />
        <span {...stylex.props(styles.meta)}>{meta}</span>
      </a>
    </li>
  );
}

function ArtistRow({ artist }: { artist: SpotifyArtist }) {
  const photo = smallest(artist.images);

  return (
    <li {...stylex.props(styles.divided)}>
      <a
        href={artist.url}
        rel="noopener"
        target="_blank"
        {...stylex.props(stylex.defaultMarker(), styles.row, styles.link)}
      >
        {photo ? (
          <Image
            alt=""
            height={24}
            src={photo}
            width={24}
            {...stylex.props(styles.cover, styles.round)}
          />
        ) : null}
        <span {...stylex.props(styles.name)}>{artist.name}</span>
      </a>
    </li>
  );
}

function Progress({
  durationMs,
  isPlaying,
  progressMs,
  reportedAt,
}: {
  durationMs: number;
  isPlaying: boolean;
  progressMs: number;
  /** When Spotify reported `progressMs`; the clock counts on from there between polls. */
  reportedAt: number;
}) {
  const from = durationMs > 0 ? Math.min(progressMs / durationMs, 1) : 0;
  const elapsed = useElapsed(progressMs, reportedAt, durationMs, isPlaying);

  return (
    <>
      <span>{formatDuration(elapsed)}</span>
      <span aria-hidden="true" {...stylex.props(styles.bar)}>
        <span
          key={progressMs}
          {...stylex.props(
            styles.fill,
            styles.playing(from, Math.max(durationMs - progressMs, 0)),
            !isPlaying && styles.paused
          )}
        />
      </span>
      <span>{formatDuration(durationMs)}</span>
    </>
  );
}

function useElapsed(
  progressMs: number,
  reportedAt: number,
  durationMs: number,
  isPlaying: boolean
) {
  const [now, setNow] = useState(reportedAt);

  useEffect(() => {
    // Faster than a second so the clock flips close to the real boundary.
    const id = isPlaying
      ? setInterval(() => {
          setNow(Date.now());
        }, 250)
      : undefined;

    return () => {
      clearInterval(id);
    };
  }, [isPlaying]);

  const drift = isPlaying ? Math.max(now - reportedAt, 0) : 0;

  return Math.min(progressMs + drift, durationMs);
}
