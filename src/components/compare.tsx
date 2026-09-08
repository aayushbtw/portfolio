import type { ReactNode } from "react";

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
  return <Side name="Before">{children}</Side>;
}

function After({ children }: { children?: ReactNode }) {
  return <Side name="After">{children}</Side>;
}

function Side({ children, name }: { children?: ReactNode; name: string }) {
  return (
    <div className="bg-bg-1 flex flex-col rounded-xs border">
      <p className="not-typeset px-md py-sm text-fg-2 border-b">{name}</p>
      <div className="p-md *:first:mt-0">{children}</div>
    </div>
  );
}

export { After, Before, Compare };
