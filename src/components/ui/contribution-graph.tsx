import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { useCallback, useMemo, useRef, useState } from "react";

export interface Activity {
  count: number;
  date: string;
  level: number;
}

const BLOCK = 12;
const GAP = 2;
const CELL = BLOCK + GAP;
const RADIUS = 3;
const LABEL_H = 22;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const FULL_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const LEVELS = [
  "fill-[#ebedf0]",
  "fill-[#9be9a8]",
  "fill-[#40c463]",
  "fill-[#30a14e]",
  "fill-[#216e39]",
];

function parseDate(date: string): Date {
  return new Date(`${date}T00:00:00`);
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
}

function formatDate(date: string): string {
  const d = parseDate(date);
  return `${ordinal(d.getDate())} ${FULL_MONTHS[d.getMonth()]}`;
}

function toGrid(data: Activity[]): (Activity | undefined)[][] {
  if (data.length === 0) {
    return [];
  }

  const sorted = data.toSorted((a, b) => a.date.localeCompare(b.date));
  const firstDay = parseDate(sorted[0].date).getDay();
  const padded: (Activity | undefined)[] = [
    ...new Array<undefined>(firstDay),
    ...sorted,
  ];

  const weeks: (Activity | undefined)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }

  return weeks;
}

function getMonthLabels(
  weeks: (Activity | undefined)[][]
): { label: string; x: number }[] {
  const labels: { label: string; x: number }[] = [];
  let lastKey = "";

  for (let i = 0; i < weeks.length; i++) {
    const first = weeks[i].find(Boolean);
    if (!first) {
      continue;
    }

    const d = parseDate(first.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;

    if (key !== lastKey) {
      labels.push({ label: MONTHS[d.getMonth()], x: CELL * i });
      lastKey = key;
    }
  }

  return labels.filter((l, i, arr) => {
    if (i === 0) {
      return !arr[1] || arr[1].x - l.x >= CELL * 3;
    }
    if (i === arr.length - 1) {
      return CELL * weeks.length - l.x >= CELL * 3;
    }
    return true;
  });
}

function ContributionGraph({
  data,
  total,
  year,
}: {
  data: Activity[];
  total: number;
  year: number;
}) {
  const weeks = useMemo(() => toGrid(data), [data]);
  const months = useMemo(() => getMonthLabels(weeks), [weeks]);
  const width = weeks.length * CELL - GAP;
  const height = LABEL_H + 7 * CELL - GAP;

  const anchorRef = useRef<SVGRectElement | null>(null);
  const [open, setOpen] = useState(false);
  const [tooltipText, setTooltipText] = useState("");

  const onPointerEnter = useCallback(
    (e: React.PointerEvent<SVGRectElement>) => {
      const date = e.currentTarget.dataset.date;
      if (!date) {
        return;
      }
      const count = Number(e.currentTarget.dataset.count);
      anchorRef.current = e.currentTarget;
      setTooltipText(
        `${count > 0 ? count : "No"} contributions on ${formatDate(date)}`
      );
      setOpen(true);
    },
    []
  );

  const onPointerLeave = useCallback(() => {
    setOpen(false);
  }, []);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="flex w-max max-w-full flex-col gap-2 text-sm">
      <div className="no-scrollbar max-w-full overflow-x-auto overflow-y-hidden">
        <svg
          aria-hidden="true"
          className="block overflow-visible"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          width={width}
        >
          <g className="fill-current">
            {months.map(({ label, x }) => (
              <text dominantBaseline="hanging" key={x} x={x}>
                {label}
              </text>
            ))}
          </g>
          {weeks.map((week, wi) =>
            week.map((activity, di) => {
              if (!activity) {
                return null;
              }

              return (
                <rect
                  className={LEVELS[activity.level]}
                  data-count={activity.count}
                  data-date={activity.date}
                  height={BLOCK}
                  key={activity.date}
                  onPointerEnter={onPointerEnter}
                  onPointerLeave={onPointerLeave}
                  rx={RADIUS}
                  ry={RADIUS}
                  width={BLOCK}
                  x={CELL * wi}
                  y={LABEL_H + CELL * di}
                />
              );
            })
          )}
        </svg>
        <TooltipPrimitive.Root open={open}>
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Positioner
              anchor={anchorRef}
              className="isolate z-50"
              side="top"
              sideOffset={4}
            >
              <TooltipPrimitive.Popup className="rounded-lg bg-bg-2 px-2 py-0.5 font-medium text-fg-3 text-xs outline">
                {tooltipText}
              </TooltipPrimitive.Popup>
            </TooltipPrimitive.Positioner>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      </div>
      <p className="my-0!">
        {total.toLocaleString("en")} contributions in {year}
      </p>
    </div>
  );
}

export { ContributionGraph };
