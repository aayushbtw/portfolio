import { useQuery } from "@tanstack/react-query";
import { Await, createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";
import { Suspense } from "react";
import { Box } from "~/components/primitives/box";
import { Text } from "~/components/primitives/text";
import {
  ArtistList,
  NowPlaying,
  TrackList,
  TrackListSkeleton,
} from "~/components/ui/music";
import { PageHeader } from "~/components/ui/page-header";
import { seo } from "~/lib/seo";
import { getLive, getTops } from "~/lib/spotify";

const title = "Music";
const description = "What I’m listening to on Spotify.";

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
            <Box columns={2} display="grid" gap="lg" marginTop="lg">
              {topTracks.length > 0 ? (
                <Box>
                  <Text as="h2" variant="section-label">
                    Top Tracks
                  </Text>
                  <TrackList tracks={topTracks} />
                </Box>
              ) : null}

              {topArtists.length > 0 ? (
                <Box>
                  <Text as="h2" variant="section-label">
                    Top Artists
                  </Text>
                  <ArtistList artists={topArtists} />
                </Box>
              ) : null}
            </Box>
          )}
        </Await>
      </Suspense>

      <Box marginTop="xl">
        <Text as="h2" variant="section-label">
          Recently Played
        </Text>
        {live ? (
          <TrackList tracks={live.recentlyPlayed} />
        ) : (
          <TrackListSkeleton rows={5} />
        )}
      </Box>
    </>
  );
}

function TopsSkeleton() {
  return (
    <Box columns={2} display="grid" gap="lg" marginTop="lg">
      {["Top Tracks", "Top Artists"].map((heading) => (
        <Box key={heading}>
          <Text as="h2" variant="section-label">
            {heading}
          </Text>
          <TrackListSkeleton rows={5} />
        </Box>
      ))}
    </Box>
  );
}
