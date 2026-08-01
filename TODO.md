# Open design work

Left over from the token/structure pass audited against
[vercel.com/design.md](https://vercel.com/design.md), the
[Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines),
and [arlan.me](https://www.arlan.me). Everything below is deliberate, not forgotten.

## Verify first

**The pass shipped 25 commits and almost none were seen in a browser.** The one
bug that did surface (`PageHeader` height) was caught by eye, not by `tsc`. The
visual changes concentrate in four commits, worth a look before building on top:

| Commit | What moved |
| --- | --- |
| `6bff42b` | Type roles. Page titles and section labels stopped being uppercase 12px |
| `def6e06` | Radius, 8 values down to 2 |
| `0daf634` | List rows unified on `ListItem`, the posts list lost its dividers and dim |
| `b381556` | Section gaps, `mt-lg` → `mt-xl` where a block has its own label |

Also unverified: OG images after the tracking change (`d8fe3ec`) tightened 62px
titles from `-0.15px` to `-1.38px`, and `/sitemap.xml` on the production host
(dev is confirmed; only `config.siteUrl` differs).

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
3. It's why anchors need `scroll-margin-block-start: 64px`
   ([app.css](src/styles/app.css)). Without the 48px fixed blur, typeset's own
   17px would do. One decorative element generating compensating rules.

Middle path: drop 5 layers to 3. Halves the cost, near-invisible difference,
since the 0.5px and 1px layers contribute least. ~10 min.

## Deferred, with context

### Measure

Prose runs ~95-105 characters against design.md's 60-68. The `740px` column is
not a typographic choice: `CELL = 14` × 53 weeks − 2 = **740 exactly**, so the
reading width is the contribution graph's pixel width and prose inherited it.

The prescribed shape is a narrower prose column with the graph, code blocks and
`Showcase` breaking out wider. Changes the page's proportions, so it wants
looking at rather than landing blind. Half a day.

### Decorative gradient

`indicator-brand` is `bg-linear-to-b from-brand to-brand/60`
([app.css](src/styles/app.css)). design.md: "A gradient is acceptable only when
it is a labelled continuous data scale." On the nav indicator it's ornament. On
the meter segments the data is carried by the opacity step (80/60/35/20), so the
gradient is ornament there too. ~15 min to flatten.

### Dark mode

The token layer is ready for it. The blocker is `--color-graph-0` through `-4`:
five raw GitHub hexes wrapped in a no-op `oklch(from #hex l c h)`, the only raw
hex left in the theme, with no dark variant. Everything else derives from the
gray ramp and would follow a `prefers-color-scheme` block. A day, most of it
picking a dark contribution scale.

## Small and cheap

- **XML escaping** in [sitemap[.]xml.ts](src/routes/sitemap[.]xml.ts). Slugs come
  from filenames, so `&` is unlikely, but one file named `foo&bar.mdx` emits
  malformed XML and breaks the sitemap for every crawler, not just that URL.
  3 lines.
- **Spotify preconnect.** WIG wants one; the host needs confirming from a network
  tab on `/music` (likely `i.scdn.co`). Belongs in that route's `head()`, not
  root, since six pages never touch it. 5 min once the host is known.

## Closed

Contrast (`fg-3` now clears AA), focus rings, skip link, reduced motion,
`color-scheme`, `touch-action`, anchor offsets, radius tokens, weight tokens,
tracking curve, type roles, the inverted-surface token, `border-strong`,
`PageHeader` / `Stat` / `StatStrip` / `Meter` / `MeterLegend` primitives, `Intl`
dates in UTC, decorative-icon labelling, `min-w-0` truncation, dead `no-scrollbar`,
skeleton/content mismatches, prose `h6`, curly quotes, font preload, 404 casing,
sitemap and robots.
