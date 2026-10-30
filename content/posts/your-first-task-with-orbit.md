---
title: Your first task with orbit
description: One bug fix with orbit, from the goal you type to the line that says it landed, with every agent that writes, checks and lands the change.
publishedAt: 2026-10-30
series: Orbit
part: 2
---

Orbit is a Claude Code plugin that carries a goal to a landed change. This walkthrough fixes one bug with it, from the goal you type to the line that says the fix is on `main`. The bug is a common one. After sign-in, users land on the home page instead of the page they came from.

You type one line, and orbit runs the rest. It stops only for a decision that is yours to make.

## Type the goal, not the steps

```
/orbit:start after sign-in, users land on the home page instead of the page they came from
```

Orbit picks the `bug` flow, because the goal describes something broken. It opens a todo list with the bug playbook's gates and steps, copied in word for word, followed by Opening a PR and Shipping. Claude updates the list as each step finishes.

## The work moves into its own worktree

Before the first edit, the Worktree gate creates a git worktree named for the commit type and a short slug, such as `fix-login-redirect`. Claude renames its branch to `fix/login-redirect` and runs `vp install` when the project has a lockfile. The worktree lives under `.claude/worktrees/`, which orbit adds to `.git/info/exclude` so it stays out of `git status`.

Your main checkout stays as it was. A second session on another task gets its own worktree, so the two never share a checkout.

## Claude reproduces the bug before it touches code

The bug flow starts with a repro. Claude signs in the way a user would, with the project's `verify-*` skill if it has one, else `/orbit:control-ui` for a web app. It does this itself instead of asking you to.

Then it hunts for the cause. It lists hypotheses, gets runtime evidence for each, and rules them out until one is left. `/orbit:how` maps the auth code, and `/orbit:why` checks its history for a regression. Say the evidence points at a sign-in handler that drops the `next` query parameter.

## Big plans go to the advisor first

The Plan gate fires when a change adds a module or touches more than 3 files. Claude then briefs the advisor, a read-only agent on Opus, with the plan and the project's rules for those paths. The advisor answers proceed, proceed with changes, or stop, and Claude acts on the verdict.

This fix touches two files, the handler and its test, so it goes straight to the build.

## A fresh agent writes each unit

The main chat plans, reviews and verifies, but it does not write the code. Under the Delegate gate, a fresh `poteto-agent` writes each unit, one piece of the change that ends in a check. Its brief holds the worktree path, the files, the behavior to reach and the check that proves it.

The bug flow makes the failing repro its own unit. So the first agent adds a test that fails on the current code, and a second agent writes the fix. After each unit, Claude reviews the diff, confirms the agent changed only the files in its brief, and verifies it. Then `gitops`, a git agent on Sonnet, commits the unit by path, and only then does the next unit start. The history reads in order, the failing test first and the fix on top.

## Cleanup runs before the branch goes anywhere

With both units committed, Opening a PR runs `/orbit:deslop` to remove AI-generated slop from the diff. Then `/orbit:no-comments` has comment-sicko delete comments outside its keep list. An adversarial review, `/orbit:interrogate`, runs first only when the design is contested.

The project's Land line decides what happens to the branch. With no Land line, Land is `main`, so gitops pushes nothing and opens no PR. Under Land `pr`, gitops pushes the branch, opens a ready PR, and Babysit drives it to merge-ready. [Fit orbit to your project](/writings/fit-orbit-to-your-project) shows how to switch.

## A verifier that did not write the change runs it

Shipping comes next. Claude writes one paragraph on what the change should do and spawns a fresh `verifier` with it, along with the head and parent commits and the changed paths. The verifier works in its own worktree, with no Edit or Write tools.

It checks out the head commit and runs the change the way a user would. For this bug, that is a sign-in that starts on a page other than the home page. It runs the same steps at the parent commit and reports what differs. Its reply opens with `PASS`, `PASS+NOTES` or `FAIL`.

## The fix lands on main

On a pass, gitops rebases the branch onto `origin/main`. Claude runs the Check line in place of CI and checks that the patch-id still matches the one the verifier passed. Then gitops pushes the branch to `main`. Nothing pushed was rewritten, so the push needs no force. The worktree and the branch stay until you run `/orbit:worktree-cleanup`.

## Read the reply

The final reply says what was broken, the root cause, the fix and how Claude verified it, with the repro output pasted in, failing and then passing. It gives the verifier's verdict and what landed, and it ends with one line:

```
Next: nothing pending.
```

The fix is on `main`, and nothing is left. Had you added "don't ship" to the goal, the task would have stopped at the branch with `Next: /orbit:ship`. [Introducing orbit](/writings/introducing-orbit) lists the other `Next:` lines.

For your second task, pick a change that touches more than 3 files. The advisor then reviews the plan before any agent writes code.
