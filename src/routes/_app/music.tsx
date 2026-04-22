import { IconArrowUpRight } from "@tabler/icons-react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Image } from "@unpic/react";
import { Suspense } from "react";
import { List, ListItem, ListItemHover } from "@/components/ui/list";
import { Skeleton } from "@/components/ui/skeleton";
import { seo } from "@/lib/seo";
import {
  getNowPlaying,
  getRecentlyPlayed,
  getTopArtists,
  getTopTracks,
  type SpotifyArtist,
  type SpotifyTrack,
} from "@/lib/spotify";
import { cn } from "@/lib/utils";

const title = "Music";
const description = "What I'm listening to on Spotify.";

const fetchNowPlaying = createServerFn().handler(() => getNowPlaying());
const fetchRecentlyPlayed = createServerFn().handler(() => getRecentlyPlayed());
const fetchTopArtists = createServerFn().handler(() => getTopArtists());
const fetchTopTracks = createServerFn().handler(() => getTopTracks());

const nowPlayingQuery = queryOptions({
  queryKey: ["spotify", "nowPlaying"],
  queryFn: () => fetchNowPlaying(),
  staleTime: 10_000,
  refetchInterval: 10_000,
});

const recentlyPlayedQuery = queryOptions({
  queryKey: ["spotify", "recentlyPlayed"],
  queryFn: () => fetchRecentlyPlayed(),
  staleTime: 10_000,
  refetchInterval: 10_000,
});

const topArtistsQuery = queryOptions({
  queryKey: ["spotify", "topArtists"],
  queryFn: () => fetchTopArtists(),
  staleTime: Number.POSITIVE_INFINITY,
});

const topTracksQuery = queryOptions({
  queryKey: ["spotify", "topTracks"],
  queryFn: () => fetchTopTracks(),
  staleTime: Number.POSITIVE_INFINITY,
});

export const Route = createFileRoute("/_app/music")({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(nowPlayingQuery);
    queryClient.prefetchQuery(recentlyPlayedQuery);
    queryClient.prefetchQuery(topArtistsQuery);
    queryClient.prefetchQuery(topTracksQuery);
  },
  head: () => seo({ title, description }),
  component: MusicPage,
});

function MusicPage() {
  return (
    <>
      <div className="flex items-center gap-2">
        <h1 className="text-eyebrow">{title}</h1>
        <Suspense fallback={null}>
          <NowPlaying />
        </Suspense>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-8">
        <Suspense
          fallback={<ListSkeleton count={3} rounded title="Top Tracks" />}
        >
          <TopTracks />
        </Suspense>
        <Suspense
          fallback={
            <ListSkeleton count={3} rounded="full" title="Top Artists" />
          }
        >
          <TopArtists />
        </Suspense>
      </div>

      <div className="mt-6">
        <Suspense
          fallback={<ListSkeleton count={10} rounded title="Recently Played" />}
        >
          <RecentlyPlayed />
        </Suspense>
      </div>
    </>
  );
}

function ListSkeleton({
  count,
  rounded,
  title: heading,
}: {
  count: number;
  rounded: true | "full";
  title: string;
}) {
  return (
    <div>
      <h2 className="text-eyebrow">{heading}</h2>
      <List className="mt-2">
        {Array.from({ length: count }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder list
          <ListItem key={`${heading}-${i}`}>
            <div className="flex items-center gap-4">
              <Skeleton
                className={cn(
                  "size-10 shrink-0",
                  rounded === "full" ? "rounded-full" : "rounded"
                )}
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Skeleton className="h-3.5 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

function NowPlaying() {
  const { data: nowPlaying } = useSuspenseQuery(nowPlayingQuery);
  const { data: recentlyPlayed } = useSuspenseQuery(recentlyPlayedQuery);

  const currentTrack = nowPlaying.track ?? recentlyPlayed[0];
  if (!currentTrack) {
    return null;
  }

  const isPlaying = nowPlaying.isPlaying && nowPlaying.track !== null;
  return <TrackItemNow isPlaying={isPlaying} track={currentTrack} />;
}

function TopTracks() {
  const { data } = useSuspenseQuery(topTracksQuery);
  if (!data.length) {
    return null;
  }
  return (
    <div>
      <h2 className="text-eyebrow">Top Tracks</h2>
      <List className="mt-2">
        {data.map((track) => (
          <TrackItem key={track.id} track={track} />
        ))}
      </List>
    </div>
  );
}

function TopArtists() {
  const { data } = useSuspenseQuery(topArtistsQuery);
  if (!data.length) {
    return null;
  }
  return (
    <div>
      <h2 className="text-eyebrow">Top Artists</h2>
      <List className="mt-2">
        {data.map((artist) => (
          <ArtistItem artist={artist} key={artist.id} />
        ))}
      </List>
    </div>
  );
}

function RecentlyPlayed() {
  const { data } = useSuspenseQuery(recentlyPlayedQuery);
  return (
    <div>
      <h2 className="text-eyebrow">Recently Played</h2>
      <List className="mt-2">
        {data.map((track) => (
          <TrackItem key={`${track.id}-${track.playedAt}`} track={track} />
        ))}
      </List>
    </div>
  );
}

function Equalizer() {
  return (
    <span aria-hidden className="flex h-2.5 items-end gap-0.5">
      <span className="eq-bar" style={{ animationDelay: "0s" }} />
      <span className="eq-bar" style={{ animationDelay: "0.15s" }} />
      <span className="eq-bar" style={{ animationDelay: "0.3s" }} />
    </span>
  );
}

function TrackItemNow({
  track,
  isPlaying,
}: {
  track: SpotifyTrack;
  isPlaying: boolean;
}) {
  const cover = track.album.images.at(-1)?.url ?? track.album.images[0]?.url;

  let indicator: React.ReactNode = null;
  if (isPlaying) {
    indicator = <Equalizer />;
  } else if (cover) {
    indicator = (
      <Image
        alt=""
        className="size-4 shrink-0 rounded-full"
        height={16}
        src={cover}
        width={16}
      />
    );
  }

  return (
    <a
      className="ml-auto flex items-center gap-2"
      href={track.url}
      rel="noopener"
      target="_blank"
    >
      {indicator}
      <span className="text-xs">
        {track.artists[0].name}
        <span className="text-fg-3"> — </span>
        <span className="text-fg-2">{track.name}</span>
      </span>
    </a>
  );
}

function TrackItem({ track }: { track: SpotifyTrack }) {
  const cover = track.album.images.at(-1)?.url ?? track.album.images[0]?.url;

  return (
    <ListItem>
      <a
        className="flex items-center gap-4"
        href={track.url}
        rel="noopener"
        target="_blank"
      >
        {cover ? (
          <Image
            alt={track.name}
            className="size-10 shrink-0 rounded"
            height={40}
            src={cover}
            width={40}
          />
        ) : null}
        <div className="flex min-w-0 flex-col">
          <h6 className="truncate text-fg-2">{track.name}</h6>
          <p className="truncate">
            {track.artists.map((a) => a.name).join(", ")}
          </p>
        </div>

        <ListItemHover>
          <IconArrowUpRight />
        </ListItemHover>
      </a>
    </ListItem>
  );
}

function ArtistItem({ artist }: { artist: SpotifyArtist }) {
  const photo = artist.images.at(-1)?.url ?? artist.images[0]?.url;
  return (
    <ListItem>
      <a
        className="flex items-center gap-4"
        href={artist.url}
        rel="noopener"
        target="_blank"
      >
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
          <h6 className="truncate text-fg-2">{artist.name}</h6>
        </div>

        <ListItemHover>
          <IconArrowUpRight />
        </ListItemHover>
      </a>
    </ListItem>
  );
}
