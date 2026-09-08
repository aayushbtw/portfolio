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
        . Each card is one passage, written twice.
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

/* Side by side, because the comparison is between wordings and holding one of
   them in your head across a click is the whole difficulty. Lines are the
   exception: a commit subject in a 306px column wraps, and a wrapped log stops
   looking like a log, so those stack at full width instead. */
function ExampleCard({ after, before, label, mono }: SkillExample) {
  return (
    <div
      className={cn(
        "not-typeset bg-bg-1 mt-sm grid overflow-hidden rounded-md border",
        !mono && "sm:grid-cols-2"
      )}
      data-label={label}
      data-slot="skill-example"
    >
      <ExampleColumn mono={mono} name="before" tone="text-fg-4">
        {before}
      </ExampleColumn>
      <ExampleColumn divider mono={mono} name="after" tone="text-fg-1">
        {after}
      </ExampleColumn>
    </div>
  );
}

function ExampleColumn({
  children,
  divider,
  mono,
  name,
  tone,
}: {
  children: string;
  divider?: boolean;
  mono?: boolean;
  name: string;
  tone: string;
}) {
  return (
    <div
      className={cn(
        "p-md",
        // Stacked below `sm`, so the rule turns with the layout.
        divider && (mono ? "border-t" : "border-t sm:border-s sm:border-t-0")
      )}
    >
      <p className="text-fg-3 mb-sm">{name}</p>
      <p
        className={cn(tone, mono && "overflow-x-auto font-mono whitespace-pre")}
      >
        {children}
      </p>
    </div>
  );
}

export { SkillDemo };
