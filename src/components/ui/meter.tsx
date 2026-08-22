import { cn } from "~/lib/utils";

interface MeterSegment {
  className?: string;
  label: string;
  /** Percentage of the bar's own filled width, not of the track. */
  share: number;
}

/**
 * One horizontal bar, filled to `value` percent of the track and split into
 * segments that divide that fill.
 *
 * Every bar in a group must be given its `value` on one shared scale, or the
 * lengths compare things that aren't comparable. The bar carries no text: it
 * is `aria-hidden` because `MeterLegend` states the same numbers in words, and
 * two announcements of one fact is worse than none.
 */
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
      {/* `gap-px` is off the spacing scale on purpose: it is a hairline that
          keeps two adjacent shades from reading as one segment, tuned to the
          bar rather than to a step. Same exemption as an optical nudge. */}
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

/** Direct labels for a `Meter`, which is why the bar itself needs no legend. */
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
        "flex flex-wrap gap-x-md text-fg-3 tabular-nums",
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
