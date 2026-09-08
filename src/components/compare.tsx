import type { ReactNode } from "react";

import { cn } from "~/lib/utils";

/* Side by side, because the comparison is between wordings and holding one of
   them in your head across a click is the whole difficulty. Stacks below `sm`,
   where two columns would leave about 150px each. */
function Compare({ children }: { children?: ReactNode }) {
  return (
    <div
      className="my-md bg-bg-1 grid overflow-hidden rounded-md border sm:grid-cols-2"
      data-slot="compare"
    >
      {children}
    </div>
  );
}

function Before({ children }: { children?: ReactNode }) {
  return <Side name="before">{children}</Side>;
}

/* The rewrite is the one that won, so its label takes `brand`. That is the
   same job the check mark does in `Install`, not a new meaning for the colour.
   typeset paints `p` directly, so the body colour has to come off the tag. */
function After({ children }: { children?: ReactNode }) {
  return (
    <Side accent divider name="after" tone="[&_p]:text-fg-1">
      {children}
    </Side>
  );
}

function Side({
  accent,
  children,
  divider,
  name,
  tone,
}: {
  accent?: boolean;
  children?: ReactNode;
  divider?: boolean;
  name: string;
  tone?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col",
        // Stacked below `sm`, so the rule turns with the layout.
        divider && "border-t sm:border-s sm:border-t-0"
      )}
    >
      {/* A label bar rather than a line of text at the top of the passage:
          without it the label reads as the passage's first sentence. */}
      <p
        className={cn(
          "not-typeset px-md py-sm bg-bg-3 border-b",
          accent ? "text-brand" : "text-fg-3"
        )}
      >
        {name}
      </p>

      <div className={cn("p-md [&>:first-child]:mt-0", tone)}>{children}</div>
    </div>
  );
}

export { After, Before, Compare };
