import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { getLiveFn, type SpotifyTrack } from "~/server/spotify";

/**
 * The music route reads `recentlyPlayed` off the same query key, so it and the
 * `__root` corner share one request and one interval.
 */
function useLive() {
  return useQuery({
    queryKey: ["spotify", "live"],
    queryFn: () => getLiveFn(),
    staleTime: 10_000,
    refetchInterval: 10_000,
    refetchIntervalInBackground: false,
  });
}

function NowPlaying() {
  const { data: live } = useLive();
  const track = live?.nowPlaying.isPlaying ? live.nowPlaying.track : null;

  if (!track) {
    return null;
  }

  return (
    <HoverCard>
      <HoverCardTrigger
        // Stacks above the top progressive blur and below the skip link.
        className="fixed top-lg right-lg z-40 flex max-w-[min(20rem,50vw)] items-center gap-sm no-underline"
        // Labelled because the visible text is "artist — track": it names the
        // thing, not where the link goes.
        render={
          <Link
            aria-label={`${track.name} by ${track.artists[0].name} — open the music page`}
            to="/music"
          />
        }
      >
        <Bars />
        <span className="min-w-0 truncate text-sm">
          {track.artists[0].name}
          <span className="text-fg-3"> — </span>
          <span className="text-fg-2">{track.name}</span>
        </span>
      </HoverCardTrigger>

      <HoverCardContent align="end" className="w-64 p-sm" side="bottom">
        <TrackCard track={track} />
      </HoverCardContent>
    </HoverCard>
  );
}

const BAR_DELAYS = ["0s", "0.15s", "0.3s"];

function Bars() {
  return (
    <span aria-hidden className="flex h-2.5 shrink-0 items-end gap-xs">
      {BAR_DELAYS.map((delay) => (
        <span
          className="inline-block h-3 w-0.5 origin-bottom animate-eq-bar rounded-[1px] bg-brand"
          key={delay}
          style={{ animationDelay: delay }}
        />
      ))}
    </span>
  );
}

function TrackCard({ track }: { track: SpotifyTrack }) {
  const src = track.album.images[0]?.url ?? track.album.images.at(-1)?.url;

  return (
    <div className="not-typeset flex flex-col gap-sm">
      <span className="text-fg-3 text-xs">Now playing on Spotify</span>

      <div className="flex items-center gap-sm">
        {src ? (
          <Image
            alt=""
            className="size-10 shrink-0 rounded-sm"
            height={40}
            src={src}
            width={40}
          />
        ) : null}

        <div className="flex min-w-0 flex-col">
          <span className="truncate text-fg-1 text-sm">{track.name}</span>
          <p className="truncate text-sm">
            {track.artists.map((a) => a.name).join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
}

export { NowPlaying, useLive };
