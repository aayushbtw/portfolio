import { IconArrowUpRight } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { Await, createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";
import { Image } from "@unpic/react";
import { Suspense } from "react";
import { List, ListItem, ListItemHover } from "~/components/ui/list";
import { PageHeader } from "~/components/ui/page-header";
import { Skeleton } from "~/components/ui/skeleton";
import { seo } from "~/lib/seo";
import {
  getLive,
  getTops,
  type SpotifyArtist,
  type SpotifyTrack,
} from "~/lib/spotify";

const title = "Music";
const description = "What I'm listening to on Spotify.";

// GET + its own cache headers: the route's `headers()` only covers the document,
// so on client navigation this call is a separate uncacheable request otherwise.
const fetchTops = createServerFn({ method: "GET" }).handler(() => {
  setResponseHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=604800"
  );
  return getTops();
});

const fetchLive = createServerFn().handler(() => getLive());

export const Route = createFileRoute("/_app/music")({
  loader: () => ({ tops: fetchTops() }),
  head: () => seo({ title, description }),
  headers: () => ({
    "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
  }),
  component: MusicPage,
});

function MusicPage() {
  const { tops } = Route.useLoaderData();

  const { data: live } = useQuery({
    queryKey: ["spotify", "live"],
    queryFn: () => fetchLive(),
    staleTime: 10_000,
    refetchInterval: 10_000,
    refetchIntervalInBackground: false,
  });

  return (
    <>
      <PageHeader title={title}>
        {live?.nowPlaying.isPlaying && live.nowPlaying.track ? (
          <NowPlaying track={live.nowPlaying.track} />
        ) : null}
      </PageHeader>

      <Suspense fallback={<TopsSkeleton />}>
        <Await promise={tops}>
          {({ topArtists, topTracks }) => (
            <div className="mt-lg grid grid-cols-1 gap-lg md:grid-cols-2">
              {topTracks.length > 0 ? (
                <div>
                  <h2 className="text-section-label">Top Tracks</h2>
                  <List>
                    {topTracks.map((track) => (
                      <TrackItem key={track.id} track={track} />
                    ))}
                  </List>
                </div>
              ) : null}

              {topArtists.length > 0 ? (
                <div>
                  <h2 className="text-section-label">Top Artists</h2>
                  <List>
                    {topArtists.map((artist) => (
                      <ArtistItem artist={artist} key={artist.id} />
                    ))}
                  </List>
                </div>
              ) : null}
            </div>
          )}
        </Await>
      </Suspense>

      <div className="mt-lg">
        <h2 className="text-section-label">Recently Played</h2>
        <List>
          {live
            ? live.recentlyPlayed.map((track) => (
                <TrackItem
                  key={`${track.id}-${track.playedAt}`}
                  track={track}
                />
              ))
            : Array.from({ length: 5 }, (_, i) => `skeleton-${i}`).map(
                (key) => <TrackSkeleton key={key} />
              )}
        </List>
      </div>
    </>
  );
}

function NowPlaying({ track }: { track: SpotifyTrack }) {
  return (
    <a
      className="flex items-center gap-sm"
      href={track.url}
      rel="noopener"
      target="_blank"
    >
      <span aria-hidden className="flex h-2.5 items-end gap-xs">
        <span className="eq-bar" style={{ animationDelay: "0s" }} />
        <span className="eq-bar" style={{ animationDelay: "0.15s" }} />
        <span className="eq-bar" style={{ animationDelay: "0.3s" }} />
      </span>
      <span className="text-xs">
        {track.artists[0].name}
        <span className="text-fg-3"> — </span>
        <span className="text-fg-2">{track.name}</span>
      </span>
    </a>
  );
}

function TopsSkeleton() {
  return (
    <div className="mt-lg grid grid-cols-1 gap-lg md:grid-cols-2">
      {["tracks", "artists"].map((key) => (
        <div key={key}>
          <h2 className="text-section-label">
            {key === "tracks" ? "Top Tracks" : "Top Artists"}
          </h2>
          <List>
            {Array.from({ length: 5 }, (_, i) => `${key}-${i}`).map((k) => (
              <TrackSkeleton key={k} />
            ))}
          </List>
        </div>
      ))}
    </div>
  );
}

function TrackSkeleton() {
  return (
    <ListItem>
      <div className="row-link">
        <Skeleton className="size-10 shrink-0 rounded-sm" />
        <div className="flex min-w-0 flex-1 flex-col gap-sm">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </ListItem>
  );
}

function TrackItem({ track }: { track: SpotifyTrack }) {
  const cover = track.album.images.at(-1)?.url ?? track.album.images[0]?.url;

  return (
    <ListItem>
      <a className="row-link" href={track.url} rel="noopener" target="_blank">
        {cover ? (
          <Image
            alt={track.name}
            className="size-10 shrink-0 rounded-sm"
            height={40}
            src={cover}
            width={40}
          />
        ) : null}

        <div className="flex min-w-0 flex-col">
          <span className="truncate text-fg-2">{track.name}</span>
          <p className="truncate">
            {track.artists.map((a) => a.name).join(", ")}
          </p>
        </div>

        <ListItemHover>
          <IconArrowUpRight aria-hidden="true" />
        </ListItemHover>
      </a>
    </ListItem>
  );
}

function ArtistItem({ artist }: { artist: SpotifyArtist }) {
  const photo = artist.images.at(-1)?.url ?? artist.images[0]?.url;

  return (
    <ListItem>
      <a className="row-link" href={artist.url} rel="noopener" target="_blank">
        {photo ? (
          <Image
            alt=""
            className="size-10 shrink-0 rounded-full"
            height={40}
            src={photo}
            width={40}
          />
        ) : null}

        <div className="flex min-w-0 flex-col">
          <span className="truncate text-fg-2">{artist.name}</span>
        </div>

        <ListItemHover>
          <IconArrowUpRight aria-hidden="true" />
        </ListItemHover>
      </a>
    </ListItem>
  );
}
