import type * as stylex from "@stylexjs/stylex";

/* `StyleXStyles` alone reads a two-element array as the
   `[CompiledStyles, InlineStyles]` pair rather than as two styles to merge, so
   composing two local styles fails to typecheck. Spelling the array case out
   separately keeps `style={[a, b]}` working. */
export type StyleProp =
  | stylex.StyleXStyles
  | ReadonlyArray<stylex.StyleXStyles | false | null | undefined>;

/* Applied to the element whose state a descendant watches through
   `stylex.when.ancestor`. It carries no styles of its own, which is why it is a
   prop rather than something passed through `style`. */
export type Marker = ReturnType<typeof stylex.defineMarker>;
