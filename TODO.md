# Open design work

Tracked against [DESIGN.md](DESIGN.md). Everything below is deliberate, not
forgotten: a deviation that can only be fixed by moving pixels is logged here
with what it would cost rather than applied.

## Needs a decision

### Mobile navigation

The biggest functional gap on the site. [navbar.tsx](src/components/navbar.tsx)
is `hidden lg:block`, so below 1024px there is no navigation at all. The only
internal links outside the navbar and TOC are `/`, `/writings/$slug` and
`/skills/$slug`, which means `/projects`, `/writings`, `/skills`, `/music` and
`/usage` are unreachable on a phone. The `G`+key hotkeys don't help either.

Needs a shape decided (bottom bar, header row, disclosure) before any code.
Half a day including the animation.

### ProgressiveBlur

Three separate objections, and you may only care about some:

1. design.md hard-rejects "glass effects" by name. Same family as the gradient
   below, so probably decide them together.
2. 5 `backdrop-filter` layers × 2 instances = 10 live compositing layers,
   re-sampling on every scroll frame, over a 365-node SVG on the home page.
   Reasoned, not profiled.
3. It's why anchors need a 64px `scroll-margin-block-start`
   ([typeset.css](src/styles/typeset.css)). Without the 48px fixed blur,
   typeset's own step would do. One decorative element generating
   compensating rules.

Middle path: drop 5 layers to 3. Halves the cost, near-invisible difference,
since the 0.5px and 1px layers contribute least. ~10 min.

## Deferred, with context

### The 404 page

Three deviations, all on two lines of
[__root.tsx](src/routes/__root.tsx#L118-L122), each deferred because the fix
changes how the page looks:

- `duration-300` on the link, against DESIGN.md's 150–200ms cap. Fix is
  `duration-200`; the link would visibly ease faster.
- A bare `outline`, which resolves to `currentColor`. DESIGN.md assigns the
  `border` token to all borders and outlines. Fix is `outline-border`; it
  changes the outline's colour.
- `h-[calc(100vh-12rem)]`, where `12rem` is not a step on the spacing scale.
  The on-system spelling is `calc(100vh-var(--spacing-2xl)*2)`, which is both
  uglier and a different height. May be better as a documented exception.

### Decorative gradient

`indicator-brand` is `bg-linear-to-b from-brand to-brand/60`
([app.css](src/styles/app.css)). design.md: "A gradient is acceptable only when
it is a labelled continuous data scale." Both its users are ornament: the nav
indicator, and the meters on `/usage`, which since the one-row rebuild are a
single full-width segment rather than a scale. ~15 min to flatten.

### Dark mode

The token layer is ready for it. The blocker is `--color-graph-0` through `-4`:
five raw GitHub hexes wrapped in a no-op `oklch(from #hex l c h)`, the only raw
hex left in the theme, with no dark variant. Everything else derives from the
gray ramp and would follow a `prefers-color-scheme` block. A day, most of it
picking a dark contribution scale.

### Measure

The content column is 644px, which at 15px Inter is **~86 characters** against
design.md's 60–68. Computed from Inter's ~0.5em average advance, which puts the
old 740px column at ~99 and matches the "~95" it was described as at the time.
So the narrowing helped and did not go far enough.

The prescribed shape is a narrower prose column with the graph, code blocks and
`Showcase` breaking out wider. That changes the proportions of every page, so it
wants looking at rather than landing blind. Half a day.

## Small and cheap

- **XML escaping** in [sitemap[.]xml.ts](src/routes/sitemap[.]xml.ts). Slugs come
  from filenames, so `&` is unlikely, but one file named `foo&bar.md` emits
  malformed XML and breaks the sitemap for every crawler, not just that URL.
  3 lines.

- **Secondary-text contrast.** Body copy is fine: `body` and `p` sit at `fg-4`,
  a solid `gray-600` measuring 7.56:1 on `bg-1`. The failures are the two alpha
  tokens, `fg-2` (black/45) at 3.36:1 and `fg-3` (black/40) at 2.85:1, both under
  WCAG AA's 4.5:1, which applies to labels and metadata at these sizes as much as
  to prose. `fg-3` has 24 call sites. Deliberate for now: the palette is set by
  eye. If AA has to hold, black/54 is the first alpha that clears 4.5:1, and both
  tokens move without anything at a call site changing.

- **Spotify preconnect.** WIG wants one; the host needs confirming from a network
  tab on `/music` (likely `i.scdn.co`). Belongs in that route's `head()`, not
  root, since six pages never touch it. 5 min once the host is known.
