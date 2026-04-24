import { useCallback, useRef, useSyncExternalStore } from "react";
import { NavList } from "~/components/ui/nav-list";

interface Heading {
  id: string;
  text: string;
}

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const activeId = useActiveHeading(headings);

  return (
    <NavList>
      {headings.map((h) => {
        const isActive = activeId === h.id;
        return (
          <li key={h.id}>
            <a
              className="nav-link"
              data-status={isActive ? "active" : undefined}
              href={`#${h.id}`}
            >
              {h.text}
            </a>
          </li>
        );
      })}
    </NavList>
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
