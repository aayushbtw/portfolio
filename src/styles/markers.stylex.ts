import * as stylex from "@stylexjs/stylex";

/* Markers name an element whose state a descendant styles against, through
   `stylex.when.ancestor`. They live here rather than beside the component that
   uses them because StyleX hashes them by module path, so they need a
   `.stylex.ts` file exactly as variables do.

   Each marker is a separate channel. `stylex.defaultMarker()` is already spent
   on `TextLink`, whose icon follows the link's hover, and a row contains links:
   sharing one marker would make hovering a link inside a row fade in the row's
   own trailing icons. */

export const rowMarker = stylex.defineMarker();
