# Design

How this site is styled, and why it is styled that way.

The code is the source of truth for values: [src/styles/app.css](src/styles/app.css) declares every token, [src/styles/typeset.css](src/styles/typeset.css) owns prose, and [src/routes/_app/route.tsx](src/routes/_app/route.tsx) owns the page frame. This file exists for the decisions those files cannot state: what a token is for, which of two plausible options was taken, and what was rejected so it does not get retried. When a number here disagrees with the CSS, the CSS is right. It carries no history: what changed, and when, is the commit log's job.

**It is not a component reference.** How a component works is the component's job, and a paragraph here restating it is a second copy to keep in step. A class that looks deletable and is not gets a one-line comment at its call site, where someone about to delete it will actually see it. Neither belongs here.

If a new page needs styling that is not described here, add a token or a `@utility` to app.css first, then use it.

## Rules

1. Tokens over values. No raw hex, no `text-gray-600`, no arbitrary spacing.
2. Repeated class strings become a `@utility`. Second time you write the same combo, define it.
3. Components own their own spacing. `List` ships with its own `mt`; callers do not pass one.
4. `cn()` is for merging a `className` prop, not for stacking string literals. A single static string means no `cn()`.
5. Semantic HTML first: `section`, `h1`/`h2`, `time`, `ul`/`li`. Styling hangs off the utility, not the tag.
6. No fixed width or height on a box holding text. Where a column repeats down a list, one grid owns it and the rows render as `display: contents`.
7. Inline sides are logical: `ps-`/`pe-`, `ms-`/`me-`, `start-`/`end-`, `text-end`. Physical `left`/`right` only for geometry that really is physical.

Rule 7 buys nothing today — the site is `lang="en"` with no i18n. It costs nothing either, and it is the kind of thing that is free now and a sweep later. The exceptions are the code block's line-number gutter and title bar, which read left to right whatever the page around them does, and the hover card's `data-[side]` slide, which is relative to its anchor.

## Colour

Every token is oklch, declared in `@theme`.

| Token | Use |
| --- | --- |
| `bg-1` | Page background |
| `bg-2` | Raised surface: hovered list item, inline code, meter track, skeleton |
| `bg-3` | Framed surface at rest: code block, the install block, a skill's body |
| `fg-1` | Every heading, the current crumb, a list item's title, a hover target. Solid black |
| `fg-2` | typeset's muted role — markers, captions, footnotes, strikethrough — and the same role in UI |
| `fg-3` | Labels and metadata |
| `fg-4` | What `body` sits at, and where copy lands |
| `border` | All borders and outlines |
| `border-strong` | One step darker, for a boundary that must read as a line: the prose link underline |
| `ring` | Focus ring. Points at `brand`, and is also typeset's variable name |
| `brand` | Orange. Accent only: link underline on hover, meter fills, eq bars |

**The alpha is in the token.** `fg-1`, `fg-2` and `fg-3` are black at 100%, 45% and 40%, so text composites onto whatever it sits on and a row reads the same over `bg-1` as over its `bg-2` hover. `fg-4` is the one solid grey, and it is out of numeric order on purpose: it is _darker_ than `fg-2` and `fg-3`, not lighter, because it is body copy and they are the quiet marks beside it. `bg-3` is the same trap on the other side: it is `gray-50` against `bg-2`'s `gray-100`, so it sits _between_ `bg-1` and `bg-2` and the number is not a position on a ramp. `bg-2` is what a surface lifts to under the pointer; `bg-3` is what a block sits at when nothing is happening.

Text sits at `fg-3` by default and steps **up** to `fg-2`/`fg-1` for emphasis. It never steps down, and never takes a second opacity on top of the token: `text-fg-3/60` is not a lighter grey, it is an unreadable one. Opacity on a _background_ (`bg-brand/20` on selection, `bg-bg-1/20` over the showcase) is fine.

**The mapping is attached to the tags.** typeset.css colours `p`, `h1`–`h6` and the rest directly, so a bare `<p>` or `<h2>` is already right with no utility on it. Only write `text-fg-*` when a tag has to depart from its default.

There is also a light-on-dark set — `bg-contrast`, `fg-contrast`, `fg-contrast-2` — declared and unused. Delete them or find them a home; do not invent a use for them to justify keeping them.

## Spacing

Six steps: **4, 8, 16, 24, 48, 96**. Doubling from `xs` to `md`, 1.5× to `lg`, doubling from there.

| Token | Value | Typically |
| --- | --- | --- |
| `xs` | 4px | Parts of one thing: an icon and its label |
| `sm` | 8px | A label and the content it labels, rows in a list |
| `md` | 16px | Sibling items, padding inside a container, the page margin |
| `lg` | 24px | Sections of a page, the chrome row |
| `xl` | 48px | Major blocks of a page, the gap under the chrome row |
| `2xl` | 96px | The page's bottom padding, the table of contents' sticky offset |

Nothing exists between the steps, so a gap that feels wrong is the wrong step, not a missing value. Reaching for `mt-7` means one of these is what you meant.

Two things sit outside the scale. **Zero** — `my-0`, `p-0` — because zero is not a step. And **optical nudges**, like the half-pixel lift on an inline icon in `icon-link`, which is alignment tuned to a glyph rather than spacing.

**Vertical rhythm comes from the relationship, not from one default gap.** A block that introduces itself with its own `h2` is a new section and takes the `xl` step; a block that continues the one above it takes `mt-lg`. The rule is checkable: if it has its own label, it gets the bigger step.

**`Page` owns the bigger step, so no route writes it.** It is a `flex flex-col gap-xl` around a page's top-level blocks, and a route that spells `mt-xl` between two sections is doing by hand what drifts. The smaller step stays a class, because it means something different: a continuing block is not a sibling of the section above it, it lives _inside_ that section. So a block that continues a section sits inside that section's own `<section>` with `mt-lg`, while two `<section>`s are siblings and get `xl` from the container. The rule stops being a number to remember and becomes where you put the markup.

Two things follow. A page with one section still gets a `Page`, so the second one lands right instead of arriving with a hand-written margin. And a page-level block with no heading of its own, like the usage page's "last updated" line, is still a sibling: a separate block, not a continuation.

```tsx
<Page>
  <section>
    <h1>{title}</h1>
    <List>…</List>
  </section>

  <section>
    <h2>Writings</h2>
    <PostList posts={posts} />
  </section>
</Page>
```

## Radius

Three steps, and which one you want follows from what the thing is.

| Token | Value | For |
| --- | --- | --- |
| `xs` | 4px | A box inset in an `md` frame: the install command, the skill body |
| `sm` | 6px | A control you press or type into: buttons, fields, covers, skeletons |
| `md` | 8px | A box that holds other things: rows, panels, media, tooltips |

**Nested radii are concentric: outer = inner + padding.** `xs` is derived from that, not a step for smaller controls. An `md` box padded by `xs` is 8px of radius around 4px of pad, which leaves its child 4px. Reach for `xs` only inside that frame; a control that happens to be small is still `sm`.

`rounded-full` is a shape and `rounded-none` is a reset, so neither is a step. The one true exception is the now-playing eq bars, which are 2px wide and would render as lozenges at any real radius.

`--radius` in `:root` points at `md`, and is what typeset reads for code blocks and tables.

## Type

**Four axes, two or three tokens each, and one default that everything inherits.** The default sits on `body` and is the only place any axis is set globally: `text-base font-normal leading-normal tracking-normal`.

| Axis     | Tokens                                                 |
| -------- | ------------------------------------------------------ |
| Size     | `text-base` · `text-sm`                                |
| Leading  | `leading-normal` · `leading-relaxed` · `leading-tight` |
| Tracking | `tracking-normal` · `tracking-tight`                   |
| Weight   | `font-normal` · `font-bold`, on `h1` and `strong`      |

Fonts are `font-sans` (Inter Variable) everywhere and `font-mono` (JetBrains Mono Variable) for code, with `body` setting the `cv01`/`ss03` features.

**Every one of those reuses a stock Tailwind name with the site's value behind it,** and that is deliberate. tailwind-merge groups a class by guessing from its name, so a bespoke `text-compact` reads as a _colour_ and is silently deleted by a `text-fg-4` beside it in `cn()`. Stock names group correctly for free. The spacing scale is the one exception, and it pays for that with an entry in `extendTailwindMerge` at [src/lib/utils.ts](src/lib/utils.ts).

**Leading defaults tight, not loose.** Almost everything here is one line long: a crumb, a list row, a stat, a label, a heading. A 24px line box around a single line is 24px of nothing, and it makes a column of rows read as loose rather than as a set. `leading-relaxed` is the opt-up, and typeset gives it to `p` — the one element that reliably wraps, where the extra leading is what makes the next line findable from the end of the last. `leading-tight` goes on `h1`, so a page title that wraps reads as one object rather than two lines.

Because those two differ, **anything that has to share a baseline with the title shares its leading.** A single-line label left as a `<p>` takes typeset's `leading-relaxed` and sits several pixels low.

**Leading is not bundled into the size tokens.** Either leading can sit on either size, so pairing them would have made the choice for you. A departure names the single axis it changes.

**Weight is not a hierarchy tool.** The scale has two weights and no more: `font-medium` does not compile, and neither does typeset's own 600/500 ladder. `font-bold` is 450, fifty units above `normal`, and that half-step is an optical correction rather than a step in a hierarchy. It has two users. On the `h1` it is what stops a page title from disappearing into copy it shares a size and a family with. On `<strong>` it is simply the only bold the scale has, the browser's 700 having been cleared with everything else. Reaching for it anywhere else is the signal that a colour step is not doing its job.

**`tracking-tight` belongs to lines that are read as objects, not as prose.** typeset puts it on every heading and on code; the one place it is written by hand is the date under a post's title, so those two lines read as one block. Body copy stays `tracking-normal`: tracking a wrapping paragraph fights the reading it is meant to help. A tracking curve corrects for size, and with one size there is nothing to correct.

The OG image at [src/routes/api/og.tsx](src/routes/api/og.tsx) renders at display sizes outside this system and keeps its own tracking, because Satori draws outside the token scale entirely and cannot read `@theme` at all.

`text-sm` is the secondary line: a list item's description, a meter legend, a post's date, the now-playing card, the trail. In every case it sits directly under or beside the thing it belongs to and is read _with_ it, never instead of it. Anything read on its own is `text-base`. The one element that sets its own size is `sup`/`sub`, which typeset keeps at `0.75em`: a footnote marker at full size stops reading as a marker.

### The scales are closed

Each axis is cleared with a `--<axis>-*: initial` reset before it is redeclared, so Tailwind's own steps do not survive: `text-3xl`, `tracking-wide`, `font-medium`, `rounded-3xl` and `xl:`/`2xl:` do not compile. The names the site _does_ declare keep working, and only those. Those resets live in a `@theme` block of their own, because a `*` reset has to come before what it clears. oxfmt leaves custom properties where they are, so the split is convention rather than compulsion.

**The one hole is `leading-<number>`.** It reads `--spacing`, not `--leading-*`, so `leading-6` compiles regardless, and clearing `--spacing` would take the spacing scale with it. That one is convention.

### What carries hierarchy instead

Colour, and one weight step that is really an optical correction.

| Role            | Treatment                           |
| --------------- | ----------------------------------- |
| Page title      | `h1` as typeset styles it. No class |
| Section label   | a bare `<h2>`. No class             |
| Field label     | `text-fg-3` written directly        |
| Everything else | body: `fg-4`                        |

Every heading is `fg-1` at body size and body weight, and separates from copy by colour alone: black against `fg-4`. The `h1` alone adds `font-bold`. To signal importance mid-text, step the colour up.

**Headings carry no class.** typeset gives them their colour and tracking, gives `h1` its weight and leading, and Tailwind's preflight already sets `h1`–`h6` to `font-size: inherit`. A page title is a bare `<h1>` and a section heading a bare `<h2>`, and both get it for free. A section heading is not uppercase and not tracked out — a label that shouts competes with the thing it labels, and the tag already carries the structure.

**There are no label utilities.** With size, weight and tracking out of the label treatment, any such name is a second name for `text-fg-3`, and a utility that expands to one declaration you could have written is indirection with nothing on the other end. Bring a name back when it earns more than one declaration.

**What this costs.** The 404 title, the usage stat values, and every caption, code block and footnote all sit at one size; captions and code separate by family, colour and rule instead. Pages here are short enough to take in at once, which is the bet the whole thing rests on. A page long enough to need scanning would need a second size in the copy itself, and that is the signal to add one rather than to work around its absence.

## Breakpoints

Three: `sm` 640, `md` 768, `lg` 1280. Tailwind's `xl` and `2xl` are cleared with everything else the theme closes, because a fourth width only ever undoes what a wrong third one did.

`lg` is the only one measured rather than inherited. It is where the page becomes three columns, and three columns need the content measure, two `xl` gaps, and two gutters wide enough to hold what goes in them. The binding one is the table of contents, which needs about 230px before its headings wrap; the trail can overflow into the empty cell beside it and does not count. That is why `lg` is 1280 and not Tailwind's 1024, where the layout switches on with 151px of gutter and wraps every heading in the table of contents to two lines.

## Page shape

The content column is `--container-content`, **644px**, used as `max-w-content` on `main` and as the middle track of the grid. That is about 86 characters at the body size, against the 60–68 prose conventionally wants, and it is deliberate. At 740 the eye hunts for the start of the next line; at 520, essentially the conventional target, the column reads too narrow next to the code blocks in a post. That second one is the binding constraint: nothing can escape this column, so every code fence shares the prose measure with the prose. 644 is where those two pressures balance. Narrowing it means first giving wide content a way to break out, and that has not earned its cost.

**One grid, and nothing in it is `fixed`.** [src/routes/_app/route.tsx](src/routes/_app/route.tsx) owns the frame: two rows at every width, three columns from `lg` collapsing to one below it. The trail is column one, the page is column two, the track and the table of contents are column three. The page is centred by the middle track sitting between two `1fr` gutters, not by a wrapper, and pages render only their sections.

Two rows rather than one because the first row's middle cell is empty: a trail longer than its gutter runs into it rather than onto the page. At `lg` the gutter and a full trail are within a few pixels of each other, so without somewhere to overflow, a long title eats its own last crumb to a `…`.

Nothing being `fixed` is the rule the rest follows from. Chrome pinned to the window has the page scrolling under it, and a screenshot passing beneath a line of dark text is unreadable however the band over it is drawn: a scrim cuts a white stripe across a post with an image in it. Chrome in a gutter cannot be scrolled under, so nothing has to be hidden and the blur at each end of the page column stays decoration.

**The one thing that reaches outside the frame** is the anchor offset. The blur band is 48px tall, so a heading jumped to from the table of contents would land underneath it, and headings with an `id` carry a `scroll-margin-block-start` in typeset.css to clear it. A decorative element generating a compensating rule in another file is accepted here: the band stays, so the rule stays with it.

**The nav is a trail, not a menu.** A site this small does not have sections to browse between — it has a home page that links to everything and pages that hang off it — so a persistent list of five destinations answers a question nobody asks. That rules out a sticky text rail down the side, and an icon capsule on mobile. The trail answers the one people do ask, which is where am I and how do I get back. The home page renders no trail at all: a single `Home` crumb pointing at the page you are on is a label, not navigation.

Nothing links across, so `G`+key is the only way from `/writings` to `/usage` without going home first. It is a keyboard affordance rather than the navigation: on a phone the way across is the home page.

**The now-playing card is the trail's mirror**, opposite gutter, same treatment. Its hover card is a cover, not a panel: the album art at full bleed with the track over it, dark in both themes because the surface being read against is a photograph, not the page. A scrim and a blur band both sit under the text, because a scrim alone still leaves a light cover's detail cutting through the words. Sampling the cover for a matched tint does not help once the blur is there, and costs a CORS dependency and an ink flip that picks wrong mid-luminance.

## Prose

There is no prose class. `typeset` sits on the shell in `_app/route.tsx`, so every page is prose by default: write plain `<p>`, `<h2>`, `<ul>`, `<table>` with no classes and they are styled. A paragraph on the home page and a paragraph in a blog post are the same paragraph.

[src/styles/typeset.css](src/styles/typeset.css) is vendored from [shadcn/typeset](https://ui.shadcn.com/docs/typeset) and **has been forked, not configured.** It owns rendered markdown end to end:

- Upstream's type declarations are stripped at the source — every `font-size`, `line-height`, `letter-spacing` and `font-weight` — with one survivor: `sup`/`sub` keeps its `0.75em`, and the `line-height: 0` that stops the raised glyph opening up its line box.
- It sets its own `--typeset-*` vars, pointed at the site's fonts.
- A block at the bottom holds what the site adds: the colour guide per tag, the `h1` treatment, `p` at `leading-relaxed`, links as `animated-link`, heading anchors, and the frame for TanStack Markdown's code title bar, line numbers and token colours.

That bottom block **must** stay in `@layer components` and after the vendored rules in source order. Same layer and later means it beats them, while a utility on the element still beats it; unlayered, it would outrank utilities instead.

app.css holds no `.typeset` selector at all. It is tokens, the shadcn `:root` aliases, `@utility` definitions and `@layer base`.

**Re-pulling the component from the registry undoes every change above.**

### Opting out

UI is not prose. A primitive that renders semantic tags for structure rather than reading carries `not-typeset` on its outermost node, so callers never think about it: `List`, `Install`, the table of contents' `ul`.

**`not-typeset` is narrower than its name.** Only the vendored block honours it — the exclusion is written into those selectors. The site's own block at the bottom of the file has no such guard, so its colour guide, `p` leading, link treatment and code sizing still reach into a `not-typeset` subtree. For the colour guide that is wanted: UI opts out of prose _layout_, never out of the colour guide. For `p` at `leading-relaxed` it is a trap: it is what puts the table of contents' heading out of line with the page title. Widening the guard would change every UI primitive at once and needs looking at surface by surface, not a blind sweep.

The other rule that catches people out is typeset's `h1 + *, h2 + *, …`: **anything following a heading gets a 1em top margin**, whatever tag it is. A `div` next to an `h1` is not exempt just because typeset has no `div` rule. If a primitive puts a heading beside something else, it needs `not-typeset`, not an `mt-0` patch on the sibling. A page header is the one place that wants the rule rather than an exemption: `PageDescription` is the `h1 +` sibling, and that 1em is the gap between a page title and its copy. `PageDescription` also tightens `--typeset-flow` to `sm`, so a title and its copy read as one block rather than as separated paragraphs.

## Utilities

Defined with `@utility` in app.css so they compose with variants and merge correctly.

| Utility | What it is |
| --- | --- |
| `skip-link` | Off-screen until focused, then a real target top-left. One per document |
| `animated-link` | Inline prose link: underline that turns `brand` on hover. Applied to every `a` inside `typeset`, so you rarely write it |
| `icon-link` | `animated-link` plus an inline icon before the label |
| `scroll-fade-end` | Fades the trailing edge of a horizontal scroller, and only when it actually overflows |
| `indicator-brand` | Brand fill for the table-of-contents indicator and meter segments, softened toward its bottom edge |

**A `@utility` earns its place two ways: it lands on tags the caller chooses, or it needs selectors a `className` cannot express.** `indicator-brand` sits on a nav span and a meter segment. That is the first kind. `icon-link` and `skip-link` each have a single call site and stay anyway: one needs descendant rules for its `svg`, the other a long `focus-visible:` chain, and a stylesheet says both better than JSX can.

Anything else belongs in the component that renders it. A utility whose only consumer is already a component — the eq bars, the table-of-contents indicator — is a second name for the same thing in a different file. The class list goes where the markup lives.

`indicator-brand`'s fade toward the bottom softens an edge and is not a data scale; do not flatten it.

There is one custom variant, `can-hover` (`@media (hover: hover)`), for showing at rest what hover would otherwise reveal. See the list-row model under **Interaction**.

## Components

`ui/` holds the primitives that carry no page knowledge: `Page`, `List` and its parts, `Meter`, `Skeleton`, `ProgressiveBlur`, `HoverCard`. One level up, `components/` holds the composed pieces that know what they are for: `Breadcrumbs`, `NowPlaying`, `Install`, `ShowcaseImage`, `PageDescription`, the lists, the table of contents.

**A wrapper that only renames a tag is not a component.** A `PageHeader` that renders a bare `div`, a `Showcase` that renders a bare `figure`: the import costs more than the markup it hides, and the `data-slot` it adds is not read by anything. Write the tag. A primitive earns its file by carrying classes, state or a contract.

Primitives carry `data-slot` attributes and accept `className` merged through `cn()`, which is how to ask for a shape their defaults do not cover — reach for it before adding a prop. Everything above `ui/` composes them and should not reach for raw layout classes a primitive already provides.

Primitives stay presentational. `Meter` takes shares already worked out; it does not reach into `usage.json` to compute them. When a figure needs page-specific arithmetic, do it in the route and pass the result down.

**A skeleton shares its container, it does not copy it,** and it is the same shape as the thing it replaces. You only ever see one of the two at a time, so a duplicated class string drifts without anyone noticing. Anything both need is a component.

### Dates

Every date is either a calendar day (`2026-03-27`) or a UTC instant. [src/lib/utils.ts](src/lib/utils.ts) parses **and** formats both in UTC through shared `Intl.DateTimeFormat` instances. Never call `toLocaleString` at a call site and never build a date string by hand: the server and the browser sit in different timezones, and a date-only string parsed locally drifts a day west of Greenwich.

## Interaction

- Hover is a colour or background change, at most 150ms, `ease-out`. Never a layout shift. It fires on every pass of the pointer, so anything slower reads as lag rather than as feedback.
- Press is `active:scale-[0.96]`, and only on a `button`. A link never scales: the target is a box of text, and a box that lurches reads as a glitch rather than as a press.
- Icons carry the optical weight of the text beside them: `weight="light"` against 400 copy, one library (`@phosphor-icons/react`), 16px unless the row says otherwise, and `currentColor` so hover and state come from CSS rather than a second asset. Phosphor draws filled paths rather than strokes, so weight selects a different path set instead of thinning one. **Import one icon per path**, `@phosphor-icons/react/CaretRight`: the package entry statically pulls all 1512, and dev serves modules unbundled with nothing tree-shaken, so the barrel is the difference between a 4s and a 16s first request. The five brand marks in [src/components/icons.tsx](src/components/icons.tsx) are hand-rolled SVGs and are not part of that library.
- An icon that swaps by state cross-fades instead of popping, with both icons mounted so the exit animates too. The copy button in `Install` is the reference. Motion is never the only channel, which is why the check mark also turns `brand`.
- Remote artwork carries a hairline ring of pure black at low alpha, never a tinted neutral, which picks up the surface underneath and reads as dirt on the image edge. Album covers, artist photos, the showcase screenshot.
- **One list-row hover model.** Every list row is a `ListItem` and lifts to `bg-2` on hover. `ListItem` is the anchor itself and `ListItemLink` its router twin, so the whole hovered box is what clicks rather than a link nested inside it. A surface has to be earned by communicating interaction, and a divider between rows is not earned when spacing already separates them. Secondary metadata fades in on row hover via `ListItemHover`, and shows at rest wherever there is no hover to fade it in: the `can-hover` variant gates the `opacity-0`. Tailwind already wraps `hover:` in that query, so a hover-only affordance is not subtle on touch, it is absent — and the arrow is the only signal that a project row leaves the site.
- Focus is a 2px `ring` outline at 2px offset, from a bare `:focus-visible` rule in `@layer base`. It hangs off the pseudo-class, not a utility, so nothing opts in and nothing can forget.
- Haptics (`useHaptics`) fire on nav clicks and on hover of the home page links. `tick` for hover, `click` for navigation.
- Numbers are always `tabular-nums`.
- All of the above is decoration. `prefers-reduced-motion: reduce` switches every animation and transition off outright rather than shortening it. Nothing sets `animation-fill-mode`, so each element settles on its base style.
