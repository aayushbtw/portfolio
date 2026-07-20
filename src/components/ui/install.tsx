import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useHaptics } from "~/lib/haptics";
import { cn } from "~/lib/utils";

const RESET_DELAY = 1500;

function Install({
  className,
  command,
  children,
  ...props
}: React.ComponentProps<"div"> & { command: string }) {
  return (
    <div
      className={cn(
        "not-typeset flex flex-col gap-xs rounded-lg border bg-bg-2/50 p-xs",
        className
      )}
      data-slot="install"
      {...props}
    >
      <InstallCommand command={command} />

      {children && <div className="flex gap-xs">{children}</div>}
    </div>
  );
}

function InstallCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(null);
  const { trigger } = useHaptics();

  useEffect(() => () => clearTimeout(timeout.current ?? undefined), []);

  async function copy() {
    await navigator.clipboard.writeText(command);
    trigger("click");
    setCopied(true);
    clearTimeout(timeout.current ?? undefined);
    timeout.current = setTimeout(() => setCopied(false), RESET_DELAY);
  }

  return (
    <div
      className="flex items-center gap-md rounded-md border bg-bg-1 py-sm pr-sm pl-md font-mono text-xs"
      data-slot="install-command"
    >
      <code className="flex-1 overflow-x-auto whitespace-nowrap text-fg-2">
        <span className="select-none text-fg-3">$ </span>
        {command}
      </code>

      <button
        aria-label={copied ? "Copied" : "Copy command"}
        className="rounded-sm p-xs text-fg-3 transition-[color,scale] duration-150 hover:text-fg-2 active:scale-[0.96]"
        onClick={copy}
        type="button"
      >
        {copied ? (
          <IconCheck className="size-4 text-brand" />
        ) : (
          <IconCopy className="size-4" />
        )}
      </button>
    </div>
  );
}

function InstallLink({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      className={cn(
        "flex flex-1 items-center justify-center gap-xs rounded-md border bg-bg-1 py-sm text-fg-2 no-underline transition-[background-color,scale] duration-150 hover:bg-bg-2 active:scale-[0.98] *:[svg:not([class*='size-'])]:size-4",
        className
      )}
      data-slot="install-link"
      rel="noopener"
      target="_blank"
      {...props}
    />
  );
}

export { Install, InstallLink };
