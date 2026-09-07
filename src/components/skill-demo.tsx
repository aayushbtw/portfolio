import { Fragment, useState } from "react";

import { useHaptics } from "~/lib/haptics";
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
        . Each card holds one passage. Switch it to see what the skill did.
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

function ExampleCard({ after, before, label, mono }: SkillExample) {
  const [showAfter, setShowAfter] = useState(true);
  const { trigger } = useHaptics();

  function select(next: boolean) {
    return () => {
      trigger("tick");
      setShowAfter(next);
    };
  }

  const passage = cn(
    "col-start-1 row-start-1 transition-opacity duration-150 ease-out",
    mono && "font-mono whitespace-pre-line"
  );

  return (
    <div
      className="not-typeset bg-bg-1 mt-sm overflow-hidden rounded-md border"
      data-label={label}
      data-slot="skill-example"
    >
      {/* Both stay mounted in one grid cell, so the card keeps the height of
          the longer passage and swapping never moves the page. */}
      <div className="p-md grid">
        <p
          aria-hidden={showAfter}
          className={cn(passage, "text-fg-4", showAfter && "opacity-0")}
        >
          {before}
        </p>
        <p
          aria-hidden={!showAfter}
          className={cn(passage, "text-fg-1", !showAfter && "opacity-0")}
        >
          {after}
        </p>
      </div>

      <div className="gap-xs px-md py-sm bg-bg-3 flex items-center border-t">
        <Segment active={!showAfter} onClick={select(false)}>
          before
        </Segment>
        <Segment active={showAfter} onClick={select(true)}>
          after
        </Segment>
      </div>
    </div>
  );
}

function Segment({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        "px-sm rounded-sm py-0.5 transition-colors duration-150 ease-out active:scale-[0.96]",
        active ? "bg-bg-1 text-fg-1 border" : "text-fg-3 hover:text-fg-1"
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export { SkillDemo };
