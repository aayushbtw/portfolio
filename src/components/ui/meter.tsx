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
      className={cn("bg-bg-2 h-1.5 overflow-hidden rounded-full", className)}
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

export { Meter, type MeterSegment };
