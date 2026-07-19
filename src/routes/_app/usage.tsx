import { createFileRoute } from "@tanstack/react-router";
import { seo } from "~/lib/seo";
import usage from "~/lib/usage.json";
import { formatDate } from "~/lib/utils";

const title = "Claude Usage";
const description = "How many tokens I've burned coding with Claude Code.";

const compact = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 2,
});
const exact = new Intl.NumberFormat("en");

export const Route = createFileRoute("/_app/usage")({
  head: () => seo({ title, description }),
  component: UsagePage,
});

function UsagePage() {
  return (
    <section>
      <div className="flex items-center gap-sm">
        <h1 className="text-eyebrow">{title}</h1>
        <div className="mt-0 ml-auto flex items-center gap-sm text-xs">
          ~ {exact.format(usage.total)} tokens in {usage.year}
        </div>
      </div>

      <div className="mt-lg grid grid-cols-2 gap-lg sm:grid-cols-4">
        <Stat label="Input" value={usage.input} />
        <Stat label="Output" value={usage.output} />
        <Stat label="Cache write" value={usage.cacheWrite} />
        <Stat label="Cache read" value={usage.cacheRead} />
      </div>

      <div className="mt-lg">
        <h2 className="text-eyebrow">Last {usage.days.length} active days</h2>
        <div className="mt-sm flex flex-col gap-sm">
          {usage.days.map((day) => (
            <div className="flex flex-col gap-xs" key={day.date}>
              <div className="flex items-baseline gap-md">
                <span className="text-fg-2">{dayLabel(day.date)}</span>
                <span className="ml-auto text-fg-3 text-xs tabular-nums">
                  {compact.format(day.tokens)}
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-fg-3/10">
                <div
                  className="flex h-full gap-px overflow-hidden rounded-full"
                  style={{ width: `${day.barWidth}%` }}
                >
                  {day.models.map((model, i) => (
                    <div
                      className={i === 0 ? "bg-brand" : "bg-brand/40"}
                      key={model.name}
                      style={{ width: `${model.share}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-x-md text-fg-3 text-xs tabular-nums">
                {day.models.map((model) => (
                  <span key={model.name}>
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
          {exact.format(usage.sessions)} sessions · updated{" "}
          {formatDate(usage.generatedAt)}
        </p>
      </div>
    </section>
  );
}

/** "Jul 19" — the year is already on the heading. */
function dayLabel(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleString("en", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Cache reads are ~96% of every total, so raw counts alone read as four
 * unrelated numbers. The share is what makes them a single breakdown.
 */
function Stat({ label, value }: { label: string; value: number }) {
  const share = (value / usage.total) * 100;

  return (
    <div className="flex flex-col gap-xs">
      <span className="text-eyebrow">{label}</span>
      <span className="text-fg-2 text-md tabular-nums">
        {compact.format(value)}
      </span>
      <span className="text-fg-3 text-xs tabular-nums">
        {share < 1 ? "<1" : Math.round(share)}%
      </span>
    </div>
  );
}
