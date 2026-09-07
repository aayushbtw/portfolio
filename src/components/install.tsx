import { Check } from "@phosphor-icons/react/Check";
import { Copy } from "@phosphor-icons/react/Copy";
import { useEffect, useRef, useState } from "react";

import { useHaptics } from "~/lib/haptics";
import { highlighter, SHELL_LANG } from "~/lib/highlight";
import { cn } from "~/lib/utils";

const RESET_DELAY = 1500;

function Install({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "not-typeset gap-xs bg-bg-3 p-xs flex flex-col rounded-md border",
        className
      )}
      data-slot="install"
      {...props}
    />
  );
}

function InstallCommand({
  className,
  command,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & { command: string }) {
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
      className={cn(
        "gap-md bg-bg-1 py-sm ps-md pe-sm flex items-center rounded-xs border font-mono",
        className
      )}
      data-slot="install-command"
      {...props}
    >
      <code
        className="scroll-fade-end text-fg-4 min-w-0 flex-1 overflow-x-auto whitespace-nowrap"
        translate="no"
      >
        <span className="text-fg-2 select-none">$ </span>
        {highlightShell(command).map((token) => (
          <span
            className={token.className && `th-token th-${token.className}`}
            key={token.key}
          >
            {token.value}
          </span>
        ))}
      </code>

      <button
        aria-label={copied ? "Copied" : "Copy command"}
        className="p-xs text-fg-2 hover:text-fg-1 rounded-sm transition-[color,scale] duration-150 active:scale-[0.96]"
        onClick={copy}
        type="button"
      >
        {/* Both stay mounted so the swap animates out as well as in. */}
        <span className="relative block">
          <Check
            aria-hidden="true"
            className={cn(
              "text-brand absolute inset-0 size-4 transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
              copied
                ? "blur-0 scale-100 opacity-100"
                : "scale-[0.25] opacity-0 blur-[4px]"
            )}
            weight="light"
          />
          <Copy
            aria-hidden="true"
            className={cn(
              "size-4 transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
              copied
                ? "scale-[0.25] opacity-0 blur-[4px]"
                : "blur-0 scale-100 opacity-100"
            )}
            weight="light"
          />
        </span>
      </button>
    </div>
  );
}

function InstallLinks({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("gap-xs flex", className)}
      data-slot="install-links"
      {...props}
    />
  );
}

function InstallLink({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      className={cn(
        "gap-xs bg-bg-1 py-sm text-fg-2 hover:bg-bg-2 flex flex-1 items-center justify-center rounded-xs border no-underline transition-colors duration-150 *:[svg:not([class*='size-'])]:size-4",
        className
      )}
      data-slot="install-link"
      rel="noopener"
      target="_blank"
      {...props}
    />
  );
}

/* Keyed by offset, not index: two identical words would collide. */
function highlightShell(command: string) {
  let offset = 0;

  return highlighter
    .tokenize(command, { lang: SHELL_LANG })
    .tokens.map((token) => {
      const key = `${offset}-${token.value}`;
      offset += token.value.length;
      return { className: token.className, key, value: token.value };
    });
}

export { Install, InstallCommand, InstallLink, InstallLinks };
