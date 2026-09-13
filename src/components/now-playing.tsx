import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { ProgressiveBlur } from "~/components/ui/progressive-blur";
import { useLive } from "~/lib/spotify";
import { cn } from "~/lib/utils";
import type { SpotifyTrack } from "~/server/spotify";

function NowPlaying({ className }: { className?: string }) {
  const { data: live } = useLive();
  const track = live?.nowPlaying.isPlaying ? live.nowPlaying.track : null;

  if (!track) {
    return null;
  }

  const src = track.album.images.at(-1)?.url ?? track.album.images[0]?.url;

  return (
    <HoverCard>
      <HoverCardTrigger
        className={cn("block rounded-full no-underline", className)}
        render={
          <Link
            aria-label={`Listening to ${track.name} by ${track.artists[0].name}. Open the music page`}
            to="/music"
          />
        }
      >
        <span className="animate-disc bg-bg-2 ring-fg-1/10 block size-6 overflow-hidden rounded-full ring-1">
          {src ? (
            <Image
              alt=""
              className="size-full object-cover"
              height={48}
              src={src}
              width={48}
            />
          ) : null}
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

      <ProgressiveBlur className="h-24" position="bottom" />

      <div className="px-md pt-xl pb-md absolute inset-x-0 bottom-0 z-20 flex flex-col gap-0.5 bg-linear-to-t from-black/70 to-transparent">
        <span className="truncate text-sm text-white">{track.name}</span>
        <p className="truncate text-sm text-white/60">
          {track.artists.map((a) => a.name).join(", ")}
        </p>
      </div>
    </div>
  );
}

export { NowPlaying };
