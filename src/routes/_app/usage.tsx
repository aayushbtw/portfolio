import * as stylex from "@stylexjs/stylex";
import { createFileRoute } from "@tanstack/react-router";

import { ClaudeIcon } from "~/components/icons";
import { Page, PageHeader, Section } from "~/components/ui/page";
import { UsageChart } from "~/components/usage-chart";
import { seo } from "~/lib/seo";
import usage from "~/lib/usage.json";
import {
  formatCompact,
  formatDate,
  formatNumber,
  formatShortDate,
} from "~/lib/utils";
import {
  colors,
  durations,
  easings,
  fontSizes,
  lineHeights,
  media,
  space,
} from "~/styles/tokens.stylex";

const title = "Claude Usage";

const description = "How many tokens I’ve burned coding with Claude Code.";

export const Route = createFileRoute("/_app/usage")({
  head: () => seo({ title, description }),
  component: UsagePage,
});

const roll = stylex.keyframes({
  from: { transform: "translateY(0)" },
});

const fill = stylex.keyframes({
  from: { strokeDasharray: "0 100" },
});

const DIGIT_STAGGER_MS = 60;

const RING_STAGGER_MS = 80;

const styles = stylex.create({
  mark: {
    flexShrink: 0,
    fontSize: 16,
  },
  list: {
    color: colors.textMuted,
    lineHeight: lineHeights.row,
    margin: 0,
  },
  row: {
    alignItems: "center",
    display: "flex",
    gap: space.xs,
    paddingBlock: space.xs,
  },
  label: {
    alignItems: "center",
    color: colors.textPrimary,
    display: "flex",
    gap: space.xs,
    minWidth: 0,
  },
  leader: {
    backgroundColor: colors.fill,
    flexGrow: 1,
    height: 1,
    minWidth: space.md,
  },
  meta: {
    display: "flex",
    flexShrink: 0,
    fontSize: fontSizes.sm,
    fontVariantNumeric: "tabular-nums",
    gap: space.xl,
    margin: 0,
  },
  share: {
    alignItems: "center",
    display: "flex",
    flexShrink: 0,
    gap: space.xs,
    justifyContent: "flex-end",
  },
  shareValue: {
    textAlign: "end",
    width: "3.5em",
  },
  breakout: {
    marginInline: { default: null, [media.lg]: -128 },
  },
  ring: {
    color: colors.accent,
    flexShrink: 0,
  },
  tokens: {
    color: colors.textPrimary,
    flexShrink: 0,
    textAlign: "end",
    width: "4em",
  },
  updated: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.row,
  },
  head: {
    borderBottomColor: colors.fill,
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    color: colors.textMuted,
    fontSize: fontSizes.sm,
  },
  headLabel: {
    color: colors.textMuted,
  },
  divided: {
    borderBottomColor: colors.fillSubtle,
    borderBottomStyle: "solid",
    borderBottomWidth: { default: 1, ":last-child": 0 },
  },
  spacer: {
    flexGrow: 1,
  },
  srOnly: {
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1,
  },
  digit: {
    display: "inline-block",
    height: lineHeights.row,
    overflow: "hidden",
    verticalAlign: "top",
  },
  reel: {
    animationDuration: "900ms",
    animationFillMode: "both",
    animationName: roll,
    animationTimingFunction: easings.out,
    display: "flex",
    flexDirection: "column",
  },
  // Twenty faces, so even a 0 spins a full turn before landing.
  landOn: (digit: number, delay: number) => ({
    animationDelay: `${delay}ms`,
    transform: `translateY(${-(10 + digit) * 5}%)`,
  }),
  fill: {
    animationDuration: durations.enter,
    animationFillMode: "both",
    animationName: fill,
    animationTimingFunction: easings.out,
  },
  after: (delay: number) => ({
    animationDelay: `${delay}ms`,
  }),
});

/** `<0.1%` rather than a rounded-down `0%`: tiny, not absent. */
function formatShare(share: number) {
  return share < 0.1 ? "<0.1%" : `${share.toFixed(1)}%`;
}

function UsagePage() {
  return (
    <Page>
      <PageHeader
        description={
          <>Tokens I’ve burned coding with Claude Code in {usage.year}.</>
        }
        title={
          <>
            <ClaudeIcon {...stylex.props(styles.mark)} />
            {title}
          </>
        }
      />

      <Section title="Overview">
        <dl {...stylex.props(styles.list)}>
          <Stat
            label="Tokens"
            value={<Odometer value={formatCompact(usage.total)} />}
          />
          <Stat
            label="Sessions"
            value={<Odometer value={formatNumber(usage.sessions)} />}
          />
          <Stat
            label="Active days"
            value={<Odometer value={formatNumber(usage.activeDays)} />}
          />
          <Stat
            label="Busiest day"
            value={
              <>
                <Odometer value={formatCompact(usage.peak.tokens)} /> on{" "}
                {formatShortDate(usage.peak.date)}
              </>
            }
          />
        </dl>
      </Section>

      <Section title="Daily tokens">
        <div {...stylex.props(styles.breakout)}>
          <UsageChart />
        </div>
      </Section>

      <ShareTable
        heading="Model"
        rows={usage.models.map((model) => ({ ...model, label: model.name }))}
      />

      <ShareTable heading="Token type" rows={usage.tokenTypes} />

      <p {...stylex.props(styles.updated)}>
        Updated{" "}
        <time dateTime={usage.generatedAt}>
          {formatDate(usage.generatedAt)}
        </time>
      </p>
    </Page>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div {...stylex.props(styles.row)}>
      <dt {...stylex.props(styles.label)}>{label}</dt>
      <span aria-hidden="true" {...stylex.props(styles.leader)} />
      <dd {...stylex.props(styles.meta)}>
        <span>{value}</span>
      </dd>
    </div>
  );
}

const faces = Array.from({ length: 20 }, (_, i) => i % 10);

/** Digits spin into place; separators and suffixes stay put. */
function Odometer({ value }: { value: string }) {
  let digitIndex = 0;

  return (
    <span>
      <span {...stylex.props(styles.srOnly)}>{value}</span>
      <span aria-hidden="true">
        {Array.from(value, (char, i) => {
          if (!/\d/.test(char)) {
            return <span key={i}>{char}</span>;
          }

          const delay = digitIndex++ * DIGIT_STAGGER_MS;

          return (
            <span key={i} {...stylex.props(styles.digit)}>
              <span
                {...stylex.props(
                  styles.reel,
                  styles.landOn(Number(char), delay)
                )}
              >
                {faces.map((face, j) => (
                  <span key={j}>{face}</span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}

function ShareTable({
  heading,
  rows,
}: {
  heading: string;
  rows: { label: string; share: number; tokens: number }[];
}) {
  return (
    <section>
      <div {...stylex.props(styles.row, styles.head)}>
        <h2 {...stylex.props(styles.label, styles.headLabel)}>{heading}</h2>
        <span aria-hidden="true" {...stylex.props(styles.spacer)} />
        <span {...stylex.props(styles.meta)}>
          <span {...stylex.props(styles.share)}>Share</span>
          <span {...stylex.props(styles.tokens, styles.headLabel)}>Tokens</span>
        </span>
      </div>
      <ul {...stylex.props(styles.list)}>
        {rows.map((row, i) => (
          <li key={row.label} {...stylex.props(styles.row, styles.divided)}>
            <span {...stylex.props(styles.label)}>{row.label}</span>
            <span aria-hidden="true" {...stylex.props(styles.spacer)} />
            <span {...stylex.props(styles.meta)}>
              <span {...stylex.props(styles.share)}>
                <Ring index={i} share={row.share} />
                <span {...stylex.props(styles.shareValue)}>
                  {formatShare(row.share)}
                </span>
              </span>
              <span {...stylex.props(styles.tokens)}>
                {formatCompact(row.tokens)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Non-zero shares keep a visible sliver; under 1% would otherwise vanish. */
function Ring({ index, share }: { index: number; share: number }) {
  const arc = share > 0 ? Math.max(share, 3) : 0;

  return (
    <svg
      aria-hidden="true"
      height={14}
      viewBox="0 0 16 16"
      width={14}
      {...stylex.props(styles.ring)}
    >
      <circle
        cx={8}
        cy={8}
        fill="none"
        r={6}
        stroke="currentColor"
        strokeOpacity={0.16}
        strokeWidth={2.5}
      />
      <circle
        cx={8}
        cy={8}
        fill="none"
        pathLength={100}
        r={6}
        stroke="currentColor"
        strokeDasharray={`${arc} 100`}
        strokeLinecap="round"
        strokeWidth={2.5}
        transform="rotate(-90 8 8)"
        {...stylex.props(styles.fill, styles.after(index * RING_STAGGER_MS))}
      />
    </svg>
  );
}
