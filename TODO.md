# Open design work

Tracked against [DESIGN.md](DESIGN.md). Everything below is deliberate, not
forgotten: a deviation that can only be fixed by moving pixels is logged here
with what it would cost rather than applied.

## Needs a decision

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

### NowPlaying's inline edge

[now-playing.tsx](src/components/now-playing.tsx) is `fixed … right-lg`, so it
hangs off the viewport while every other thing on the page hangs off the layout
margin. On a wide screen it drifts a few hundred pixels away from the content
column it belongs to.

A `frame-inline-end` utility doing the `max(margin, (100vw - frame) / 2 +
margin)` math was built and rejected: `100vw` counts the stable scrollbar
gutter and the centred layout doesn't, so it lands ~2.5px off above 1280px. The
clean version is moving it inside the frame as sticky chrome, which needs no
viewport math at all but does mean it stops being a sibling of the layout. ~1h.

## Deferred, with context

### The 404 page

Two deviations, both on
[__root.tsx](src/routes/__root.tsx#L118-L122), each deferred because the fix
changes how the page looks:

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

The token layer is ready for it. Two blockers now:

- `--color-graph-0` through `-4`: five raw GitHub hexes wrapped in a no-op
  `oklch(from #hex l c h)`, the only raw hex left in the theme, with no dark
  variant.
- The phone bar is inverted onto `bg-contrast`, which is the whole point of it
  on a light page. In dark mode a near-black capsule on a near-black page has
  nothing to separate it, so it needs a rule of its own rather than following
  the ramp.

Everything else derives from the gray ramp and would follow a
`prefers-color-scheme` block. A day, most of it picking a dark contribution
scale.

### Measure

The content column is 644px, which at 15px Inter is **~86 characters** against
design.md's 60–68. Computed from Inter's ~0.5em average advance, which puts the
old 740px column at ~99 and matches the "~95" it was described as at the time.
So the narrowing helped and did not go far enough.

The prescribed shape is a narrower prose column with the graph, code blocks and
`Showcase` breaking out wider. That changes the proportions of every page, so it
wants looking at rather than landing blind. Half a day.

## Unverified

Landed without ever being seen in a browser, because the work was done against
the source. Each falls back to the behaviour it replaced if it doesn't hold, so
none is urgent, but none is confirmed either.

- **`scroll-fade-end`** ([app.css](src/styles/app.css)) leans on a scroll-driven
  animation with an inactive timeline to detect overflow. What to check: a
  *short* install command must have **no** fade. If it has one, the timeline
  isn't going inactive and the fix is a `ResizeObserver` on `InstallCommand`
  instead. Also worth confirming the `@apply` of it inside `typeset.css`, since
  the utility wraps an `@supports`.
- **The code frame** ([typeset.css](src/styles/typeset.css)): caption margin,
  gutter alignment and `block` lines were all changed together.
- **The phone bar** at 320px. Six 44px targets plus padding was budgeted at
  272px on paper.

## Small and cheap

- **XML escaping** in [sitemap[.]xml.ts](src/routes/sitemap[.]xml.ts). Slugs come
  from filenames, so `&` is unlikely, but one file named `foo&bar.md` emits
  malformed XML and breaks the sitemap for every crawler, not just that URL.
  3 lines.

- **Secondary-text contrast.** Body copy is fine: `body` and `p` sit at `fg-4`,
  a solid `gray-600` measuring 7.56:1 on `bg-1`. The failures are the two alpha
  tokens, `fg-2` (black/45) at 3.36:1 and `fg-3` (black/40) at 2.85:1, both under
  WCAG AA's 4.5:1, which applies to labels and metadata at these sizes as much as
  to prose. `fg-3` has 23 call sites. Deliberate for now: the palette is set by
  eye. If AA has to hold, black/54 is the first alpha that clears 4.5:1, and both
  tokens move without anything at a call site changing. `fg-contrast-2`
  (white/50 on `bg-contrast`) is the newest of these and has not been measured
  at all.

- **The `lg` breakpoint is written twice.** `(min-width: 64rem)` in
  [now-playing.tsx](src/components/now-playing.tsx) has to track Tailwind's `lg`
  by hand, because a `matchMedia` string can't read the token. Only fixable by
  generating the query from the theme, which is more machinery than one call
  site is worth. Logged so the next one doesn't add a third copy.

- **The hover card's border is doing depth work.**
  [hover-card.tsx](src/components/ui/hover-card.tsx) carries `border` *and*
  `shadow-sm`. DESIGN.md's rule is shadows for elevation, borders for structure;
  a floating popup's outline is elevation. Fix is dropping the border for a
  layered shadow, which changes how the card reads. 10 min.

- **Spotify preconnect.** WIG wants one; the host needs confirming from a network
  tab on `/music` (likely `i.scdn.co`). Belongs in that route's `head()`, not
  root, since six pages never touch it. 5 min once the host is known.
