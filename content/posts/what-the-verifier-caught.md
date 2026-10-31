---
title: What the verifier caught
description: A change to orbit passed every test I had and still broke orbit for most goals. Only the agent that ran it like a user noticed.
publishedAt: 2026-10-30
series: Orbit
part: 2
---

The last step of every orbit change is a verifier. It's a new agent that didn't write the change and can't edit files. It runs the change the way a user would, next to the commit before it, and passes or fails it. [Part 1](/writings/introducing-orbit) covers the rest of the loop.

This is the run where that step earned its place.

## The change

On October 30 I had orbit update its own rules. Those rules live in one file, `rules.md`, and a hook prints it into every Claude Code session at startup. The change added rules ported from pstack, the plugin orbit is based on.

It passed every check I had. All 61 script tests passed, and so did `claude plugin validate`.

## What the verifier did

The verifier made a scratch repo with a small `cli.js`, loaded orbit, and gave Claude Code a plain goal with no orbit command in it.

```sh
claude -p "Add a --version flag to cli.js that prints the version from package.json." --plugin-dir <checkout> ...
```

The question was simple. Does a goal like that still go through `/orbit:start`? It ran the same goal against the old commit and the new one.

- **Old commit.** 3 runs out of 3 started with `/orbit:start`.
- **New commit.** 0 runs out of 6 did.

With the new rules, a plain goal never reached orbit's loop. No plan, no review, no verifier.

## Why it broke

Claude Code only puts about 10 KB of a hook's output into the session. Past that, the session gets a 2 KB preview. The new `rules.md` printed 12,609 characters, and the line that sends plain goals to `/orbit:start` sat at character 11,600, past the cut. Claude never saw it.

To rule out the new wording, the verifier trimmed a copy to 9,634 characters, under the limit. Routing came back in 2 runs out of 2. Its report said "Size is the cause, not the new wording."

<!-- ::chart name="orbit-hook-output" -->

## The fix

The fix prints `rules.md` through two hooks instead of one, each under the limit, and moves the routing line to the top.

A second verifier ran the same goal 12 times on the fix, and 11 started with `/orbit:start`. On the old commit it got 5 out of 9, so routing was never perfect. But 0 out of 6 meant it was broken, and the split brought it back.

<!-- ::chart name="orbit-routing" -->

## Why the tests missed it

None of my checks started a real session and typed a goal into it. They checked that the files said what I meant them to say, and they did. The bug was in what Claude actually received.

That's the gap the verifier is for. pstack's shipping playbook only counts a verdict from an agent that didn't write the code, "because an author checks what it meant to build." The author of this change had checked the rules it wrote. The verifier checked what a user would get.

## Still open

No test fails if either hook's output grows past the limit again. Until one does, the verifier is still the only thing that would catch it.
