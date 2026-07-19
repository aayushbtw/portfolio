# Design Audit

Open issues only, tracked against [DESIGN.md](DESIGN.md). Entries are deleted once fixed, so anything listed here is still live.

Standing constraint: **do not change the current design.** A deviation that can only be fixed by moving pixels gets deferred rather than applied, and is logged here with what it would cost.

## Open

### 1. `ContributionGraph` missing `not-typeset`

DESIGN.md:159 names `ContributionGraph` as a primitive that carries `not-typeset`. It doesn't. Only [list.tsx:7](src/components/ui/list.tsx#L7) and [nav-list.tsx:20](src/components/ui/nav-list.tsx#L20) have it.

Not free to fix. Adding it strips typeset's `margin-block-start` (~1.25em) from the caption `<p>` at [contribution-graph.tsx:227](src/components/ui/contribution-graph.tsx#L227), collapsing the gap under the svg to the parent's `gap-xs` (4px). Visible on the home page. Applied once, then reverted.

Two exits, pick one when the graph's spacing is being worked on deliberately:

- Add `not-typeset` and restore the caption gap on purpose (parent to `gap-md`, or similar).
- Drop `ContributionGraph` from the DESIGN.md:159 list.

Note the node already hand-sets `font-normal text-fg-3 text-xs`, which is roughly what opting out would have given it. That's the tell that it was meant to be `not-typeset` from the start.

### 2. 404 link transition exceeds the duration cap

[__root.tsx:88](src/routes/__root.tsx#L88) uses `duration-300`. DESIGN.md:129 caps hover transitions at 150 to 200ms. Fix is `duration-200`; deferred because the link would visibly ease faster.

### 3. 404 link uses a bare `outline`

Same line. Bare `outline` resolves to `currentColor`. DESIGN.md:24 assigns the `border` token to "all borders and outlines". Fix is `outline-border`; deferred because it changes the outline's color.

### 4. 404 wrapper height is off-scale

[__root.tsx:81](src/routes/__root.tsx#L81) uses `h-[calc(100vh-12rem)]`. Arbitrary, and 12rem is not a step on the spacing scale, against DESIGN.md rule 1. The on-system spelling is `calc(100vh-var(--spacing-2xl)*2)`, which is both ugly and a different height. May be better handled as a documented exception than a fix.

## Not yet audited

- `_app/route.tsx` (shell)
- `_app/writings.index.tsx`
- `_app/writings.$slug.tsx`
- `_app/projects.tsx`
- `_app/skills.tsx`
- `_app/music.tsx`
- `_app/usage.tsx` (two incidental fixes applied, page not swept)
- `__root.tsx` (issues 2 to 4 found incidentally, page not swept)

`_app/index.tsx` is audited and clean. `api/og.tsx` is out of scope: Satori requires inline styles, so the token system doesn't apply.
