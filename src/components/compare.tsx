import type { ReactNode } from "react";

import { cn } from "~/lib/utils";

/* Side by side, because the comparison is between wordings and holding one of
   them in your head across a click is the whole difficulty. Stacks below `sm`,
   where two columns would leave about 150px each. */
function Compare({ children }: { children?: ReactNode }) {
  return (
    <div
      className="my-md grid overflow-hidden rounded-md border sm:grid-cols-2"
      data-slot="compare"
    >
      {children}
    </div>
  );
}

function Before({ children }: { children?: ReactNode }) {
  return <Side name="before">{children}</Side>;
}

/* The rewrite steps up to `fg-1` while the passage it replaces stays at body
   colour. typeset paints `p` directly, so the colour has to be taken off the
   tag rather than inherited from here. */
function After({ children }: { children?: ReactNode }) {
  return (
    <Side divider name="after" tone="[&_p]:text-fg-1">
      {children}
    </Side>
  );
}

function Side({
  children,
  divider,
  name,
  tone,
}: {
  children?: ReactNode;
  divider?: boolean;
  name: string;
  tone?: string;
}) {
  return (
    <div
      className={cn(
        "p-md",
        tone,
        // Stacked below `sm`, so the rule turns with the layout.
        divider && "border-t sm:border-s sm:border-t-0"
      )}
    >
      <p className="not-typeset text-fg-3 mb-sm">{name}</p>
      <div className="[&>:first-child]:mt-0">{children}</div>
    </div>
  );
}

export { After, Before, Compare };
