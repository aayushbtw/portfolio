import { cn } from "~/lib/utils";

interface MeterSegment {
  className?: string;
  label: string;
  /** Percentage of the bar's own filled width, not of the track. */
  share: number;
}

/** `value` is a percent of the track; a group must take it on one scale. */
function Meter({
  className,
  segments,
  value,
}: {
  className?: string;
  segments: MeterSegment[];
  value: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("h-1.5 overflow-hidden rounded-full bg-bg-2", className)}
      data-slot="meter"
    >
      {/* Off the spacing scale: a hairline, so two shades stay two. */}
      <div
        className="flex h-full gap-px overflow-hidden rounded-full"
        style={{ width: `${value}%` }}
      >
        {segments.map((segment) => (
          <div
            className={segment.className}
            key={segment.label}
            style={{ width: `${segment.share}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function MeterLegend({
  className,
  segments,
}: {
  className?: string;
  segments: MeterSegment[];
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-x-md text-fg-3 text-sm tabular-nums",
        className
      )}
      data-slot="meter-legend"
    >
      {segments.map((segment) => (
        <span className="flex items-center gap-xs" key={segment.label}>
          <span
            aria-hidden="true"
            className={cn("h-2 w-0.5 shrink-0 rounded-full", segment.className)}
          />
          {segment.label} {segment.share}%
        </span>
      ))}
    </div>
  );
}

export { Meter, MeterLegend, type MeterSegment };
