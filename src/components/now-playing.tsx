import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { useEffect, useState } from "react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { useLive } from "~/lib/spotify";
import type { SpotifyTrack } from "~/server/spotify";
import {
  colors,
  durations,
  easings,
  fontSizes,
  lineHeights,
  media,
  presses,
  radii,
  shadows,
  space,
} from "~/styles/tokens.stylex";

// A record being swapped: the new cover spins in over the old one.
const swap = stylex.keyframes({
  from: { opacity: 0, transform: "rotate(-90deg) scale(0.5)" },
});

const fade = stylex.keyframes({
  from: { opacity: 0 },
});

const styles = stylex.create({
  trigger: {
    borderRadius: radii.full,
    display: "block",
    transform: { default: null, ":active": presses.icon },
    transitionDuration: durations.press,
    transitionProperty: "transform",
    transitionTimingFunction: easings.out,
  },
  disc: {
    backgroundColor: colors.accent,
    borderRadius: radii.full,
    boxShadow: shadows.ring,
    display: "block",
    height: 26,
    overflow: "hidden",
    position: "relative",
    width: 26,
  },
  // Transitions, not keyframes: playback resuming mid-exit reverses from where the disc is.
  // A 26px disc needs a large scale change to read at all.
  motion: {
    transitionDuration: "500ms",
    transitionProperty: {
      default: "filter, opacity, transform",
      [media.reducedMotion]: "filter, opacity",
    },
    transitionTimingFunction: easings.overshoot,
  },
  hidden: {
    filter: "blur(4px)",
    opacity: 0,
    pointerEvents: "none",
    transform: "scale(0.4)",
  },
  leaving: {
    transitionDuration: "250ms",
    transitionTimingFunction: easings.out,
  },
  // Round on its own: browsers drop the parent's rounded clip while a child transforms.
  layer: {
    borderRadius: radii.full,
    display: "block",
    inset: 0,
    overflow: "hidden",
    position: "absolute",
  },
  swap: {
    animationDuration: "600ms",
    animationFillMode: "both",
    animationName: { default: swap, [media.reducedMotion]: fade },
    animationTimingFunction: easings.overshoot,
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
  const track =
    live?.nowPlaying.isPlaying === true ? live.nowPlaying.track : null;

  // The last track stays rendered while the disc leaves, and under the next cover while it fades in.
  const [shown, setShown] = useState(track);
  const [previous, setPrevious] = useState<SpotifyTrack | null>(null);

  if (track && track.id !== shown?.id) {
    setPrevious(shown);
    setShown(track);
  }

  if (!shown) {
    return null;
  }

  const leaving = track === null;

  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <Link
            aria-label={`Listening to ${shown.name} by ${shown.artists[0].name}. Open the music page`}
            to="/music"
            {...stylex.props(styles.trigger, style)}
          />
        }
      >
        <Disc
          leaving={leaving}
          onLeft={() => {
            setShown(null);
          }}
        >
          {previous ? <Cover track={previous} /> : null}
          <span
            key={shown.id}
            {...stylex.props(styles.layer, previous && styles.swap)}
            onAnimationEnd={(event) => {
              if (event.target === event.currentTarget) {
                setPrevious(null);
              }
            }}
          >
            <Cover track={shown} />
          </span>
        </Disc>
      </HoverCardTrigger>

      <HoverCardContent align="end" alignOffset={0} side="bottom">
        <TrackCard track={shown} />
      </HoverCardContent>
    </HoverCard>
  );
}

function Disc({
  children,
  leaving,
  onLeft,
}: {
  children: React.ReactNode;
  leaving: boolean;
  onLeft: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  // One frame at the hidden state first, so the transition has somewhere to start.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <span
      {...stylex.props(
        styles.disc,
        styles.motion,
        (!mounted || leaving) && styles.hidden,
        leaving && styles.leaving
      )}
      onTransitionEnd={(event) => {
        if (
          leaving &&
          event.target === event.currentTarget &&
          event.propertyName === "opacity"
        ) {
          onLeft();
        }
      }}
    >
      {children}
    </span>
  );
}

function Cover({ track }: { track: SpotifyTrack }) {
  const src = track.album.images.at(-1)?.url ?? track.album.images[0]?.url;

  if (!src) {
    return null;
  }

  return (
    <Image
      alt=""
      height={52}
      src={src}
      width={52}
      {...stylex.props(styles.layer, styles.cover)}
    />
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
