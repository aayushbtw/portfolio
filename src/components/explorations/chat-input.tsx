"use client";

import { ArrowUp } from "@phosphor-icons/react/ArrowUp";
import { Microphone } from "@phosphor-icons/react/Microphone";
import { Plus } from "@phosphor-icons/react/Plus";
import { useLayoutEffect, useRef, useState } from "react";

const MAX_TEXT_HEIGHT = 144;

const MOVE = { duration: 300, easing: "cubic-bezier(0.32, 0.72, 0, 1)" };

const FADE = { duration: 150, easing: "ease-out" };

type Moving = "mic" | "plus" | "send" | "text";

const KEYS: Moving[] = ["mic", "plus", "send", "text"];

interface Point {
  x: number;
  y: number;
}

interface Snapshot {
  expanded: boolean;
  height: number;
  layout: Record<Moving, Point>;
  seen: Record<Moving, Point>;
  target: number;
}

function ChatInput() {
  const [value, setValue] = useState("");
  const [expanded, setExpanded] = useState(false);

  const frameRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const moving = useRef<Record<Moving, HTMLElement | null>>({
    mic: null,
    plus: null,
    send: null,
    text: null,
  });

  const before = useRef<Snapshot | null>(null);

  function capture() {
    const frame = frameRef.current;
    const form = formRef.current;

    if (frame && form && !before.current) {
      before.current = {
        expanded,
        height: frame.getBoundingClientRect().height,
        layout: measure(moving.current, layoutPoint),
        seen: measure(moving.current, (element) => seenPoint(element, form)),
        target: form.offsetHeight,
      };
    }
  }

  function update(next: string) {
    capture();
    setValue(next);
  }

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const form = formRef.current;
    const { text } = moving.current;

    if (!(frame && form && text)) {
      return;
    }

    text.style.height = "auto";
    const wraps = text.scrollHeight > text.clientHeight;
    text.style.height = `${Math.min(text.scrollHeight, MAX_TEXT_HEIGHT)}px`;

    // Collapsing only once empty, never when the text fits again, is what
    // stops the box from flipping back and forth at the wrap point.
    if (!expanded && wraps) {
      setExpanded(true);

      return;
    }

    if (expanded && value === "") {
      setExpanded(false);

      return;
    }

    const first = before.current;
    before.current = null;

    if (
      first &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      play(frame, form, moving.current, first);
    }
  }, [value, expanded]);

  function submit(event: React.SyntheticEvent) {
    event.preventDefault();

    if (value.trim()) {
      update("");
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      submit(event);
    }
  }

  return (
    <div>
      <div ref={frameRef}>
        <form
          data-expanded={expanded ? "" : undefined}
          onSubmit={submit}
          ref={formRef}
        >
          <textarea
            aria-label="Message"
            onChange={(event) => update(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask anything"
            ref={(element) => {
              moving.current.text = element;
            }}
            rows={1}
            value={value}
          />

          <IconButton
            label="Add files"
            ref={(element) => {
              moving.current.plus = element;
            }}
          >
            <Plus aria-hidden="true" />
          </IconButton>

          <IconButton
            label="Dictate"
            ref={(element) => {
              moving.current.mic = element;
            }}
          >
            <Microphone aria-hidden="true" />
          </IconButton>

          <button
            aria-label="Send"
            disabled={!value.trim()}
            ref={(element) => {
              moving.current.send = element;
            }}
            type="submit"
          >
            <ArrowUp aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
}

function IconButton({
  label,
  ...props
}: React.ComponentProps<"button"> & { label: string }) {
  return <button aria-label={label} type="button" {...props} />;
}

// Positions are relative to the form, never the viewport: the box is centred,
// so it moves while its height animates and viewport deltas would double up.
function play(
  frame: HTMLElement,
  form: HTMLElement,
  elements: Record<Moving, HTMLElement | null>,
  first: Snapshot
) {
  const expanded = Object.hasOwn(form.dataset, "expanded");
  const layout = measure(elements, layoutPoint);
  const target = form.offsetHeight;

  const moved = KEYS.some(
    (key) =>
      layout[key].x !== first.layout[key].x ||
      layout[key].y !== first.layout[key].y
  );

  // A keystroke that changes nothing must leave a running animation alone.
  if (!moved && target === first.target && expanded === first.expanded) {
    return;
  }

  for (const element of [frame, ...Object.values(elements)]) {
    for (const animation of element?.getAnimations() ?? []) {
      animation.cancel();
    }
  }

  const border = frame.offsetHeight - frame.clientHeight;
  frame.animate(
    [{ height: `${first.height}px` }, { height: `${target + border}px` }],
    MOVE
  );

  for (const key of KEYS) {
    const element = elements[key];
    const x = first.seen[key].x - layout[key].x;
    const y = first.seen[key].y - layout[key].y;
    const collapsing = key === "text" && first.expanded && !expanded;

    if (element && !collapsing && (x !== 0 || y !== 0)) {
      element.animate(
        [{ translate: `${x}px ${y}px` }, { translate: "0 0" }],
        MOVE
      );
    }
  }

  if (first.expanded && !expanded) {
    elements.text?.animate([{ opacity: 0 }, { opacity: 1 }], FADE);
  }
}

function measure(
  elements: Record<Moving, HTMLElement | null>,
  point: (element: HTMLElement) => Point
) {
  function at(key: Moving): Point {
    const element = elements[key];

    return element ? point(element) : { x: 0, y: 0 };
  }

  return {
    mic: at("mic"),
    plus: at("plus"),
    send: at("send"),
    text: at("text"),
  };
}

function layoutPoint(element: HTMLElement): Point {
  return { x: element.offsetLeft, y: element.offsetTop };
}

function seenPoint(element: HTMLElement, form: HTMLElement): Point {
  const box = element.getBoundingClientRect();
  const origin = form.getBoundingClientRect();

  return {
    x: Math.round(box.left - origin.left),
    y: Math.round(box.top - origin.top),
  };
}

export { ChatInput };
