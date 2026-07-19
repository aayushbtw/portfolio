import { createFileRoute } from "@tanstack/react-router";
import { seo } from "~/lib/seo";
import usage from "~/lib/usage.json";
import { formatDate } from "~/lib/utils";

const title = "Usage";
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
        <Stat label="Cache read" value={usage.cacheRead} />
        <Stat label="Cache write" value={usage.cacheWrite} />
      </div>

      <div className="mt-lg">
        <h2 className="text-eyebrow">By month</h2>
        <div className="mt-sm flex flex-col gap-xs">
          {usage.months.map((month) => (
            <div className="flex items-center gap-md" key={month.label}>
              <span className="w-16 shrink-0 text-fg-2">{month.label}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-fg-3/10">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${month.percent}%` }}
                />
              </div>
              <span className="w-14 shrink-0 text-right text-fg-3 text-xs tabular-nums">
                {compact.format(month.tokens)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-lg">
        <h2 className="text-eyebrow">By model</h2>
        <div className="mt-sm flex flex-col gap-xs">
          {usage.models.map((model) => (
            <div
              className="flex items-baseline justify-between"
              key={model.name}
            >
              <span className="text-fg-2">{model.name}</span>
              <span className="text-fg-3 text-xs tabular-nums">
                {compact.format(model.tokens)}
              </span>
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

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-xs">
      <span className="text-eyebrow">{label}</span>
      <span className="text-fg-2 text-md tabular-nums">
        {compact.format(value)}
      </span>
    </div>
  );
}
