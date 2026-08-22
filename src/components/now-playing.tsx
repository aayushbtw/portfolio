import { useQuery } from "@tanstack/react-query";
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
          // biome-ignore lint/a11y/useAnchorContent: Base UI clones this element and injects the trigger's children into it, so the rule only ever sees the bare tag written here.
          <a
            aria-label={`${track.name} by ${track.artists[0].name} — open on Spotify`}
            href={track.url}
            rel="noopener"
            target="_blank"
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

      <HoverCardContent align="end" className="w-72" side="bottom">
        <TrackCard track={track} />
      </HoverCardContent>
    </HoverCard>
  );
}

function Bars() {
  return (
    <span aria-hidden className="flex h-2.5 shrink-0 items-end gap-xs">
      <span className="eq-bar" style={{ animationDelay: "0s" }} />
      <span className="eq-bar" style={{ animationDelay: "0.15s" }} />
      <span className="eq-bar" style={{ animationDelay: "0.3s" }} />
    </span>
  );
}

function TrackCard({ track }: { track: SpotifyTrack }) {
  const cover = track.album.images[0]?.url ?? track.album.images.at(-1)?.url;

  return (
    <div className="not-typeset flex flex-col gap-sm">
      <span className="text-fg-3 text-sm">Now playing on Spotify</span>

      <div className="flex items-center gap-md">
        {cover ? (
          <Image
            alt=""
            className="size-14 shrink-0 rounded-sm"
            height={56}
            src={cover}
            width={56}
          />
        ) : null}

        <div className="flex min-w-0 flex-col">
          <span className="truncate text-fg-1">{track.name}</span>
          <span className="truncate text-fg-3 text-sm">
            {track.artists.map((a) => a.name).join(", ")}
          </span>
          <span className="truncate text-fg-3 text-sm">{track.album.name}</span>
        </div>
      </div>
    </div>
  );
}

export { NowPlaying, useLive };
