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
      <h1 className="text-eyebrow">{title}</h1>
      <p className="mt-2">{description}</p>

      <div className="not-typeset mt-8">
        <p className="text-5xl text-fg-2 tabular-nums tracking-tight">
          {compact.format(usage.total)}
        </p>
        <p className="mt-1 text-sm tabular-nums">
          {exact.format(usage.total)} tokens in {usage.year}
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
        <Stat label="Input" value={usage.input} />
        <Stat label="Output" value={usage.output} />
        <Stat label="Cache read" value={usage.cacheRead} />
        <Stat label="Cache write" value={usage.cacheWrite} />
      </div>

      <div className="mt-10">
        <h2 className="text-eyebrow">By month</h2>
        <div className="mt-3 flex flex-col gap-3">
          {usage.months.map((month) => (
            <div className="flex items-center gap-3" key={month.label}>
              <span className="w-16 shrink-0 text-fg-3 text-sm tabular-nums">
                {month.label}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-fg-3/10">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${month.percent}%` }}
                />
              </div>
              <span className="w-14 shrink-0 text-right text-fg-2 text-sm tabular-nums">
                {compact.format(month.tokens)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-eyebrow">By model</h2>
        <div className="mt-3 flex flex-col gap-2">
          {usage.models.map((model) => (
            <div
              className="flex items-baseline justify-between"
              key={model.name}
            >
              <span className="text-fg-2">{model.name}</span>
              <span className="text-fg-3 tabular-nums">
                {compact.format(model.tokens)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-10 text-fg-3/60 text-xs tabular-nums">
        {exact.format(usage.sessions)} sessions · updated{" "}
        {formatDate(usage.generatedAt)}
      </p>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-eyebrow">{label}</span>
      <span className="text-fg-2 text-lg tabular-nums">
        {compact.format(value)}
      </span>
    </div>
  );
}
