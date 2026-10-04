interface MeterSegment {
  label: string;
  /** Percentage of the bar's own filled width, not of the track. */
  share: number;
}

/** `value` is a percent of the track; a group must take it on one scale. */
function Meter({
  segments,
  value,
}: {
  segments: MeterSegment[];
  value: number;
}) {
  return (
    <div aria-hidden="true" data-slot="meter">
      <div style={{ width: `${value}%` }}>
        {segments.map((segment) => (
          <div key={segment.label} style={{ width: `${segment.share}%` }} />
        ))}
      </div>
    </div>
  );
}

export { Meter, type MeterSegment };
