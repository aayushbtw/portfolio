import { createFileRoute } from "@tanstack/react-router";
import { Meter, MeterLegend, type MeterSegment } from "~/components/ui/meter";
import { PageHeader } from "~/components/ui/page-header";
import { Stat, StatStrip } from "~/components/ui/stat";
import { seo } from "~/lib/seo";
import usage from "~/lib/usage.json";
import {
  formatCompact,
  formatDate,
  formatNumber,
  formatShortDate,
} from "~/lib/utils";

const title = "Claude Usage";
const description = "How many tokens I've burned coding with Claude Code.";

export const Route = createFileRoute("/_app/usage")({
  head: () => seo({ title, description }),
  component: UsagePage,
});

function UsagePage() {
  return (
    <section>
      <PageHeader title={title}>
        <span className="text-xs">
          ~ {formatNumber(usage.total)} tokens in {usage.year}
        </span>
      </PageHeader>

      <StatStrip className="mt-lg">
        <TokenStat label="Input" value={usage.input} />
        <TokenStat label="Output" value={usage.output} />
        <TokenStat label="Cache write" value={usage.cacheWrite} />
        <TokenStat label="Cache read" value={usage.cacheRead} />
      </StatStrip>

      <div className="mt-xl">
        <h2 className="text-section-label">
          Last {usage.days.length} active days
        </h2>
        <div className="mt-sm flex flex-col gap-sm">
          {usage.days.map((day) => {
            const segments = daySegments(day.models);

            return (
              <div className="flex flex-col gap-xs" key={day.date}>
                <div className="flex items-baseline gap-md">
                  <span className="text-fg-2">{formatShortDate(day.date)}</span>
                  <span className="ml-auto text-fg-3 text-xs tabular-nums">
                    {formatCompact(day.tokens)}
                  </span>
                </div>

                <Meter segments={segments} value={day.barWidth} />
                <MeterLegend segments={segments} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-lg flex justify-end">
        <p className="text-fg-3 text-xs tabular-nums">
          {formatNumber(usage.sessions)} sessions · updated{" "}
          {formatDate(usage.generatedAt)}
        </p>
      </div>
    </section>
  );
}

const MODEL_SHADES = [
  "indicator-brand opacity-80",
  "indicator-brand opacity-60",
  "indicator-brand opacity-35",
  "indicator-brand opacity-20",
];

// Shade by how much each model is used across the year, so a model keeps the
// same shade on every day's bar and the legends stay readable together.
function daySegments(
  models: { name: string; share: number }[]
): MeterSegment[] {
  return models.map((model) => {
    const rank = usage.models.findIndex((m) => m.name === model.name);

    return {
      className: MODEL_SHADES[rank] ?? MODEL_SHADES.at(-1),
      label: model.name,
      share: model.share,
    };
  });
}

// Share of the year's total is meaningful only to this page, so the arithmetic
// stays here and `Stat` stays a presentational primitive.
function TokenStat({ label, value }: { label: string; value: number }) {
  const share = (value / usage.total) * 100;

  return (
    <Stat
      detail={`${share < 1 ? "<1" : Math.round(share)}%`}
      label={label}
      value={formatCompact(value)}
    />
  );
}
