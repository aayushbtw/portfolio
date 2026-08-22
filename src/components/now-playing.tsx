import { useQuery } from "@tanstack/react-query";
import { Image } from "@unpic/react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { getLiveFn, type SpotifyTrack } from "~/server/spotify";

/**
 * Polls Spotify for what is playing right now. Mounted once in `__root`, so it
 * renders on every route rather than only on `/music`.
 *
 * The music route reads `recentlyPlayed` off the same query key, so the two
 * share one request and one interval instead of polling the service twice.
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

  // Nothing playing is the common case. Rendering nothing at all beats holding
  // an empty slot open in the corner of every page.
  if (!track) {
    return null;
  }

  return (
    <HoverCard>
      <HoverCardTrigger
        // Fixed to the viewport rather than placed in the layout grid: it is
        // chrome, not content, and belongs to the page as a whole. `z-40`
        // clears the top progressive blur (`z-30`) and stays under the skip
        // link (`z-50`).
        className="fixed top-lg right-lg z-40 flex max-w-[min(20rem,50vw)] items-center gap-sm no-underline"
        // The anchor props live on the rendered element rather than on the
        // trigger, so this reads as the link it is. The label is here because
        // the visible text is "artist — track": it names the thing, not where
        // the link goes.
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
        <span className="min-w-0 truncate text-compact">
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
      {/* The corner line is three bars and a track name with no context. This
          is where it says what it is, and that it is live rather than a
          favourite or a last-played. */}
      <span className="text-compact text-fg-3">Now playing on Spotify</span>

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
          <span className="truncate text-compact text-fg-3">
            {track.artists.map((a) => a.name).join(", ")}
          </span>
          <span className="truncate text-compact text-fg-3">
            {track.album.name}
          </span>
        </div>
      </div>
    </div>
  );
}

export { NowPlaying, useLive };
