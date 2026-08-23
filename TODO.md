# Open design work

Tracked against [DESIGN.md](DESIGN.md). Everything below is deliberate, not
forgotten: a deviation that can only be fixed by moving pixels is logged here
with what it would cost rather than applied.

## Deferred, with context

### ProgressiveBlur's anchor coupling

The blur is down to 3 layers from 5, which was the compositing cost. What's
left is that its 48px height (`h-12`) is why headings need a 64px
`scroll-margin-block-start` ([typeset.css](src/styles/typeset.css#L461)):
without a fixed strip over the top of the page, typeset's own step would do. A
decorative element generating a compensating rule elsewhere. Only worth undoing
if the blur goes entirely.

## Unverified

Landed without ever being seen in a browser, because the work was done against
the source.

- **`scroll-fade-end`** ([app.css](src/styles/app.css)) leans on a scroll-driven
  animation with an inactive timeline to detect overflow. What to check: a
  *short* install command must have **no** fade. If it has one, the timeline
  isn't going inactive and the fix is a `ResizeObserver` on `InstallCommand`
  instead. Also worth confirming the `@apply` of it inside `typeset.css`, since
  the utility wraps an `@supports`. This one degrades safely: browsers without
  scroll timelines fall back to the hard edge that was there before.
- **The code frame** ([typeset.css](src/styles/typeset.css)): caption margin,
  gutter alignment and `block` lines were changed together, and unlike the fade
  they are unconditional. If the frame looks wrong, it looks wrong everywhere.
- **The phone bar** at 320px. Six 44px targets plus the capsule's `p-xs` comes
  to 272px against 288px of usable width, budgeted on paper.

## Small and cheap

- **XML escaping** in [sitemap[.]xml.ts](src/routes/sitemap[.]xml.ts). Slugs come
  from filenames, so `&` is unlikely, but one file named `foo&bar.md` emits
  malformed XML and breaks the sitemap for every crawler, not just that URL.
  3 lines.

- **`12rem` on the 404 page.** [__root.tsx](src/routes/__root.tsx#L118) uses
  `h-[calc(100vh-12rem)]`, and `12rem` is not a step on the spacing scale. The
  on-system spelling is `calc(100vh-var(--spacing-2xl)*2)`, and since
  `--spacing-2xl` is 6rem, that is **the same height to the pixel**. A rename
  with no visual change. 1 line.

- **Secondary-text contrast.** Body copy is fine: `body` and `p` sit at `fg-4`,
  a solid `gray-600` measuring 7.56:1 on `bg-1`. The failures are the two alpha
  tokens, `fg-2` (black/45) at 3.36:1 and `fg-3` (black/40) at 2.85:1, both under
  WCAG AA's 4.5:1, which applies to labels and metadata at these sizes as much as
  to prose. 18 `text-fg-3` call sites and 13 `text-fg-2`. Deliberate for now: the
  palette is set by eye. If AA has to hold, black/54 is the first alpha that
  clears 4.5:1, and both tokens move without anything at a call site changing.
  `fg-contrast-2` (white/50 on `bg-contrast`) is the newest of these and has not
  been measured at all.

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
