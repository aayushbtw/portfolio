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
| `fg-1`        | `h1`, active nav                                 |
| `fg-2`        | `h2`–`h6`, link text, list item titles           |
| `fg-3`        | `p`, labels, metadata. The default everything sits at |
| `border`      | All borders and outlines                         |
| `brand`       | Orange. Accent only: link underline hover, meters, eq bars |
| `graph-0`–`graph-4` | Contribution levels, empty to busiest      |

Text sits at `fg-3` by default and steps *up* to `fg-2`/`fg-1` for emphasis. It never steps down.

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

Note these read next to Tailwind's responsive prefixes, so `sm:mt-sm` is "8px top margin from the `sm` breakpoint up". The prefix is before the colon, the scale after it.

The scale is deliberately *narrower* than the spacing it replaced, which came from having no system. The old values were folded in by nearest step, ties rounding up: 12px and 20px went up to `md` and `lg`, 32px came down to `lg`, 40px went up to `xl`.

Two things sit outside the scale:

- **Zero.** `my-0`, `p-0` stay as they are. Zero isn't a step.
- **Optical nudges.** `[&_svg]:mb-0.5` in `icon-link` lifts an inline icon onto the text baseline. That's alignment, not spacing, and it's tuned to the glyph rather than to a scale.

Anything else in a `m-`, `p-`, or `gap-` slot comes from the table above.

Fonts: `font-sans` (Inter Variable) everywhere, `font-mono` (JetBrains Mono Variable) for code. Body sets the `cv01`/`ss03` features and weight 450 from `sm` up; size, leading and tracking all come from the text scale below.

## Type scale

Five steps, sharing the spacing scale's names and living in `@theme` alongside it.

| Token | Size | Leading | Use                                       |
| ----- | ---- | ------- | ----------------------------------------- |
| `xs`  | 12px | 20px    | Labels, captions, code, `text-eyebrow`    |
| `sm`  | 14px | 22.75px | Body, desktop                             |
| `md`  | 16px | 22.75px | Body mobile; page title; a figure worth reading first |
| `lg`  | 20px | 28px    | Display                                   |
| `xl`  | 30px | 36px    | Display                                   |

**A size token is the whole treatment.** Each carries its own `line-height` and `letter-spacing` (`-0.15px` throughout), so `text-xs` is complete on its own and never needs a `leading-*` beside it. Write the size, take the leading. If you catch yourself pairing a size with a hand-picked leading, that pair belongs in `@theme`, not at the call site.

Body is `text-md sm:text-sm`, so it's part of the scale rather than a special case: 16px on mobile, 14px from `sm` up. Both carry the same 22.75px line box, so vertical rhythm doesn't jump at the breakpoint.

That's why no `leading-[…]` or `tracking-[…]` exists anywhere. The one deliberate exception is `List`, which tightens to `leading-5`: list rows are scanned, not read.

**Size marks the page, not the prose.** There are three roles for it:

| Role            | Size                | Where                                        |
| --------------- | ------------------- | -------------------------------------------- |
| Page title      | `text-md`           | The `h1`. One per page, naming what you're on |
| Section label   | `text-eyebrow` (xs) | The `h2` above a list or block                |
| Everything else | body                | Copy, headings inside prose, list rows        |

Below the `h1`, size stops meaning anything. Headings *inside* an article are body size at weight 500 and separate from copy by *colour*, `h1` at `fg-1` and `h2`–`h6` at `fg-2`. Nothing in a paragraph flow goes above body size, and nothing is heavier than 500. To signal importance mid-text, step the colour up.

`text-eyebrow` is a label, never a title. It sits *above* content to name a section; it doesn't name the page.

**`lg` and `xl` are for figures and empty pages.** They go on the one element that *is* the page's subject where no prose competes with it: the usage page's token total, the 404's message. One per page. Never on a sentence, and never on something that repeats — the usage page's four stat values sit at `md` precisely because there are four of them and they're secondary to the total above.

Tailwind's own sizes are still generated alongside these, so `text-base` and `text-3xl` resolve to something even though they're outside the scale. The table is the contract; the build doesn't enforce it yet.

## Utilities

Defined with `@utility` in [src/styles/app.css](src/styles/app.css) so they compose with variants (`hover:`, `sm:`) and get merged correctly.

| Utility            | What it is                                                     |
| ------------------ | -------------------------------------------------------------- |
| `text-eyebrow`     | Section label: `fg-3`, xs, uppercase, wide tracking. The `h2` above a list or block, never the page title |
| `animated-link`    | Inline prose link: medium, `fg-2`, underline that turns `brand` on hover. Applied to every `a` inside `typeset`, so you rarely write it |
| `icon-link`        | `animated-link` + inline 16px icon before the label              |
| `row-link`         | Row layout inside a list item: `flex items-center gap-md`         |
| `nav-link`         | Sidebar / TOC link with active state and press scale             |
| `indicator-spring` | Springy sliding position indicator                               |
| `indicator-brand`  | Brand gradient fill for that indicator                           |
| `eq-bar`           | Animated equalizer bar (now-playing)                             |

## Page shape

`_app/route.tsx` owns the frame: centered, `max-w-7xl`, three columns on `lg` (`1fr / 740px / 1fr`) collapsing to a single column below `lg`. Pages render only their sections.

```tsx
<section>
  <h1 className="text-md">{title}</h1>
  <List>...</List>
</section>

<section className="mt-lg">
  <h2 className="text-eyebrow">Writings</h2>
  <ListPosts posts={posts} />
</section>
```

The home page is the one exception: its `h1` is the display name at base heading size with a paragraph stack under it, since it's the only page with a hero.

## Interaction

- Hover is a color or background change, 150–200ms, `ease-out`. Never a layout shift.
- Press is `active:scale-[0.96–0.99]`, scaled to element size. Small targets compress more.
- Lists dim: `group-hover/ul:opacity-40` on siblings, hovered item back to full. Secondary metadata (star counts, arrows) is `opacity-0` until row hover, via `ListItemHover`.
- Haptics (`useHaptics`) fire on nav clicks and on hover of the home page links. `tick` for hover, `click` for navigation.
- Numbers are always `tabular-nums`.

## Components

`ui/` holds the primitives (`List`, `ListItem`, `ListItemHover`, `NavList`, `Skeleton`, `ContributionGraph`, `ProgressiveBlur`). They carry `data-slot` attributes and accept `className` merged through `cn()`. Everything above `ui/` composes them and shouldn't reach for raw layout classes that a primitive already provides.

## Prose

There is no prose class. `typeset` sits on the shell in `_app/route.tsx`, so every page is prose by default: write plain `<p>`, `<h2>`, `<ul>`, `<table>` with no classes and they're styled. A paragraph on the home page and a paragraph in a blog post are the same paragraph.

```tsx
<section>
  <h1 className="text-balance">{post.title}</h1>
  <article>{post.mdx}</article>
</section>
```

[src/styles/typeset.css](src/styles/typeset.css) is vendored from [shadcn/typeset](https://ui.shadcn.com/docs/typeset) and never edited. It's configured in two places in [src/styles/app.css](src/styles/app.css):

- `:root` maps typeset's variable contract (`--typeset-*`, plus `--color-foreground`, `--color-muted-foreground`, `--color-muted`, `--radius`) onto the tokens above, so prose resolves to the site's colors and fonts.
- An `@layer components` block holds what typeset has no variable for: the color guide per tag, headings at `1em`/500, `strong` at 500, links as `animated-link`, and the frame for rehype-pretty-code's title bar and line numbers.

That block **must** stay in `@layer components`, imported after typeset.css. Same layer and later in source means it beats typeset's defaults; being below `@layer utilities` means a utility on the element still beats it. Unlayered would win over utilities and silently break every `text-eyebrow` heading.

### Opting out

UI is not prose. Any primitive that renders semantic tags for structure rather than reading carries `not-typeset` on its outermost node, which excludes its whole subtree, so callers never think about it: `List`, `NavList`, `ListPosts`, `ContributionGraph`, and the stat block on the usage page. Add it to any new primitive built from bare `ul`/`li`/`p`/`h*`, otherwise it inherits bullets, indents and flow margins.
