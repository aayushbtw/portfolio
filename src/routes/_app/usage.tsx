import { createFileRoute } from "@tanstack/react-router";
import { Meter } from "~/components/ui/meter";
import { PageHeader } from "~/components/ui/page-header";
import { seo } from "~/lib/seo";
import usage from "~/lib/usage.json";
import {
  formatCompact,
  formatDate,
  formatNumber,
  formatShortDate,
} from "~/lib/utils";

const title = "Claude Usage";
const description = "How many tokens I’ve burned coding with Claude Code.";

export const Route = createFileRoute("/_app/usage")({
  head: () => seo({ title, description }),
  component: UsagePage,
});

/**
 * Every share arrives from `scripts/token-usage.ts` already computed, to four
 * decimals. This page only decides how to print it, and `<1%` rather than a
 * rounded-down `0%`: input is 0.0049% of the total, which is small, not absent.
 */
function formatShare(share: number) {
  return share < 1 ? "<1%" : `${Math.round(share)}%`;
}

function UsagePage() {
  return (
    <section>
      <PageHeader title={title} />

      <Lead />

      <section className="mt-xl">
        <h2>Where the tokens go</h2>
        <div className="mt-sm flex flex-col gap-sm">
          {usage.tokenTypes.map((part) => (
            <BarRow
              key={part.label}
              label={part.label}
              percent={part.share}
              share={formatShare(part.share)}
              value={formatCompact(part.tokens)}
            />
          ))}
        </div>
      </section>

      <section className="mt-xl">
        <h2>Models</h2>
        <div className="mt-sm flex flex-col gap-sm">
          {usage.models.map((model) => (
            <BarRow
              key={model.name}
              label={model.name}
              percent={model.share}
              share={formatShare(model.share)}
              value={formatCompact(model.tokens)}
            />
          ))}
        </div>
      </section>

      <section className="mt-xl">
        <h2>Last {usage.days.length} active days</h2>
        {/* Each day's bar is a share of the busiest day, so the row lengths
            compare to each other rather than to the year. */}
        <div className="mt-sm flex flex-col gap-sm">
          {usage.days.map((day) => (
            <BarRow
              key={day.date}
              label={formatShortDate(day.date)}
              percent={day.barWidth}
              value={formatCompact(day.tokens)}
            />
          ))}
        </div>
      </section>

      <p className="mt-xl text-compact text-fg-3">
        Last updated{" "}
        <time dateTime={usage.generatedAt}>
          {formatDate(usage.generatedAt)}
        </time>
        .
      </p>
    </section>
  );
}

/**
 * One sentence, no jargon: this page is for anyone who lands on it, not for
 * someone who already knows how prompt caching is billed, so the cache split
 * and the model split stay in the sections that are about them.
 *
 * It anchors the headline number rather than only stating it. 3.28B means
 * nothing on its own; a shelf of novels is something a reader can picture.
 */
function Lead() {
  return (
    <p className="mt-lg">
      <Figure>{usage.sessions}</Figure> sessions with Claude Code in{" "}
      {usage.year}, and <Figure>{formatCompact(usage.total)}</Figure> tokens
      through it. That is roughly <Figure>{formatCompact(usage.words)}</Figure>{" "}
      words, or about <Figure>{formatNumber(usage.novels)}</Figure> novels’
      worth.
    </p>
  );
}

/** A number inside a sentence: one colour step up, and never wobbling. */
function Figure({ children }: { children: React.ReactNode }) {
  return <span className="text-fg-1 tabular-nums">{children}</span>;
}

/**
 * Label, bar, value on one line. The bar is the only thing that stretches.
 *
 * Every bar is full `brand`. An earlier pass shaded them down the scale to tell
 * them apart, but a faded accent reads as disabled rather than as smaller, and
 * the label already says which row is which.
 */
function BarRow({
  label,
  percent,
  share,
  value,
}: {
  label: string;
  percent: number;
  share?: string;
  value: string;
}) {
  return (
    <div className="not-typeset flex items-center gap-md text-fg-3">
      <span className="w-20 shrink-0 whitespace-nowrap">{label}</span>
      <Meter
        className="min-w-0 flex-1"
        segments={[{ className: "indicator-brand", label, share: 100 }]}
        value={Math.max(percent, 0.5)}
      />
      <span className="w-20 shrink-0 text-right tabular-nums">{value}</span>
      {share ? (
        <span className="w-10 shrink-0 text-right tabular-nums">{share}</span>
      ) : null}
    </div>
  );
}
