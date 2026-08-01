import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/ui/page-header";
import { Stat, StatStrip } from "~/components/ui/stat";
import { seo } from "~/lib/seo";
import usage from "~/lib/usage.json";
import { cn, formatCompact, formatDate, formatNumber } from "~/lib/utils";

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

      <div className="mt-lg">
        <h2 className="text-eyebrow">Last {usage.days.length} active days</h2>
        <div className="mt-sm flex flex-col gap-sm">
          {usage.days.map((day) => (
            <div className="flex flex-col gap-xs" key={day.date}>
              <div className="flex items-baseline gap-md">
                <span className="text-fg-2">{dayLabel(day.date)}</span>
                <span className="ml-auto text-fg-3 text-xs tabular-nums">
                  {formatCompact(day.tokens)}
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-fg-3/10">
                <div
                  className="flex h-full gap-px overflow-hidden rounded-full"
                  style={{ width: `${day.barWidth}%` }}
                >
                  {day.models.map((model) => (
                    <div
                      className={modelShade(model.name)}
                      key={model.name}
                      style={{ width: `${model.share}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-x-md text-fg-3 text-xs tabular-nums">
                {day.models.map((model) => (
                  <span className="flex items-center gap-xs" key={model.name}>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-2 w-0.5 shrink-0 rounded-full",
                        modelShade(model.name)
                      )}
                    />
                    {model.name} {model.share}%
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-lg flex justify-end">
        <p className="text-fg-3/60 text-xs tabular-nums">
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

function modelShade(name: string) {
  const rank = usage.models.findIndex((model) => model.name === name);

  return MODEL_SHADES[rank] ?? MODEL_SHADES.at(-1);
}

function dayLabel(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleString("en", {
    month: "short",
    day: "numeric",
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
