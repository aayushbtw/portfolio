import { IconArrowUpRight } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Image } from "@unpic/react";
import { List, ListItem, ListItemHover } from "~/components/ui/list";
import { seo } from "~/lib/seo";
import {
  getNowPlaying,
  getRecentlyPlayed,
  getTopArtists,
  getTopTracks,
  type SpotifyArtist,
  type SpotifyTrack,
} from "~/lib/spotify";

const title = "Music";
const description = "What I'm listening to on Spotify.";

const fetchMusic = createServerFn().handler(async () => {
  const [nowPlaying, recentlyPlayed, topArtists, topTracks] = await Promise.all(
    [getNowPlaying(), getRecentlyPlayed(), getTopArtists(), getTopTracks()]
  );
  return { nowPlaying, recentlyPlayed, topArtists, topTracks };
});

const fetchLive = createServerFn().handler(async () => {
  const [nowPlaying, recentlyPlayed] = await Promise.all([
    getNowPlaying(),
    getRecentlyPlayed(),
  ]);
  return { nowPlaying, recentlyPlayed };
});

export const Route = createFileRoute("/_app/music")({
  loader: () => fetchMusic(),
  head: () => seo({ title, description }),
  headers: () => ({
    "Cache-Control": "public, s-maxage=10, stale-while-revalidate=60",
  }),
  component: MusicPage,
});

function MusicPage() {
  const { nowPlaying, recentlyPlayed, topArtists, topTracks } =
    Route.useLoaderData();

  const { data: live } = useQuery({
    queryKey: ["spotify", "live"],
    queryFn: () => fetchLive(),
    initialData: { nowPlaying, recentlyPlayed },
    staleTime: 10_000,
    refetchInterval: 10_000,
  });

  return (
    <>
      <div className="flex items-center gap-2">
        <h1 className="text-eyebrow">{title}</h1>
        {live.nowPlaying.isPlaying && live.nowPlaying.track ? (
          <NowPlaying track={live.nowPlaying.track} />
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
          {live.recentlyPlayed.map((track) => (
            <TrackItem key={`${track.id}-${track.playedAt}`} track={track} />
          ))}
        </List>
      </div>
    </>
  );
}

function NowPlaying({
  track,
}: {
  track: NonNullable<Awaited<ReturnType<typeof getNowPlaying>>["track"]>;
}) {
  return (
    <a
      className="ml-auto flex items-center gap-2"
      href={track.url}
      rel="noopener"
      target="_blank"
    >
      <span aria-hidden className="flex h-2.5 items-end gap-0.5">
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
