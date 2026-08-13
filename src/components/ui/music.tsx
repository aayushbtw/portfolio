import * as stylex from "@stylexjs/stylex";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Image } from "@unpic/react";
import { Box } from "~/components/primitives/box";
import { Icon } from "~/components/primitives/icon";
import { Skeleton } from "~/components/primitives/skeleton";
import { Text } from "~/components/primitives/text";
import type { SpotifyArtist, SpotifyTrack } from "~/lib/spotify";
import { background } from "~/styles/tokens/color.stylex";
import { radius, spacing } from "~/styles/tokens/layout.stylex";
import { List, ListItem, ListItemHover, listStyles } from "./list";

/* The now-playing equaliser. Three bars share one set of keyframes and differ
   only by delay, so the animation is declared once. */
const bounce = stylex.keyframes({
  "0%, 100%": { transform: "scaleY(0.35)" },
  "50%": { transform: "scaleY(1)" },
});

const BAR_DELAYS = ["0s", "0.15s", "0.3s"];

const styles = stylex.create({
  nowPlaying: { display: "flex", alignItems: "center", gap: spacing.sm },
  eqRow: { display: "flex", height: "0.625rem", alignItems: "flex-end" },
  eqBar: {
    display: "inline-block",
    width: "2px",
    height: "0.75rem",
    borderRadius: "1px",
    backgroundColor: background.brand,
    transformOrigin: "bottom",
    animationName: bounce,
    animationDuration: "0.9s",
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
  },
  eqDelay: (delay: string) => ({ animationDelay: delay }),
  /* Artwork is a fixed square that never shrinks: the row's text gives way
     first, which is why it is sized here and not by the flex line. */
  cover: { width: "2.5rem", height: "2.5rem", flexShrink: 0 },
  square: { borderRadius: radius.sm },
  round: { borderRadius: "9999px" },
  // Placeholder widths sit near the strings they stand in for.
  lineWide: { width: "8rem", height: "1rem" },
  lineNarrow: { width: "6rem", height: "1rem" },
  coverPlaceholder: { width: "2.5rem", height: "2.5rem", flexShrink: 0 },
});

function NowPlaying({ track }: { track: SpotifyTrack }) {
  return (
    <a
      {...stylex.props(styles.nowPlaying)}
      href={track.url}
      rel="noopener"
      target="_blank"
    >
      <Box aria-hidden style={styles.eqRow}>
        {BAR_DELAYS.map((delay) => (
          <Box key={delay} style={[styles.eqBar, styles.eqDelay(delay)]} />
        ))}
      </Box>
      <Text as="span" variant="label">
        {track.artists[0].name}
        <Text as="span" color="fg-3" variant="label">
          {" — "}
        </Text>
        <Text as="span" color="fg-2" variant="label">
          {track.name}
        </Text>
      </Text>
    </a>
  );
}

function TrackSkeleton() {
  return (
    <ListItem>
      <Box style={listStyles.link}>
        <Skeleton style={[styles.coverPlaceholder, styles.square]} />
        <Box display="flex" flex="1" flexDirection="column" gap="sm" shrink>
          <Skeleton style={styles.lineWide} />
          <Skeleton style={styles.lineNarrow} />
        </Box>
      </Box>
    </ListItem>
  );
}

function TrackItem({ track }: { track: SpotifyTrack }) {
  const cover = track.album.images.at(-1)?.url ?? track.album.images[0]?.url;

  return (
    <ListItem>
      <a
        {...stylex.props(listStyles.link)}
        href={track.url}
        rel="noopener"
        target="_blank"
      >
        {cover ? (
          <Image
            alt={track.name}
            height={40}
            src={cover}
            width={40}
            {...stylex.props(styles.cover, styles.square)}
          />
        ) : null}

        <Box display="flex" flexDirection="column" shrink>
          <Text as="span" truncate variant="row-title">
            {track.name}
          </Text>
          <Text truncate variant="row">
            {track.artists.map((a) => a.name).join(", ")}
          </Text>
        </Box>

        <ListItemHover>
          <Icon as={IconArrowUpRight} color="fg-3" size="md" />
        </ListItemHover>
      </a>
    </ListItem>
  );
}

function ArtistItem({ artist }: { artist: SpotifyArtist }) {
  const photo = artist.images.at(-1)?.url ?? artist.images[0]?.url;

  return (
    <ListItem>
      <a
        {...stylex.props(listStyles.link)}
        href={artist.url}
        rel="noopener"
        target="_blank"
      >
        {photo ? (
          <Image
            alt=""
            height={40}
            src={photo}
            width={40}
            {...stylex.props(styles.cover, styles.round)}
          />
        ) : null}

        <Box display="flex" flexDirection="column" shrink>
          <Text as="span" truncate variant="row-title">
            {artist.name}
          </Text>
        </Box>

        <ListItemHover>
          <Icon as={IconArrowUpRight} color="fg-3" size="md" />
        </ListItemHover>
      </a>
    </ListItem>
  );
}

function TrackList({ tracks }: { tracks: SpotifyTrack[] }) {
  return (
    <List>
      {tracks.map((track) => (
        <TrackItem key={`${track.id}-${track.playedAt ?? ""}`} track={track} />
      ))}
    </List>
  );
}

function ArtistList({ artists }: { artists: SpotifyArtist[] }) {
  return (
    <List>
      {artists.map((artist) => (
        <ArtistItem artist={artist} key={artist.id} />
      ))}
    </List>
  );
}

function TrackListSkeleton({ rows }: { rows: number }) {
  return (
    <List>
      {Array.from({ length: rows }, (_, i) => `skeleton-${i}`).map((key) => (
        <TrackSkeleton key={key} />
      ))}
    </List>
  );
}

export { ArtistList, NowPlaying, TrackList, TrackListSkeleton };
