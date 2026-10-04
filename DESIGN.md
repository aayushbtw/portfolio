# Design

How this site is styled, and why.

Tokens live in [src/styles/tokens.stylex.ts](src/styles/tokens.stylex.ts). The global reset lives in [src/styles/reset.css](src/styles/reset.css). When this file and the code disagree, the code is right.

## Personality

Quiet, crisp, and finished. The page is near-monochrome, so the craft shows in the details: a press that gives, a hover that answers, an entrance that settles. Most of these go unnoticed one at a time. Together they are the point.

- Every animation has a reason: feedback, state, or keeping a change from jarring.
- Fast where the system responds, slower only where something is rare.
- Nothing appears from nowhere or moves without easing.

## Color

Tokens are named by role (`textMuted`, `fillSubtle`), never by hue, and valued by Radix gray step. A component asks for what it means, so a palette change is one file.

The accent is the brand color and is fixed; it never changes to fit a palette. It's near-black, not a hue, so color stays out of the way and type, spacing and motion carry the site.

## Surfaces

Edges are box-shadows, never `border`. Borders render unevenly across pixel densities and look muddy; a shadow stays crisp and takes no layout. Every edge comes from `shadows`: rings around cards, covers and popovers, inset lines for dividers and rules.

Fills are backgrounds only. An edge that needs a hover color composes `colors.edgeStrong` into an inset shadow in place.

## Focus

One keyboard-only ring for everything, set once in the reset. It is a strong gray, not the brand color, which reads too harsh at that weight. It sits offset from the element so it never fights a hover fill. Components don't style focus themselves.

## Type

Inter for everything, mono for code. Reach for color (`textSecondary`, `textMuted`) before a new size.

Line heights split by job: `row` for single-line UI, `prose` for paragraphs, `code` for blocks.

## Space

Every gap and padding comes from `space`. `layout` holds the page frame: one content column, a fixed gutter, and the same gap between sections.

## Motion

### Should it animate

Ask how often it's seen. Something hit dozens of times a day gets little or no motion; something rare, like the first page load, can take its time. Keyboard-initiated actions never animate.

### Easing

| Token       | For                                                          |
| ----------- | ------------------------------------------------------------ |
| `out`       | Entrances and presses: moves at once, so it feels responsive |
| `inOut`     | Things traveling across the screen: leave and arrive gently  |
| `overshoot` | Small elements that should feel alive                        |
| `ease`      | Color and hover changes (the CSS keyword, no token)          |

Never `ease-in`: it delays the moment the eye is watching.

### Duration

| Token     | For                                     |
| --------- | --------------------------------------- |
| `hover`   | Color changes on hover                  |
| `press`   | Scale on `:active`                      |
| `popover` | Small surfaces that open from a trigger |
| `enter`   | The first-load page entrance only       |

Interface motion stays under 300ms. `enter` breaks that on purpose: it plays once per visit.

### Press and hover

Pressables scale down on `:active`. The smaller the target, the bigger the give: a full-width row barely moves, so it doesn't visibly shrink.

A pressable that also changes color on hover transitions both, each on its own clock: color on `ease` + `hover`, transform on `out` + `press`.

### Entrances

Never from `scale(0)` or full transparency in place. Start close to the final state (a few px of translate, a slight scale) with opacity, so the element arrives rather than appears.

Page children stagger in. The first load uses `enter` and a long stagger; later navigations reuse the same motion, shorter and quicker, so moving around stays fast.

### Reduced motion

Fewer and gentler, not none. Under `media.reducedMotion`, entrances keep their fade and drop the movement, and things that travel or roll land instantly. Press feedback, small nudges and reveals that don't move (clip, stroke, progress) stay.

There is no global kill, so every new animation that moves something says what it does under `media.reducedMotion`. JS-driven motion (WAAPI, smooth scroll) checks the media query itself.

## Explorations

Explorations are built with the same tokens as the site. A value a demo needs that no token covers becomes a token if a second place could use it; otherwise it stays local and named.
