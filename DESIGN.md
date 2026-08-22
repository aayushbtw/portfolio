# Design

How this site is styled. The home page ([src/routes/\_app/index.tsx](src/routes/_app/index.tsx)) is the reference implementation. If a new page needs styling that isn't described here, add it to [src/styles/app.css](src/styles/app.css) as a token or `@utility`, then use it here.

## Rules

1. Tokens over values. No raw hex, no `text-gray-600`, no arbitrary spacing. Use `bg-1`, `fg-3`, `border`, `brand`, `mt-lg`.
2. Repeated class strings become a `@utility`. Second time you write the same combo, define it.
3. Components own their own spacing. `List` ships with `mt-sm`; callers don't pass it.
4. `cn()` is for merging a `className` prop, not for stacking string literals. A single static string means no `cn()`.
5. Semantic HTML first: `section`, `h1`/`h2`, `time`, `ul`/`li`. Styling hangs off the utility, not the tag.

## Tokens

Defined in `@theme`, all in oklch.

| Token         | Use                                              |
| ------------- | ------------------------------------------------ |
| `bg-1`        | Page background                                  |
| `bg-2`        | Raised surface: hovered list item, inline code   |
| `fg-1`        | `h1`, active nav. Solid black                    |
| `fg-2`        | `h2`–`h6`, link text, list item titles           |
| `fg-3`        | `p`, labels, metadata                            |
| `fg-4`        | What `body` sits at. Out of numeric order: it is darker than `fg-2` and `fg-3`, not lighter |
| `bg-contrast` | Inverted surface: the graph tooltip               |
| `fg-contrast` | Text on `bg-contrast`. The only light-on-dark text |
| `border`      | All borders and outlines                         |
| `border-strong` | One step darker, for a boundary that must read as a line: the prose link underline |
| `ring`        | Focus ring. Points at `brand`, and is also typeset's variable name |
| `brand`       | Orange. Accent only: link underline hover, meters, eq bars |
| `graph-0`–`graph-4` | Contribution levels, empty to busiest      |

`fg-1`, `fg-2` and `fg-3` are black at 100%, 45% and 40%; `fg-4` is a solid `gray-900` and is what `body` sits at. The alpha is *in the token*, so text composites onto whatever it sits on and a row reads the same over `bg-1` and over its `bg-2` hover. Text sits at `fg-3` by default and steps *up* to `fg-2`/`fg-1` for emphasis. It never steps down, and never takes a second opacity on top of the token: `text-fg-3/60` is not a lighter grey, it's an unreadable one. Opacity on a *background* (`bg-bg-2/50`, `bg-brand/20`) is fine.

The mapping is attached to the tags themselves in [src/styles/app.css](src/styles/app.css), not to a prose class, so `<p>` and `<h2>` are already the right color with no utility on them. Those rules deliberately reach into `not-typeset` subtrees as well: UI opts out of prose *layout*, never out of the color guide. Only write `text-fg-*` when a tag needs to depart from its default.

## Spacing

Six steps: **4, 8, 16, 24, 48, 96**. Doubling from `xs` up to `md`, 1.5× to `lg`, doubling from there.

| Token | Value | Typically                                           |
| ----- | ----- | --------------------------------------------------- |
| `xs`  | 4px   | Parts of one thing: icon and its label, stacked meta |
| `sm`  | 8px   | A label and the content it labels, rows in a list    |
| `md`  | 16px  | Sibling items, padding inside a container            |
| `lg`  | 24px  | Sections of a page (`mt-lg`)                         |
| `xl`  | 48px  | Major blocks of a page                               |
| `2xl` | 96px  | The page frame: desktop padding, sticky nav offset   |

Used as `mt-lg`, `gap-md`, `px-md`, `py-sm`. Nothing exists between the steps, so a gap that feels wrong is the wrong step, not a missing value. Reaching for `mt-7` means one of these is what you meant.

**Vertical rhythm comes from the relationship, not from one default gap.** A block that introduces itself with its own `h2` is a new section and takes `mt-xl`; a block that continues the one above it takes `mt-lg`. So on the home page the contribution graph sits `lg` under the hero it belongs to, while Projects and Writings each open `xl` below. The rule is checkable: if it has its own label, it gets the bigger step.

Note these read next to Tailwind's responsive prefixes, so `sm:mt-sm` is "8px top margin from the `sm` breakpoint up". The prefix is before the colon, the scale after it.

The scale is deliberately *narrower* than the spacing it replaced, which came from having no system. The old values were folded in by nearest step, ties rounding up: 12px and 20px went up to `md` and `lg`, 32px came down to `lg`, 40px went up to `xl`.

Two things sit outside the scale:

- **Zero.** `my-0`, `p-0` stay as they are. Zero isn't a step.
- **Optical nudges.** `[&_svg]:mb-0.5` in `icon-link` lifts an inline icon onto the text baseline. That's alignment, not spacing, and it's tuned to the glyph rather than to a scale.

Anything else in a `m-`, `p-`, or `gap-` slot comes from the table above.

Fonts: `font-sans` (Inter Variable) everywhere, `font-mono` (JetBrains Mono Variable) for code. Body sets the `cv01`/`ss03` features, and the size, leading and weight described under **Type** below.

## Radius

Two steps, and which one you want follows from what the thing is.

| Token | Value | For                                        |
| ----- | ----- | ------------------------------------------ |
| `sm`  | 6px   | A control you press or type into: buttons, fields, covers, skeletons |
| `md`  | 8px   | A box that holds other things: rows, panels, media, tooltips |

## Layout

The content column is `--container-content`, 644px, used as `max-w-content` on `main` and as the middle track of the three-column grid in [src/routes/_app/route.tsx](src/routes/_app/route.tsx). About 86 characters at 15px, which is wider than the 60-68 prose wants; see TODO.md. 520 was tried first and read as too narrow next to the code blocks in a post; 740 ran long enough that the eye hunted for the start of the next line.

List rows are `py-sm`, negatively inset by `-mx-md` so the hover surface bleeds past the text, with no divider between them. A post row is three parts — year left in `fg-3`, title in `fg-1`, category right in `fg-3` — so the column scans down the black titles with the metadata staying out of the way.

Nested boxes step down, so an `md` panel holds `sm` fields. Three things sit outside it: `rounded-full` (a shape, not a step), `rounded-none` (a reset, like zero spacing), and `rounded-[1px]` on the now-playing eq bars, which are 2px wide and would otherwise render as lozenges.

`--radius` in `:root` points at `md` and is what typeset reads for code blocks and tables.

## Type

**Four axes, two or three tokens each, and one default that everything inherits.** The default sits on `body` and is the only place any axis is set globally:

```css
@apply text-base font-normal leading-normal tracking-normal;
```

| Axis     | Tokens                                                        |
| -------- | ------------------------------------------------------------- |
| Size     | `text-base` 15px · `text-sm` 14px                             |
| Leading  | `leading-normal` 18px · `leading-relaxed` 24px · `leading-tight` 13.5px |
| Tracking | `tracking-normal` · `tracking-tight` -0.1px                   |
| Weight   | `font-normal` 400 · `font-bold` 450, `h1` only                |

Every one of those reuses a stock Tailwind name, with the site's value behind
it. That is deliberate: tailwind-merge groups a class by guessing from its name,
so a bespoke name like `text-compact` was read as a *colour* and silently
deleted by the `text-fg-4` beside it in `cn()`. Stock names group correctly for
free. The spacing scale is the one exception, and it pays for it with an entry
in `extendTailwindMerge` at [lib/utils.ts](src/lib/utils.ts).

**Leading defaults tight, not loose.** `leading-normal` is 18px because almost everything here is one line long: a nav item, a list row, a stat, a label, a heading. A 24px line box around a single line is 24px of nothing, and it makes a column of rows read as loose rather than as a set. `leading-relaxed` (24px) is the opt-up, and typeset gives it to `p` — the one element that reliably wraps, where the extra leading is what makes the next line findable from the end of the last. `leading-tight` (13.5px) goes on `h1`, so a page title that wraps reads as one object rather than two lines.

**Weight is not a hierarchy tool.** `font-medium` doesn't compile, typeset's entire 600/500 ladder was deleted rather than remapped, and `<strong>` carries no visual change at all. Hierarchy is colour: a title is black, the copy under it is `fg-4`, a label beside it is `fg-3`.

`font-bold` (450) has exactly one user, the `h1`. Four steps is less a weight change than an optical correction, and it's what stops a page title from disappearing into copy it shares a size and a family with. Reaching for it anywhere else is the signal that the colour step above it isn't doing its job.

**`tracking-tight` belongs to the title block** — the `h1` and the date directly under it, and nothing else. Those two lines are read as a unit rather than as running copy, and pulling them in is what makes them read as one object. Body copy stays `tracking-normal`: tracking a wrapping paragraph fights the reading it's meant to help.

Each axis is cleared with a `--<axis>-*: initial` reset before it's redeclared, so Tailwind's own steps don't survive: `text-3xl`, `tracking-wide`, `font-medium` and `rounded-3xl` don't compile. The names the site *does* declare keep working, and only those. `rounded-full` and `rounded-none` survive the radius reset, being static utilities rather than steps on a scale. The resets live in a `@theme` block of their own, because a `*` reset has to come before what it clears and Biome's property sorter moves those lines to the end of whatever block they're in.

**The one hole is `leading-<number>`.** It reads `--spacing`, not `--leading-*`, so `leading-6` compiles regardless, and clearing `--spacing` would take the spacing scale with it. That one is convention.

**Leading is not bundled into the size tokens.** Either leading can sit on either size, so pairing them would have made the choice for you. A departure names the single axis it changes.

`text-sm` is the secondary line: a list item's description, a meter legend, a post's date, the now-playing card. In every case it sits directly under the thing it belongs to and is read with it, never instead of it. Anything read on its own is `text-base`.

The one element that sets its own size is `sup`/`sub`, which typeset keeps at `0.75em`: a footnote marker at full size stops reading as a marker.

**`tracking-normal` is the default on purpose.** A tracking curve corrects for size, and with one size there is nothing to correct: Inter at 15px wants no adjustment. `tracking-tight` (-0.1px) is the single hand-picked departure. The OG image in [src/routes/api/og.tsx](src/routes/api/og.tsx) renders at display sizes outside this system and keeps its own tracking, because Satori draws outside the token scale entirely.

### What carries hierarchy instead

Colour and weight, and nothing else:

| Role            | Treatment                                       |
| --------------- | ----------------------------------------------- |
| Page title      | `h1` as typeset styles it: `fg-1`, `font-bold`, `leading-tight`, `tracking-tight`. No class |
| Section label   | a bare `<h2>`: `fg-2` from the colour guide      |
| Field label     | `text-fg-3` written directly                    |
| Everything else | body: `fg-4`                                    |

Headings below `h1` are body size at body weight and separate from copy by colour alone, `h1` at `fg-1` and `h2`–`h6` at `fg-2`. To signal importance mid-text, step the colour up.

**The page title carries no class.** Typeset gives `h1` `fg-1`, `font-bold`, `leading-tight` and `tracking-tight`, which is exactly the treatment a page title wants, and Tailwind's preflight already sets `h1`–`h6` to `font-size: inherit`. `PageHeader` renders a bare `<h1>` and gets it for free.

A section heading is a bare `<h2>` and carries no class at all: the colour guide gives it `fg-2`, one step quieter than the `h1` above it and one louder than the copy below. It isn't uppercase and isn't tracked out — a label that shouts competes with the thing it's labelling, and the tag already carries the structure.

**There are no label utilities.** `text-section-label` and `text-label` both existed and both are gone. Once size, weight and tracking left the label treatment, each was a second name for `text-fg-3`, and a utility that expands to one declaration you could have written is indirection with nothing on the other end. A field label writes `text-fg-3`; a section heading writes nothing at all. Bring a name back when it earns more than one declaration.

### Prose

[src/styles/typeset.css](src/styles/typeset.css) is a vendored `shadcn/typeset` copy, and it has been forked rather than overridden. Every `font-size`, `line-height` and `letter-spacing` it set is stripped out at the source, and its 600/500 weight ladder is deleted outright. Each removal is commented in place, so the file reads as its own history. **Re-pulling the component from the registry undoes all of it.**

That file now owns rendered markdown end to end: prose structure (flow margins, rules, lists, tables, code frames) *and* the site's rules on top of it (the colour guide, heading anchors, the TanStack Markdown frames). app.css is tokens, base and utilities, and holds no `.typeset` selector at all.

### What this cost

The 404 title, the four usage stat values and every caption, code block and footnote used to differ in size and no longer do. Captions and code separate by family (`font-mono`), colour and rule instead.

Pages here are short enough to take in at once, which is the bet the whole thing rests on. A page long enough to need scanning would need a second size in the copy itself, and that's the signal to add one rather than to work around its absence.

## Utilities

Defined with `@utility` in [src/styles/app.css](src/styles/app.css) so they compose with variants (`hover:`, `sm:`) and get merged correctly.

| Utility            | What it is                                                     |
| ------------------ | -------------------------------------------------------------- |
| `skip-link`        | Off-screen until focused, then a real target top-left. One per document |
| `animated-link`    | Inline prose link: `fg-1`, underline that turns `brand` on hover. Applied to every `a` inside `typeset`, so you rarely write it |
| `icon-link`        | `animated-link` + inline 16px icon before the label              |
| `row-link`         | Row layout inside a list item: `flex items-center gap-md`         |
| `nav-link`         | Sidebar / TOC link with active state and press scale             |
| `indicator-brand`  | Brand gradient fill for the nav indicator and meter segments      |

**A `@utility` earns its place two ways: it lands on tags the caller chooses, or
it needs selectors a `className` can't express.** `row-link` sits on a `Link`, an
`a` and a `div`; `nav-link` on a `Link` and an `a`; `indicator-brand` on a nav
span and a meter segment. That is the first kind. `icon-link` and `skip-link`
each have a single call site and stay anyway: one needs descendant rules for its
`svg`, the other a twelve-variant `focus-visible:` chain, and a stylesheet says
both better than JSX can.

Anything else belongs in the component that renders it. The eq bars and the nav
indicator were utilities once, each with exactly one consumer that was already a
component — so the utility was a second name for the same thing in a different
file, and the class list moved to where the markup lives.

## Page shape

`_app/route.tsx` owns the frame: centered, `max-w-7xl`, three columns on `lg` (`1fr / minmax(0, var(--container-content)) / 1fr`) collapsing to a single column below `lg`. Pages render only their sections.

```tsx
<section>
  <PageHeader title={title} />
  <List>...</List>
</section>

<section className="mt-lg">
  <h2>Writings</h2>
  <ListPosts posts={posts} />
</section>
```

Every page but home opens with `<PageHeader title={title} />`, which owns the `h1` and an optional right-aligned piece of metadata. The home page is the exception: its `h1` is the display name, same treatment, but it's the only page with a hero. Its paragraph stack also tightens `--typeset-flow` to `sm` inline, so the hero reads as one block rather than separated copy. Both are home-only. Don't carry either to another page.

## Interaction

- Hover is a color or background change, 150–200ms, `ease-out`. Never a layout shift.
- Press is `active:scale-[0.96–0.99]`, scaled to element size. Small targets compress more.
- **One list-row hover model.** Every list row is a `ListItem`: the row lifts to `bg-2` on hover. A surface has to be earned by communicating interaction, and a divider between rows isn't earned when spacing already separates them. Secondary metadata (star counts, arrows) is `opacity-0` until row hover, via `ListItemHover`.
- Focus is a 2px `ring` outline at 2px offset, from a bare `:focus-visible` rule in `@layer base`. It hangs off the pseudo-class, not a utility, so nothing opts in and nothing can forget.
- Haptics (`useHaptics`) fire on nav clicks and on hover of the home page links. `tick` for hover, `click` for navigation.
- Numbers are always `tabular-nums`.
- All of the above is decoration. `prefers-reduced-motion: reduce` switches every animation and transition off outright rather than shortening it. Nothing sets `animation-fill-mode`, so each element settles on its base style.

## Components

`ui/` holds the primitives: `PageHeader`, `List`, `ListItem`, `ListItemTitle`, `ListItemDescription`, `ListItemHover`, `ListSkeleton`, `NavList`, `Stat`, `StatStrip`, `Meter`, `MeterLegend`, `Skeleton`, `ContributionGraph`, `ProgressiveBlur`, `Install`, `Showcase`, `HoverCard`. They carry `data-slot` attributes and accept `className` merged through `cn()`. Everything above `ui/` composes them and shouldn't reach for raw layout classes that a primitive already provides.

Primitives stay presentational. `Stat` takes a formatted `value` and `detail`; it doesn't reach into `usage.json` to work out a percentage. When a figure needs page-specific arithmetic, do it in the route and pass the result down.

A skeleton has to be the same shape as the thing it replaces. `ListSkeleton` uses `ListItem`'s box without its hover, and `ContributionGraphSkeleton` reserves the graph's exact height, so nothing shifts when data lands.

### Dates

Every date is either a calendar day (`2026-03-27`) or a UTC instant. `lib/utils.ts` parses **and** formats both in UTC through shared `Intl.DateTimeFormat` instances (`formatDate`, `formatShortDate`, `formatNumericDate`). Never call `toLocaleString` at a call site and never build a date string by hand: the server and the browser sit in different timezones, and a date-only string parsed locally drifts a day west of Greenwich.

## Prose

There is no prose class. `typeset` sits on the shell in `_app/route.tsx`, so every page is prose by default: write plain `<p>`, `<h2>`, `<ul>`, `<table>` with no classes and they're styled. A paragraph on the home page and a paragraph in a blog post are the same paragraph.

```tsx
<section>
  <h1 className="text-balance">{post.title}</h1>
  <article>{post.body}</article>
</section>
```

[src/styles/typeset.css](src/styles/typeset.css) is vendored from [shadcn/typeset](https://ui.shadcn.com/docs/typeset) and **has been forked**, not configured. It owns rendered markdown end to end:

- Upstream's type declarations are stripped at the source — every `font-size`, `line-height`, `letter-spacing` and `font-weight` — each removal commented in place so the file reads as its own history.
- It sets its own `--typeset-*` vars, pointed straight at the site's fonts.
- A block at the bottom holds what the site adds on top: the colour guide per tag, the `h1` treatment, `p` at `leading-relaxed`, links as `animated-link`, heading anchors, and the frame for TanStack Markdown's code title bar, line numbers and token colours.

That bottom block **must** stay in `@layer components` and after the vendored rules in source order. Same layer and later means it beats them, while a utility on the element still beats it; unlayered, it would outrank utilities instead.

app.css holds no `.typeset` selector at all. It is tokens, the shadcn `:root` aliases, `@utility` definitions and `@layer base`.

**Re-pulling the component from the registry undoes every change above.**

### Opting out

UI is not prose. Any primitive that renders semantic tags for structure rather than reading carries `not-typeset` on its outermost node, which excludes its whole subtree, so callers never think about it: `PageHeader`, `List`, `NavList`, `ContributionGraph`, `Install`, and `StatStrip`.

The rule that catches people out is [typeset.css:105](src/styles/typeset.css#L105), `h1 + *, h2 + *, …`: **anything following a heading gets a 1em top margin**, whatever tag it is. A `div` next to an `h1` is not exempt just because typeset has no `div` rule. If a primitive puts a heading beside something else, it needs `not-typeset`, not an `mt-0` patch on the sibling. Add it to any new primitive built from bare `ul`/`li`/`p`/`h*`, otherwise it inherits bullets, indents and flow margins.
