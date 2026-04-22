import { IconArrowUpRight } from "@tabler/icons-react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Image } from "@unpic/react";
import { List, ListItem, ListItemHover } from "@/components/ui/list";
import { seo } from "@/lib/seo";
import {
  getNowPlaying,
  getRecentlyPlayed,
  getTopArtists,
  getTopTracks,
  type SpotifyArtist,
  type SpotifyTrack,
} from "@/lib/spotify";

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
  // ssr: "data-only",
  loader: ({ context: { queryClient } }) => {
    return Promise.all([
      queryClient.ensureQueryData(nowPlayingQuery),
      queryClient.ensureQueryData(recentlyPlayedQuery),
      queryClient.ensureQueryData(topArtistsQuery),
      queryClient.ensureQueryData(topTracksQuery),
    ]);
  },
  head: () => seo({ title, description }),
  component: MusicPage,
});

function MusicPage() {
  const { data: nowPlaying } = useSuspenseQuery(nowPlayingQuery);
  const { data: recentlyPlayed } = useSuspenseQuery(recentlyPlayedQuery);
  const { data: topArtists } = useSuspenseQuery(topArtistsQuery);
  const { data: topTracks } = useSuspenseQuery(topTracksQuery);

  const currentTrack = nowPlaying.track ?? recentlyPlayed[0];
  const isPlaying = nowPlaying.isPlaying && nowPlaying.track !== null;

  return (
    <>
      <div className="flex items-center gap-2">
        <h1 className="text-eyebrow">{title}</h1>
        {currentTrack ? (
          <TrackItemNow isPlaying={isPlaying} track={currentTrack} />
        ) : null}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-8">
        {topTracks.length > 0 ? (
          <div>
            <h2 className="text-eyebrow">Top Tracks</h2>
            <List className="mt-2">
              {topTracks.map((track) => (
                <TrackItem key={track.id} track={track} />
              ))}
            </List>
          </div>
        ) : null}

        {topArtists.length > 0 ? (
          <div>
            <h2 className="text-eyebrow">Top Artists</h2>
            <List className="mt-2">
              {topArtists.map((artist) => (
                <ArtistItem artist={artist} key={artist.id} />
              ))}
            </List>
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        <h2 className="text-eyebrow">Recently Played</h2>
        <List className="mt-2">
          {recentlyPlayed.map((track) => (
            <TrackItem key={`${track.id}-${track.playedAt}`} track={track} />
          ))}
        </List>
      </div>
    </>
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
