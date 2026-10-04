import { useCallback, useRef, useSyncExternalStore } from "react";

interface Heading {
  id: string;
  text: string;
}

/** Ease-in-out quint: on-screen movement accelerates, then settles. */
function easeInOut(t: number) {
  return t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2;
}

let cancelScroll: (() => void) | undefined;

/** Native smooth scroll has no say in speed or curve, so the tween is ours. */
function scrollToElement(target: HTMLElement, onDone: () => void) {
  const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop);
  const from = window.scrollY;

  const to = Math.min(
    target.getBoundingClientRect().top + from - (margin || 0),
    document.documentElement.scrollHeight - window.innerHeight
  );

  const distance = to - from;
  const duration = Math.min(700, Math.max(400, 250 + Math.abs(distance) * 0.3));
  const start = performance.now();
  let frame = 0;

  function cleanup() {
    cancelAnimationFrame(frame);
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("keydown", stop);
    cancelScroll = undefined;
  }

  // The reader taking over ends the tween where it is.
  function stop() {
    cleanup();
    onDone();
  }

  // A second click retargets: the old tween stops without releasing the new lock.
  cancelScroll?.();
  cancelScroll = cleanup;

  function step(now: number) {
    const t = Math.min(1, (now - start) / duration);
    window.scrollTo(0, from + distance * easeInOut(t));

    if (t < 1) {
      frame = requestAnimationFrame(step);
    } else {
      stop();
    }
  }

  window.addEventListener("wheel", stop, { passive: true });
  window.addEventListener("touchstart", stop, { passive: true });
  window.addEventListener("keydown", stop);
  frame = requestAnimationFrame(step);
}

function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, select, release] = useActiveHeading(headings);

  function onClick(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const modified =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

    const target = document.getElementById(id);

    if (modified || event.button !== 0 || !target) {
      return;
    }

    event.preventDefault();

    // `detail` is 0 for Enter on a focused link: keyboard actions jump.
    const instant =
      event.detail === 0 ||
      matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Replace, not push: the router owns history entries and their state.
    history.replaceState(history.state, "", `#${id}`);
    select(id);

    if (instant) {
      target.scrollIntoView();
      release();
    } else {
      scrollToElement(target, release);
    }
  }

  return (
    <ul>
      <span aria-hidden="true" />
      {headings.map((h) => {
        const isActive = activeId === h.id;

        return (
          <li key={h.id}>
            <a
              data-status={isActive ? "active" : undefined}
              href={`#${h.id}`}
              onClick={(event) => onClick(event, h.id)}
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
  // Pins the clicked heading while a smooth scroll passes the ones before it.
  const lockRef = useRef("");
  const notifyRef = useRef(() => {});
  const releaseRef = useRef(() => {});

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const elements = headings.flatMap((h) => {
        const element = document.querySelector(`#${CSS.escape(h.id)}`);

        return element instanceof HTMLElement ? [element] : [];
      });

      const ids = new Set(headings.map((h) => h.id));
      notifyRef.current = onStoreChange;

      function compute() {
        if (lockRef.current) {
          return lockRef.current;
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
          lockRef.current = hash;
          flush();
        }
      }

      // Any input from the reader hands control back to the scroll position.
      function unlock() {
        if (lockRef.current) {
          lockRef.current = "";
          onScroll();
        }
      }

      releaseRef.current = unlock;
      flush();
      onHashChange();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("hashchange", onHashChange);
      window.addEventListener("wheel", unlock, { passive: true });
      window.addEventListener("touchstart", unlock, { passive: true });
      window.addEventListener("keydown", unlock);

      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("hashchange", onHashChange);
        window.removeEventListener("wheel", unlock);
        window.removeEventListener("touchstart", unlock);
        window.removeEventListener("keydown", unlock);
        cancelAnimationFrame(rafRef.current);
      };
    },
    [headings]
  );

  const select = useCallback((id: string) => {
    lockRef.current = id;

    if (stateRef.current !== id) {
      stateRef.current = id;
      notifyRef.current();
    }
  }, []);

  const release = useCallback(() => releaseRef.current(), []);

  const activeId = useSyncExternalStore(
    subscribe,
    () => stateRef.current,
    () => headings[0]?.id ?? ""
  );

  return [activeId, select, release] as const;
}

export { TableOfContents };
