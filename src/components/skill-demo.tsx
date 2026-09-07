import type { SkillDemo as SkillDemoData } from "~/lib/skill-demos";
import { cn } from "~/lib/utils";

function SkillDemo({ after, before, heading, mono, note }: SkillDemoData) {
  return (
    <>
      <h2>{heading}</h2>

      <div
        className="not-typeset gap-xs bg-bg-3 p-xs mt-sm flex flex-col rounded-md border"
        data-slot="skill-demo"
      >
        <DemoPanel label="before" mono={mono} tone="text-fg-4">
          {before}
        </DemoPanel>
        <DemoPanel label="after" mono={mono} tone="text-fg-1">
          {after}
        </DemoPanel>
      </div>

      <p className="text-fg-3 mt-sm">{note}</p>
    </>
  );
}

/* The pair separates by colour, like everything else here: the weak version
   sits at body colour and the rewrite steps up to `fg-1`. */
function DemoPanel({
  children,
  label,
  mono,
  tone,
}: {
  children: string;
  label: string;
  mono?: boolean;
  tone: string;
}) {
  return (
    <div className="bg-bg-1 p-md rounded-xs border">
      <p className="text-fg-3 mb-sm">{label}</p>
      <p className={cn(tone, mono && "font-mono whitespace-pre-line")}>
        {children}
      </p>
    </div>
  );
}

export { SkillDemo };
