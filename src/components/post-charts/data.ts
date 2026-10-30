/** How many of `runs` did the thing, eg routed a goal through a skill. */
interface RateRow {
  hits: number;
  label: string;
  runs: number;
}

interface SizeRow {
  chars: number;
  label: string;
}

type PostChartData =
  | {
      description: string;
      kind: "rate";
      rows: readonly RateRow[];
      title: string;
    }
  | {
      description: string;
      kind: "size";
      limit: { chars: number; label: string };
      rows: readonly SizeRow[];
      title: string;
    };

const postCharts = {
  "orbit-routing": {
    description:
      "Runs of a plain goal that started with /orbit:start. Parent, first verifier: 3 of 3. Head: 0 of 6. Head trimmed to 9,634 characters: 2 of 2. Fix: 11 of 12. Parent, second verifier: 5 of 9.",
    kind: "rate",
    rows: [
      { hits: 3, label: "Parent", runs: 3 },
      { hits: 0, label: "Head", runs: 6 },
      { hits: 2, label: "Head, trimmed", runs: 2 },
      { hits: 11, label: "Fix", runs: 12 },
      { hits: 5, label: "Parent, rerun", runs: 9 },
    ],
    title: "Goals routed through /orbit:start",
  },
  "orbit-hook-output": {
    description:
      "Characters each SessionStart hook printed, against Claude Code's 10 KB limit. Parent: 7,777. Head: 12,609. Head trimmed: 9,634. Fix, first hook: 7,364. Fix, second hook: 5,292.",
    kind: "size",
    // Claude Code reported 12,609 characters as 12.3 KB, so a KB here is 1,024.
    limit: { chars: 10_240, label: "10 KB limit" },
    rows: [
      { chars: 7777, label: "Parent" },
      { chars: 12_609, label: "Head" },
      { chars: 9634, label: "Head, trimmed" },
      { chars: 7364, label: "Fix, hook 1" },
      { chars: 5292, label: "Fix, hook 2" },
    ],
    title: "Hook output against the limit",
  },
} satisfies Record<string, PostChartData>;

function isPostChart(name: string): name is keyof typeof postCharts {
  return Object.hasOwn(postCharts, name);
}

export { isPostChart, postCharts, type PostChartData };
