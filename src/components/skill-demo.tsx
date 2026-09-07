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

      <div
        className="not-typeset gap-xs bg-bg-3 p-xs mt-sm flex flex-col rounded-md border"
        data-slot="skill-demo"
      >
        {examples.map((example) => (
          <ExampleRow key={example.label} {...example} />
        ))}
      </div>
    </>
  );
}

/* Each side separates by colour, like everything else here: the weak version
   sits at body colour and the rewrite steps up to `fg-1`. */
function ExampleRow({ after, before, label, mono }: SkillExample) {
  const text = mono ? "font-mono whitespace-pre-line" : "";

  return (
    <div className="bg-bg-1 p-md rounded-xs border">
      <p className="text-fg-1 mb-sm">{label}</p>

      <div className="gap-x-md gap-y-xs grid grid-cols-[52px_minmax(0,1fr)]">
        <span className="text-fg-3">before</span>
        <p className={cn("text-fg-4", text)}>{before}</p>
        <span className="text-fg-3">after</span>
        <p className={cn("text-fg-1", text)}>{after}</p>
      </div>
    </div>
  );
}

export { SkillDemo };
