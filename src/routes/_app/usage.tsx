import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/page-header";
import { Meter } from "~/components/ui/meter";
import { Page } from "~/components/ui/page";
import { seo } from "~/lib/seo";
import usage from "~/lib/usage.json";
import {
  cn,
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

/** `<1%` rather than a rounded-down `0%`: input is small, not absent. */
function formatShare(share: number) {
  return share < 1 ? "<1%" : `${Math.round(share)}%`;
}

function UsagePage() {
  return (
    <Page>
      <section>
        <PageHeader title={title} />
        <Lead />
      </section>

      <section>
        <h2>Where the tokens go</h2>
        <BarGroup>
          {usage.tokenTypes.map((part) => (
            <BarRow
              key={part.label}
              label={part.label}
              percent={part.share}
              share={formatShare(part.share)}
              value={formatCompact(part.tokens)}
            />
          ))}
        </BarGroup>
      </section>

      <section>
        <h2>Models</h2>
        <BarGroup>
          {usage.models.map((model) => (
            <BarRow
              key={model.name}
              label={model.name}
              percent={model.share}
              share={formatShare(model.share)}
              value={formatCompact(model.tokens)}
            />
          ))}
        </BarGroup>
      </section>

      <section>
        <h2>Last {usage.days.length} active days</h2>
        {/* Each bar is a share of the busiest day, not of the year. */}
        <BarGroup className="grid-cols-[auto_minmax(0,1fr)_auto]">
          {usage.days.map((day) => (
            <BarRow
              key={day.date}
              label={formatShortDate(day.date)}
              percent={day.barWidth}
              value={formatCompact(day.tokens)}
            />
          ))}
        </BarGroup>
      </section>

      <p className="text-fg-3 text-sm">
        Last updated{" "}
        <time dateTime={usage.generatedAt}>
          {formatDate(usage.generatedAt)}
        </time>
        .
      </p>
    </Page>
  );
}

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
 * One grid for the whole group rather than a flex row each: the label and value
 * columns size to the longest entry in the group and every bar still starts on
 * the same line. A fixed `w-20` was sized for English and "Cache write" already
 * filled it.
 */
function BarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "not-typeset mt-sm grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-x-md gap-y-sm text-fg-3",
        className
      )}
      data-slot="bar-group"
      {...props}
    />
  );
}

/** Every bar is full `brand`: a faded accent reads as disabled, not smaller. */
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
    // `contents` so the cells below join the group's grid and its columns line
    // up across rows.
    <div className="contents">
      <span className="whitespace-nowrap">{label}</span>
      <Meter
        className="min-w-0"
        segments={[{ className: "indicator-brand", label, share: 100 }]}
        value={Math.max(percent, 0.5)}
      />
      <span className="text-end tabular-nums">{value}</span>
      {share ? <span className="text-end tabular-nums">{share}</span> : null}
    </div>
  );
}
