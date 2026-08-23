<!-- intent-skills:start -->
## Skill Loading

Before editing files for a substantial task:
- Run `pnpm dlx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `pnpm dlx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

## Comments

`DESIGN.md` is where the *why* lives. A code comment is not, and duplicating one
there is how it goes stale.

Before writing a comment, apply one test: **would someone who has read
`DESIGN.md` delete this line, thinking it is wrong or redundant?** If no, the
code says it already. Write nothing.

That leaves comments for lines that look deletable and are not: a `display:
contents`, a `margin-block-start: 0` undoing a vendored rule, keyframes that
hold one value, a constant duplicated from a token Tailwind won't expose.

Never write history. "Was sized for English", "had drifted", "zeroed for the
same reason": how the code got here belongs in the commit message, and what it
means for the system belongs in `DESIGN.md`.

One line by default. If it needs a paragraph, it is a `DESIGN.md` edit.
