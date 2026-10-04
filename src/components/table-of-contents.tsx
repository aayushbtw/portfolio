import { useCallback, useRef, useSyncExternalStore } from "react";

interface Heading {
  id: string;
  text: string;
}

function TableOfContents({ headings }: { headings: Heading[] }) {
  const activeId = useActiveHeading(headings);

  return (
    <ul>
      <span aria-hidden="true" />
      {headings.map((h) => {
        const isActive = activeId === h.id;

        return (
          <li key={h.id}>
            <a data-status={isActive ? "active" : undefined} href={`#${h.id}`}>
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
      const elements = headings.flatMap((h) => {
        const element = document.querySelector(`#${CSS.escape(h.id)}`);

        return element instanceof HTMLElement ? [element] : [];
      });

      const ids = new Set(headings.map((h) => h.id));
      let hashOverride = "";

      function compute() {
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
      }

      function flush() {
        rafRef.current = 0;
        const active = compute();

        if (active !== stateRef.current) {
          stateRef.current = active;
          onStoreChange();
        }
      }

      function onScroll() {
        if (!rafRef.current) {
          rafRef.current = requestAnimationFrame(flush);
        }
      }

      function onHashChange() {
        const hash = window.location.hash.slice(1);

        if (ids.has(hash)) {
          hashOverride = hash;
          flush();
        }
      }

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

export { TableOfContents };
