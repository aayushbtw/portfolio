---
title: Introducing orbit
description: A Claude Code plugin that takes a goal, builds it in its own worktree, and lands it only after a separate agent has run the change.
publishedAt: 2026-10-30
series: Orbit
part: 1
---

[Orbit](https://github.com/aayushbtw/orbit) is a Claude Code plugin that turns a one-line goal into a landed change. It picks a flow for the goal, builds the change in its own git worktree, and has a separate agent run it the way a user would. Only a change that agent passes gets landed. You name the goal and read one line at the end.

Orbit is mostly [pstack](https://github.com/cursor/plugins/tree/main/pstack) by Lauren Tan, trimmed and ported to Claude Code. Its flows and all 24 of its principles come from pstack. [How orbit decides](/writings/how-orbit-decides) covers where the two differ.

Install it from inside Claude Code:

```
/plugin marketplace add aayushbtw/orbit
/plugin install orbit@orbit
```

Installing orbit leaves your own `CLAUDE.md` and `settings.json` alone. Its rules load on their own at the start of every session.

## Turn on auto-update

Claude Code leaves auto-update off for third-party marketplaces, so orbit stays on the version you installed. To get new versions as they ship, run `/plugin`. Open the **Marketplaces** tab and select `orbit`. Then choose **Enable auto-update**.

To update once by hand, run this in a terminal:

```sh
claude plugin update orbit@orbit
```

## What happens when you name a goal

Give `/orbit:start` the goal, not the steps:

```
/orbit:start fix the login redirect bug
```

You can also type the goal on its own. The rules that load with each session send any goal that names no skill through `/orbit:start`.

Orbit reads the goal and picks a flow. A question with no code change gets `investigate`, which answers with citations and stops. Something broken gets `bug`, and new behavior gets `feature`. Large or cross-cutting work goes to `/orbit:figure-it-out`, which designs its own steps. [Every orbit command](/writings/every-orbit-command) lists all the flows.

The flow's steps become a todo list that Claude works through in order. A step it chooses not to do stays on the list as `skip: <reason>`, so nothing drops out where you cannot see it.

For a change, the main chat plans, reviews and verifies, but it does not write the code. A fresh agent writes each unit, and a git agent commits the unit once the review passes. When the last unit is in, a fresh verifier runs the change, and orbit lands it only on a pass. [Your first task with orbit](/writings/your-first-task-with-orbit) follows one bug through every step.

Landing is the default. Put "don't ship" or "I'll land it" in the goal, and the task stops before it lands.

## Read the `Next:` line

Every task ends with one `Next:` line. Do what it says.

- `Next: nothing pending.` means the task is done.
- `Next: /orbit:ship` means you said "don't ship", so the PR or the unpushed branch is waiting. Run it to verify and land the change.
- `Next: /orbit:start <follow-up>` means the follow-up is outside the goal or needs your decision. Claude says which.
- `Next: new session, then /orbit:session-pickup` means the work was paused. Open a new session and run it.

## Who the defaults fit

Orbit is for people who already use Claude Code and want it to carry a whole task on its own. The defaults fit a solo project. They assume [Vite+](https://viteplus.dev) for the check command, a worktree per change, and a fast-forward onto `main` with no pull request.

A project that works differently lists only what differs, in a `## Workflow` block in its AGENTS.md. A team that lands through pull requests adds one line, `Land: pr`. [Fit orbit to your project](/writings/fit-orbit-to-your-project) covers every line the block takes.

## Start with a bug you would fix by hand

The first task tells you the most when it is small. Give `/orbit:start` a bug you would normally fix yourself in a few minutes. Follow the todo list as it runs, then compare its fix with the one you had in mind. The full reference lives in [docs/usage.md](https://github.com/aayushbtw/orbit/blob/main/docs/usage.md).
