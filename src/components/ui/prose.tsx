/* The boundary between the two styling systems, and the only element that
   carries the `typeset` class.

   typeset.css styles rendered markdown through descendant selectors that StyleX
   cannot express, so it stays plain CSS on a plain class. What matters is the
   scope: the class belongs on the markdown subtree, not on the page shell. On
   the shell its prose defaults reached every UI element too, so components had
   to opt back out of discs, indents, underlines and inherited colour.

   Nothing here spreads `stylex.props`. Mixing a class string onto a StyleX
   element is the documented antipattern, and this component exists precisely so
   that no styled element has to. Layout around prose is the caller's job. */
export function Prose({ children }: { children: React.ReactNode }) {
  return <div className="typeset">{children}</div>;
}
