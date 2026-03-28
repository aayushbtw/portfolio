import { useCallback, useRef, useSyncExternalStore } from "react";

interface Heading {
  id: string;
  text: string;
}

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const activeId = useActiveHeading(headings);

  return (
    <ul className="relative flex flex-col gap-0.5 text-sm">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-0.5 rounded-full bg-border"
      />
      <span
        aria-hidden="true"
        className="indicator-spring indicator-brand top-[anchor(top)] h-[anchor-size(height)] w-0.5 shadow-[0_0_8px_rgba(var(--brand-rgb),0.4)] [position-anchor:--active-heading]"
      />
      {headings.map((h) => {
        const isActive = activeId === h.id;
        return (
          <li key={h.id}>
            <a
              className="nav-link block py-px data-active:text-fg-1 data-active:[anchor-name:--active-heading]"
              data-active={isActive || undefined}
              data-unstyled
              href={`#${h.id}`}
            >
              {h.text}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

const SCROLL_OFFSET = 120;

function useActiveHeading(headings: Heading[]) {
  const stateRef = useRef(headings[0]?.id ?? "");
  const rafRef = useRef(0);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const elements = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean) as HTMLElement[];

      const ids = new Set(headings.map((h) => h.id));
      let hashOverride = "";

      const compute = () => {
        if (hashOverride) {
          const id = hashOverride;
          hashOverride = "";
          return id;
        }
        let active = headings[0]?.id ?? "";
        for (const el of elements) {
          if (el.getBoundingClientRect().top <= SCROLL_OFFSET) {
            active = el.id;
          }
        }
        return active;
      };

      const flush = () => {
        rafRef.current = 0;
        const active = compute();
        if (active !== stateRef.current) {
          stateRef.current = active;
          onStoreChange();
        }
      };

      const onScroll = () => {
        if (!rafRef.current) {
          rafRef.current = requestAnimationFrame(flush);
        }
      };

      const onHashChange = () => {
        const hash = window.location.hash.slice(1);
        if (ids.has(hash)) {
          hashOverride = hash;
          flush();
        }
      };

      flush();
      onHashChange();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("hashchange", onHashChange);
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("hashchange", onHashChange);
        cancelAnimationFrame(rafRef.current);
      };
    },
    [headings]
  );

  return useSyncExternalStore(
    subscribe,
    () => stateRef.current,
    () => headings[0]?.id ?? ""
  );
}
