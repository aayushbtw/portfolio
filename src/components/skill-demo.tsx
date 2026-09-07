import { Fragment, useState } from "react";
import { TextMorph } from "torph/react";

import { useHaptics } from "~/lib/haptics";
import type {
  SkillDemo as SkillDemoData,
  SkillExample,
} from "~/lib/skill-demos";
import { cn } from "~/lib/utils";

// Matches the icon cross-fade in `Install`, which is the site's other swap.
const MORPH_MS = 300;
const MORPH_EASE = "cubic-bezier(0.2, 0, 0, 1)";

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
    "col-start-1 row-start-1",
    mono && "font-mono whitespace-pre-line"
  );

  return (
    <div
      className="not-typeset bg-bg-1 mt-sm overflow-hidden rounded-md border"
      data-label={label}
      data-slot="skill-example"
    >
      <div className="p-md grid">
        {/* The passage that is not showing still takes up its space, so the
            card keeps the height of the longer one and the swap never moves
            the page. */}
        <p aria-hidden="true" className={cn(passage, "invisible")}>
          {showAfter ? before : after}
        </p>

        <TextMorph
          as="p"
          className={cn(
            passage,
            "transition-colors duration-300 ease-out",
            showAfter ? "text-fg-1" : "text-fg-4"
          )}
          duration={MORPH_MS}
          ease={MORPH_EASE}
          respectReducedMotion
        >
          {showAfter ? after : before}
        </TextMorph>
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

/* Both segments carry the border so only its colour changes, otherwise the
   inactive one is a pixel shorter and the pair jitters on every press. */
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
        "px-sm py-xs rounded-sm border transition-colors duration-150 ease-out active:scale-[0.96]",
        active
          ? "bg-bg-1 text-fg-1"
          : "text-fg-3 hover:text-fg-1 border-transparent"
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export { SkillDemo };
