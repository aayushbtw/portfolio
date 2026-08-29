import { IconArrowUpRight } from "@tabler/icons-react";
import { Await, createFileRoute } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { Suspense } from "react";
import { PageHeader, PageTitle } from "~/components/page-header";
import { List, ListItem, ListItemHover } from "~/components/ui/list";
import { Page } from "~/components/ui/page";
import { Skeleton } from "~/components/ui/skeleton";
import { seo } from "~/lib/seo";
import { useLive } from "~/lib/spotify";
import {
  getTopsFn,
  type SpotifyArtist,
  type SpotifyTrack,
} from "~/server/spotify";

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
        <PageHeader>
          <PageTitle>{title}</PageTitle>
        </PageHeader>
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
  return (
    <div className="grid grid-cols-1 gap-xl md:grid-cols-2">{children}</div>
  );
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
    <div className="-mx-md flex items-center gap-md px-md py-sm">
      <Skeleton className="size-10 shrink-0 rounded-sm" />
      <div className="flex min-w-0 flex-1 flex-col gap-sm">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

function TrackItem({ track }: { track: SpotifyTrack }) {
  const cover = track.album.images.at(-1)?.url ?? track.album.images[0]?.url;

  return (
    <ListItem href={track.url} rel="noopener" target="_blank">
      {cover ? (
        <Image
          alt={track.name}
          className="size-10 shrink-0 rounded-sm ring-1 ring-fg-1/10"
          height={40}
          src={cover}
          width={40}
        />
      ) : null}

      <div className="flex min-w-0 flex-col">
        <span className="truncate">{track.name}</span>
        <p className="truncate text-fg-2">
          {track.artists.map((a) => a.name).join(", ")}
        </p>
      </div>

      <ListItemHover>
        <IconArrowUpRight aria-hidden="true" stroke={1.5} />
      </ListItemHover>
    </ListItem>
  );
}

function ArtistItem({ artist }: { artist: SpotifyArtist }) {
  const photo = artist.images.at(-1)?.url ?? artist.images[0]?.url;

  return (
    <ListItem href={artist.url} rel="noopener" target="_blank">
      {photo ? (
        <Image
          alt=""
          className="size-10 shrink-0 rounded-full ring-1 ring-fg-1/10"
          height={40}
          src={photo}
          width={40}
        />
      ) : null}

      <div className="flex min-w-0 flex-col">
        <span className="truncate">{artist.name}</span>
      </div>

      <ListItemHover>
        <IconArrowUpRight aria-hidden="true" stroke={1.5} />
      </ListItemHover>
    </ListItem>
  );
}
