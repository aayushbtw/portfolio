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
        . Each pair below is the same thing written twice.
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

/* The rewrite sits on page colour and steps up to `fg-1`; the version it
   replaces stays recessed on `bg-3` at body colour. */
function ExampleCard({ after, before, label, mono }: SkillExample) {
  const text = mono ? "font-mono whitespace-pre-line" : "";
  const row = "gap-md p-md grid grid-cols-[52px_minmax(0,1fr)]";

  return (
    <div
      className="not-typeset mt-sm overflow-hidden rounded-md border"
      data-slot="skill-example"
      data-label={label}
    >
      <div className={cn(row, "bg-bg-3")}>
        <span className="text-fg-3">before</span>
        <p className={cn("text-fg-4", text)}>{before}</p>
      </div>
      <div className={cn(row, "bg-bg-1 border-t")}>
        <span className="text-fg-3">after</span>
        <p className={cn("text-fg-1", text)}>{after}</p>
      </div>
    </div>
  );
}

export { SkillDemo };
