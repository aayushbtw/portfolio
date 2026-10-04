import { ArrowUpRight } from "@phosphor-icons/react/ArrowUpRight";
import { Await, createFileRoute } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { Suspense } from "react";

import { List, ListItem, ListItemHover } from "~/components/ui/list";
import { Page } from "~/components/ui/page";
import { Skeleton } from "~/components/ui/skeleton";
import { seo } from "~/lib/seo";
import { useLive } from "~/lib/spotify";
import { getTopsFn } from "~/server/spotify";
import type { SpotifyArtist, SpotifyTrack } from "~/server/spotify";

const title = "Music";

const description = "What I’m listening to on Spotify.";

export const Route = createFileRoute("/_app/music")({
  loader: () => ({ tops: getTopsFn() }),
  head: () => seo({ title, description }),
  headers: () => ({
    "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
  }),
  component: MusicPage,
});

function MusicPage() {
  const { tops } = Route.useLoaderData();

  // `NowPlaying`'s key, so this reads the cache instead of polling twice.
  const { data: live } = useLive();

  return (
    <Page>
      <section>
        <h1>{title}</h1>
      </section>

      <Suspense fallback={<TopsSkeleton />}>
        <Await promise={tops}>
          {({ topArtists, topTracks }) => (
            <TopsGrid>
              {topTracks.length > 0 ? (
                <section>
                  <h2>Top Tracks</h2>
                  <List>
                    {topTracks.map((track) => (
                      <TrackItem key={track.id} track={track} />
                    ))}
                  </List>
                </section>
              ) : null}

              {topArtists.length > 0 ? (
                <section>
                  <h2>Top Artists</h2>
                  <List>
                    {topArtists.map((artist) => (
                      <ArtistItem artist={artist} key={artist.id} />
                    ))}
                  </List>
                </section>
              ) : null}
            </TopsGrid>
          )}
        </Await>
      </Suspense>

      <section>
        <h2>Recently Played</h2>
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
      </section>
    </Page>
  );
}

function TopsGrid({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

function TopsSkeleton() {
  return (
    <TopsGrid>
      {["tracks", "artists"].map((key) => (
        <section key={key}>
          <h2>{key === "tracks" ? "Top Tracks" : "Top Artists"}</h2>
          <List>
            {Array.from({ length: 5 }, (_, i) => `${key}-${i}`).map((k) => (
              <TrackSkeleton key={k} />
            ))}
          </List>
        </section>
      ))}
    </TopsGrid>
  );
}

function TrackSkeleton() {
  return (
    <div>
      <Skeleton />
      <div>
        <Skeleton />
        <Skeleton />
      </div>
    </div>
  );
}

function TrackItem({ track }: { track: SpotifyTrack }) {
  const cover = track.album.images.at(-1)?.url ?? track.album.images[0]?.url;

  return (
    <ListItem href={track.url} rel="noopener" target="_blank">
      {cover ? (
        <Image alt={track.name} height={40} src={cover} width={40} />
      ) : null}

      <div>
        <span>{track.name}</span>
        <p>{track.artists.map((a) => a.name).join(", ")}</p>
      </div>

      <ListItemHover>
        <ArrowUpRight aria-hidden="true" weight="light" />
      </ListItemHover>
    </ListItem>
  );
}

function ArtistItem({ artist }: { artist: SpotifyArtist }) {
  const photo = artist.images.at(-1)?.url ?? artist.images[0]?.url;

  return (
    <ListItem href={artist.url} rel="noopener" target="_blank">
      {photo ? <Image alt="" height={40} src={photo} width={40} /> : null}

      <div>
        <span>{artist.name}</span>
      </div>

      <ListItemHover>
        <ArrowUpRight aria-hidden="true" weight="light" />
      </ListItemHover>
    </ListItem>
  );
}
