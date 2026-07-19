# Design

How this site is styled. The home page ([src/routes/\_app/index.tsx](src/routes/_app/index.tsx)) is the reference implementation. If a new page needs styling that isn't described here, add it to [src/styles/app.css](src/styles/app.css) as a token or `@utility`, then use it here.

## Rules

1. Tokens over values. No raw hex, no `text-gray-600`, no arbitrary spacing. Use `bg-1`, `fg-3`, `border`, `brand`, `mt-section`.
2. Repeated class strings become a `@utility`. Second time you write the same combo, define it.
3. Components own their own spacing. `List` ships with `mt-2`; callers don't pass it.
4. `cn()` is for merging a `className` prop, not for stacking string literals. A single static string means no `cn()`.
5. Semantic HTML first: `section`, `h1`/`h2`, `time`, `ul`/`li`. Styling hangs off the utility, not the tag.

## Tokens

Defined in `@theme`, all in oklch.

| Token         | Use                                              |
| ------------- | ------------------------------------------------ |
| `bg-1`        | Page background                                  |
| `bg-2`        | Raised surface: hovered list item, inline code   |
| `fg-1`        | Primary text: headings, active nav               |
| `fg-2`        | Secondary text: link text, list item titles      |
| `fg-3`        | Body copy, labels, metadata. The default for prose |
| `border`      | All borders and outlines                         |
| `brand`       | Orange. Accent only: link underline hover, meters, eq bars |

Text sits at `fg-3` by default and steps *up* to `fg-2`/`fg-1` for emphasis. It never steps down.

Spacing tokens:

| Token                  | Value | Use                                    |
| ---------------------- | ----- | -------------------------------------- |
| `section`              | 24px  | Gap between page sections (`mt-section`) |
| `page-t`               | 96px  | Desktop page padding, sticky nav offset |
| `floating-nav-h/p/inset` | —   | Mobile nav sizing and page bottom inset |

Fonts: `font-sans` (Inter Variable) everywhere, `font-mono` (JetBrains Mono Variable) for code. Body sets `cv01`/`ss03`, `-0.15px` tracking, 15px mobile / 14px desktop.

## Utilities

Defined with `@utility` in [src/styles/app.css](src/styles/app.css) so they compose with variants (`hover:`, `sm:`) and get merged correctly.

| Utility            | What it is                                                     |
| ------------------ | -------------------------------------------------------------- |
| `text-eyebrow`     | Section label: `fg-3`, xs, uppercase, wide tracking. Every `h1`/`h2` that labels a section |
| `text-lede`        | Intro paragraph stack: `fg-3` + `space-y-1.5`                    |
| `animated-link`    | Inline prose link: medium, `fg-2`, underline that turns `brand` on hover |
| `icon-link`        | `animated-link` + inline 16px icon before the label              |
| `row-link`         | Row layout inside a list item: `flex items-center gap-4`         |
| `nav-link`         | Sidebar / TOC link with active state and press scale             |
| `indicator-spring` | Springy sliding position indicator                               |
| `indicator-brand`  | Brand gradient fill for that indicator                           |
| `eq-bar`           | Animated equalizer bar (now-playing)                             |
| `balance-spacing`  | `first:mt-0 last:mb-0`, for prose children                       |

## Page shape

`_app/route.tsx` owns the frame: centered, `max-w-7xl`, three columns on `lg` (`1fr / 740px / 1fr`) collapsing to a single column with a floating nav below. Pages render only their sections.

```tsx
<section>
  <h1 className="text-eyebrow">{title}</h1>
  <List>...</List>
</section>

<section className="mt-section">
  <h2 className="text-eyebrow">Writings</h2>
  <ListPosts posts={posts} />
</section>
```

The home page is the one exception: its `h1` is the display name at base heading size with a `text-lede` block under it, since it's the only page with a hero.

## Interaction

- Hover is a color or background change, 150–200ms, `ease-out`. Never a layout shift.
- Press is `active:scale-[0.96–0.99]`, scaled to element size. Small targets compress more.
- Lists dim: `group-hover/ul:opacity-40` on siblings, hovered item back to full. Secondary metadata (star counts, arrows) is `opacity-0` until row hover, via `ListItemHover`.
- Haptics (`useHaptics`) fire on nav clicks and on hover of the home page links. `tick` for hover, `click` for navigation.
- Numbers are always `tabular-nums`.

## Components

`ui/` holds the primitives (`List`, `ListItem`, `ListItemHover`, `NavList`, `Skeleton`, `ContributionGraph`, `ProgressiveBlur`). They carry `data-slot` attributes and accept `className` merged through `cn()`. Everything above `ui/` composes them and shouldn't reach for raw layout classes that a primitive already provides.

Content pages are styled by `.prose` in [src/styles/content.css](src/styles/content.css), not by utilities in MDX.
