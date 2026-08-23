import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useHaptics } from "~/lib/haptics";
import { highlighter, SHELL_LANG } from "~/lib/highlight";
import { cn } from "~/lib/utils";

const RESET_DELAY = 1500;

/* The children take `rounded-xs` rather than `rounded-sm`: the frame's 4px
   pad plus a 4px inner radius is what makes the two curves concentric. */
function Install({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "not-typeset flex flex-col gap-xs rounded-md border bg-bg-2/50 p-xs",
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
        "flex items-center gap-md rounded-xs border bg-bg-1 py-sm pr-sm pl-md font-mono",
        className
      )}
      data-slot="install-command"
      {...props}
    >
      <code
        className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-fg-4"
        translate="no"
      >
        <span className="select-none text-fg-2">$ </span>
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
        className="rounded-sm p-xs text-fg-2 transition-[color,scale] duration-150 hover:text-fg-1 active:scale-[0.96]"
        onClick={copy}
        type="button"
      >
        {/* Both icons stay mounted so the swap cross-fades in and out; the
            copy icon is the one in flow, so it sets the button's size. */}
        <span className="relative block">
          <IconCheck
            aria-hidden="true"
            className={cn(
              "absolute inset-0 size-4 text-brand transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
              copied
                ? "scale-100 opacity-100 blur-0"
                : "scale-[0.25] opacity-0 blur-[4px]"
            )}
            stroke={1.5}
          />
          <IconCopy
            aria-hidden="true"
            className={cn(
              "size-4 transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
              copied
                ? "scale-[0.25] opacity-0 blur-[4px]"
                : "scale-100 opacity-100 blur-0"
            )}
            stroke={1.5}
          />
        </span>
      </button>
    </div>
  );
}

function InstallLinks({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex gap-xs", className)}
      data-slot="install-links"
      {...props}
    />
  );
}

function InstallLink({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      className={cn(
        "flex flex-1 items-center justify-center gap-xs rounded-xs border bg-bg-1 py-sm text-fg-2 no-underline transition-[background-color,scale] duration-150 hover:bg-bg-2 active:scale-[0.96] *:[svg:not([class*='size-'])]:size-4",
        className
      )}
      data-slot="install-link"
      rel="noopener"
      target="_blank"
      {...props}
    />
  );
}

/* The tokens are the highlighter's; only the React key is ours, and it has to
   be the offset rather than the index so two identical words never collide. */
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
