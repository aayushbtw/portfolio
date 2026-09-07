import { Fragment } from "react";

import type {
  SkillDemo as SkillDemoData,
  SkillExample,
} from "~/lib/skill-demos";
import { cn } from "~/lib/utils";

function SkillDemo({ covers, examples }: SkillDemoData) {
  return (
    <>
      <h2>What it changes</h2>

      <p>
        Covers{" "}
        {covers.map((topic, i) => (
          <Fragment key={topic}>
            {i > 0 && (i === covers.length - 1 ? " and " : ", ")}
            <span className="text-fg-1">{topic}</span>
          </Fragment>
        ))}
        . Each pair is one passage, before the skill ran and after.
      </p>

      {examples.map((example) => (
        <Fragment key={example.label}>
          <h3>{example.label}</h3>
          <ExampleCard {...example} />
        </Fragment>
      ))}
    </>
  );
}

/* One surface, not two: a comparison sitting still has not earned a second.
   The rewrite steps up to `fg-1` and the passage it replaces stays at body
   colour, which is the only channel carrying the difference. */
function ExampleCard({ after, before, label, mono }: SkillExample) {
  return (
    <div
      className="not-typeset bg-bg-3 mt-sm overflow-hidden rounded-md border"
      data-label={label}
      data-slot="skill-example"
    >
      <ExampleRow mono={mono} name="before" tone="text-fg-4">
        {before}
      </ExampleRow>
      <ExampleRow divided mono={mono} name="after" tone="text-fg-1">
        {after}
      </ExampleRow>
    </div>
  );
}

function ExampleRow({
  children,
  divided,
  mono,
  name,
  tone,
}: {
  children: string;
  divided?: boolean;
  mono?: boolean;
  name: string;
  tone: string;
}) {
  return (
    <div
      className={cn(
        "gap-md px-md py-sm grid grid-cols-[52px_minmax(0,1fr)] items-baseline",
        divided && "border-t"
      )}
    >
      <span className="text-fg-3">{name}</span>
      <p className={cn(tone, mono && "font-mono whitespace-pre-line")}>
        {children}
      </p>
    </div>
  );
}

export { SkillDemo };
