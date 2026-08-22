import { cn } from "~/lib/utils";

/**
 * A row of peer figures, all sharing one treatment: a longer value or label
 * must not buy a `Stat` bigger type. Pass `className` for a shape the default
 * column counts don't cover, rather than adding a prop.
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
 * The value sits at `md` rather than a display size: several of these on one
 * page are secondary to whatever single figure the page is about.
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
      <span className="text-fg-3">{label}</span>
      <span className="text-fg-2 tabular-nums">{value}</span>
      {detail ? <span className="text-fg-3 tabular-nums">{detail}</span> : null}
    </div>
  );
}

export { Stat, StatStrip };
