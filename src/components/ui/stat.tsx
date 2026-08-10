import { cn } from "~/lib/utils";

/**
 * A row of peer figures. Every `Stat` inside shares one treatment, because the
 * whole point of a strip is that its members are comparable: the moment one
 * gets a bigger value or a longer label it must not get bigger type.
 *
 * The column counts are tuned for four peers. Pass `className` for another
 * shape rather than adding a prop.
 */
function StatStrip({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "not-typeset grid grid-cols-2 gap-lg sm:grid-cols-4",
        className
      )}
      data-slot="stat-strip"
      {...props}
    />
  );
}

/**
 * Label, value, and an optional subordinate detail. The value sits at `md`
 * rather than a display size on purpose: several of these on one page are
 * secondary to whatever single figure the page is actually about.
 */
function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: React.ReactNode;
  detail?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-xs" data-slot="stat">
      <span className="text-label">{label}</span>
      <span className="text-fg-2 text-lg tabular-nums">{value}</span>
      {detail ? (
        <span className="text-fg-3 text-xs tabular-nums">{detail}</span>
      ) : null}
    </div>
  );
}

export { Stat, StatStrip };
