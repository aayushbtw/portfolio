import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { useLive } from "~/lib/spotify";
import type { SpotifyTrack } from "~/server/spotify";
import {
  colors,
  fontSizes,
  lineHeights,
  radii,
  space,
} from "~/styles/tokens.stylex";

const styles = stylex.create({
  trigger: {
    borderRadius: radii.full,
    display: "block",
  },
  disc: {
    backgroundColor: colors.accent,
    borderRadius: radii.full,
    boxShadow: `0 0 0 1px ${colors.fillStrong}`,
    display: "block",
    height: 26,
    overflow: "hidden",
    width: 26,
  },
  cover: {
    height: "100%",
    objectFit: "cover",
    width: "100%",
  },
  card: {
    backgroundColor: "black",
    height: 176,
    position: "relative",
    width: 256,
  },
  caption: {
    backgroundImage: "linear-gradient(to top, rgb(0 0 0 / 0.7), transparent)",
    bottom: 0,
    color: "white",
    display: "flex",
    flexDirection: "column",
    fontSize: fontSizes.sm,
    insetInline: 0,
    lineHeight: lineHeights.row,
    paddingBottom: space.md,
    paddingTop: space.xl,
    paddingInline: space.md,
    position: "absolute",
  },
  truncate: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  artists: {
    opacity: 0.6,
  },
});

function NowPlaying({ style }: { style?: StyleXStyles }) {
  const { data: live } = useLive();
  const track = live?.nowPlaying.isPlaying ? live.nowPlaying.track : null;

  if (!track) {
    return null;
  }

  const src = track.album.images.at(-1)?.url ?? track.album.images[0]?.url;

  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <Link
            aria-label={`Listening to ${track.name} by ${track.artists[0].name}. Open the music page`}
            to="/music"
            {...stylex.props(styles.trigger, style)}
          />
        }
      >
        <span {...stylex.props(styles.disc)}>
          {src ? (
            <Image
              alt=""
              height={52}
              src={src}
              width={52}
              {...stylex.props(styles.cover)}
            />
          ) : null}
        </span>
      </HoverCardTrigger>

      <HoverCardContent align="end" alignOffset={0} side="bottom">
        <TrackCard track={track} />
      </HoverCardContent>
    </HoverCard>
  );
}

function TrackCard({ track }: { track: SpotifyTrack }) {
  const src = track.album.images[0]?.url ?? track.album.images.at(-1)?.url;

  return (
    <div {...stylex.props(styles.card)}>
      {src ? (
        <Image
          alt=""
          height={352}
          src={src}
          width={256}
          {...stylex.props(styles.cover)}
        />
      ) : null}

      <div {...stylex.props(styles.caption)}>
        <span {...stylex.props(styles.truncate)}>{track.name}</span>
        <p {...stylex.props(styles.truncate, styles.artists)}>
          {track.artists.map((a) => a.name).join(", ")}
        </p>
      </div>
    </div>
  );
}

export { NowPlaying };
