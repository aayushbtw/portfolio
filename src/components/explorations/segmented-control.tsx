"use client";

import * as stylex from "@stylexjs/stylex";
import { useRef, useState } from "react";

import {
  colors,
  durations,
  easings,
  fontSizes,
  lineHeights,
  media,
  radii,
  shadows,
  space,
} from "~/styles/tokens.stylex";

const OPTIONS = ["Day", "Week", "Month", "Year"];

const COLUMN = `((100% - 2 * ${space.xxs}) / ${OPTIONS.length})`;

const styles = stylex.create({
  group: {
    backgroundColor: colors.fill,
    borderRadius: radii.full,
    display: "grid",
    gridAutoColumns: "1fr",
    gridAutoFlow: "column",
    padding: space.xxs,
    position: "relative",
    width: 320,
  },
  // Equal columns mean the pill only ever translates: no measuring, and the
  // server render already has it in place.
  indicator: {
    backgroundColor: colors.background,
    borderRadius: radii.full,
    bottom: space.xxs,
    boxShadow: shadows.ring,
    left: space.xxs,
    position: "absolute",
    top: space.xxs,
    width: `calc${COLUMN}`,
  },
  offset: (index: number) => ({
    transform: `translateX(${index * 100}%)`,
  }),
  // A copy of the labels in the selected color, clipped to the pill, so the
  // color changes exactly where the pill is mid-slide.
  selectedLayer: {
    color: colors.textPrimary,
    display: "grid",
    gridAutoColumns: "1fr",
    gridAutoFlow: "column",
    inset: 0,
    padding: space.xxs,
    pointerEvents: "none",
    position: "absolute",
  },
  clip: (index: number) => ({
    clipPath: `inset(${space.xxs} calc(100% - ${space.xxs} - ${index + 1} * ${COLUMN}) ${space.xxs} calc(${space.xxs} + ${index} * ${COLUMN}) round 9999px)`,
  }),
  // Pill and clip share one clock, or the color would drift off the pill.
  moving: {
    transitionDuration: durations.move,
    transitionProperty: {
      default: "transform, clip-path",
      [media.reducedMotion]: "none",
    },
    transitionTimingFunction: easings.out,
  },
  label: {
    alignItems: "center",
    display: "flex",
    fontSize: fontSizes.sm,
    fontWeight: 500,
    height: 28,
    justifyContent: "center",
    lineHeight: lineHeights.row,
  },
  segment: {
    borderRadius: radii.full,
    color: {
      default: colors.textMuted,
      [media.hover]: {
        default: colors.textMuted,
        ":hover": colors.textSecondary,
      },
    },
    position: "relative",
    transitionDuration: durations.hover,
    transitionProperty: "color",
    transitionTimingFunction: "ease",
  },
  instant: {
    transitionDuration: "0s",
  },
});

function SegmentedControl() {
  const [selected, setSelected] = useState(0);
  const [animate, setAnimate] = useState(true);
  const segments = useRef<(HTMLButtonElement | null)[]>([]);

  function select(index: number, fromPointer: boolean) {
    setAnimate(fromPointer);
    setSelected(index);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const last = OPTIONS.length - 1;

    const next = {
      ArrowDown: selected === last ? 0 : selected + 1,
      ArrowLeft: selected === 0 ? last : selected - 1,
      ArrowRight: selected === last ? 0 : selected + 1,
      ArrowUp: selected === 0 ? last : selected - 1,
      End: last,
      Home: 0,
    }[event.key];

    if (next !== undefined) {
      event.preventDefault();
      select(next, false);
      segments.current[next]?.focus();
    }
  }

  return (
    <div
      aria-label="Range"
      onKeyDown={onKeyDown}
      role="radiogroup"
      {...stylex.props(styles.group)}
    >
      <span
        aria-hidden="true"
        {...stylex.props(
          styles.indicator,
          styles.offset(selected),
          styles.moving,
          !animate && styles.instant
        )}
      />

      {OPTIONS.map((option, index) => (
        <button
          aria-checked={index === selected}
          key={option}
          // A click with no detail came from Enter or Space.
          onClick={(event) => select(index, event.detail !== 0)}
          ref={(element) => {
            segments.current[index] = element;
          }}
          role="radio"
          tabIndex={index === selected ? 0 : -1}
          type="button"
          {...stylex.props(styles.label, styles.segment)}
        >
          {option}
        </button>
      ))}

      <div
        aria-hidden="true"
        {...stylex.props(
          styles.selectedLayer,
          styles.clip(selected),
          styles.moving,
          !animate && styles.instant
        )}
      >
        {OPTIONS.map((option) => (
          <span key={option} {...stylex.props(styles.label)}>
            {option}
          </span>
        ))}
      </div>
    </div>
  );
}

export { SegmentedControl };
