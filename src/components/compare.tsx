import type { ReactNode } from "react";

import { cn } from "~/lib/utils";

function Compare({ children }: { children?: ReactNode }) {
  return (
    <div
      className="my-md gap-xs bg-bg-3 p-xs grid rounded-md border sm:grid-cols-2"
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
   same job the check mark does in `Install`, not a new meaning for the colour. */
function After({ children }: { children?: ReactNode }) {
  return (
    <Side accent name="after">
      {children}
    </Side>
  );
}

function Side({
  accent,
  children,
  name,
}: {
  accent?: boolean;
  children?: ReactNode;
  name: string;
}) {
  return (
    <div className="bg-bg-1 flex flex-col rounded-xs border">
      <p
        className={cn(
          "not-typeset px-md py-sm border-b",
          accent ? "text-brand" : "text-fg-3"
        )}
      >
        {name}
      </p>

      <div className="p-md *:first:mt-0">{children}</div>
    </div>
  );
}

export { After, Before, Compare };
