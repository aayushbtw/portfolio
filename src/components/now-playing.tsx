import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { useSyncExternalStore } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { ProgressiveBlur } from "~/components/ui/progressive-blur";
import { useLive } from "~/lib/spotify";
import type { SpotifyTrack } from "~/server/spotify";

// Tailwind's `lg`. A media query string can't read the token, so this is a
// second copy of it: change both or neither.
const DESKTOP = "(min-width: 64rem)";

/** `false` until the client says otherwise, so the server renders nothing. */
function useIsDesktop() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const query = window.matchMedia(DESKTOP);
      query.addEventListener("change", onStoreChange);
      return () => query.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia(DESKTOP).matches,
    () => false
  );
}

function NowPlaying() {
  const isDesktop = useIsDesktop();
  const { data: live } = useLive({ enabled: isDesktop });
  const track = live?.nowPlaying.isPlaying ? live.nowPlaying.track : null;

  if (!(isDesktop && track)) {
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

      <HoverCardContent
        align="end"
        alignOffset={0}
        className="w-64 overflow-hidden p-0"
        side="bottom"
      >
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
    <div className="not-typeset relative h-44 bg-black">
      {src ? (
        <Image
          alt=""
          className="size-full object-cover"
          height={352}
          src={src}
          width={256}
        />
      ) : null}

      {/* Blurs the cover under the text, so line art can't cut through it. */}
      <ProgressiveBlur className="h-24" position="bottom" />

      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-0.5 bg-linear-to-t from-black/70 to-transparent px-md pt-xl pb-md">
        <span className="truncate font-medium text-sm text-white">
          {track.name}
        </span>
        <p className="truncate text-sm text-white/60">
          {track.artists.map((a) => a.name).join(", ")}
        </p>
      </div>
    </div>
  );
}

export { NowPlaying };
