---
title: I ported pstack to Claude Code to stop driving every task by hand
description: Why orbit exists, what it takes from Lauren Tan's pstack, and what happens between the goal I type and the one line it ends on.
publishedAt: 2026-10-30
series: Orbit
part: 1
---

Claude Code wrote the code, and I did everything around it. Orbit started on October 9 as three slash commands for that work, in a repo I called claude-kit. `/handoff` wrote a `HANDOFF.md` with the goal, the files touched, what failed, the open decisions and the next three steps. Then it told me to run `/clear`, switch model, and open the next session with "read HANDOFF.md and continue". `/resume` read the note back, and `/commit` made the commit.

The commands made those steps faster, and I was still the one doing them. I picked the next step, carried the context from one session to the next, and decided when a change was ready to commit. A task moved only while I was there to move it.

What I wanted was to type a goal, walk away, and come back to one line that says what is left. Orbit does that now, and most of it is not mine.

## Most of orbit is pstack

[pstack](https://github.com/cursor/plugins/tree/main/pstack) is Lauren Tan's plugin for doing engineering work with agents. It has 58 skills and a playbook for each kind of task. Orbit is pstack ported to Claude Code. The flows that decide how a task runs, all 24 principles and the agent that writes the code are pstack's text, copied from one pinned commit.

pstack already runs in Claude Code through an adapter, if you type `/pstack:poteto-mode` for each task. Orbit loads the same rules at the start of every session instead, so I never have to remember a command. It swaps Cursor's cloud agents for Claude Code subagents in their own git worktrees. It also adds a few pieces pstack does not have, such as `/orbit:start`, a git agent and an advisor that reviews plans.

I adopted pstack's review and playbook steps on October 10 and credited Lauren Tan in the README that afternoon. Since then orbit has moved toward pstack, not away from it. [Part 5](/writings/copy-pstack-first) is about how.

## What happens after I type a goal

This is a prompt I typed on October 30.

```
/orbit:start close the remaining pstack-differences gaps (rules.md rows, pin vs newer-upstream text), then the portfolio docs series dont push portfolio docs without my approval ill check everything locally 1st.
```

Here is what orbit did with it, in order.

- It routed the goal to `/orbit:figure-it-out`, the flow for large work, which designs its own steps.
- Two read-only agents compared orbit with pstack in parallel, one for `rules.md` and one for the vendored files.
- The plan touched more than 3 files, so the advisor, a separate agent on Opus, read it before any code existed and approved it with changes.
- The work moved into its own git worktree, and my main checkout stayed as it was.
- Fresh agents wrote the rule and playbook changes one unit at a time. The main chat read each diff before the next agent started.
- A fresh auditor checked the result against pstack and found one contradiction and one dropped sentence. A fix round closed both.
- The verifier, an agent that wrote none of it, ran the change and returned FAIL. [Part 2](/writings/the-verifier-failed-it-anyway) is that story. After a fix and a second verifier run, orbit landed it on `main`.

The orbit half took 68 minutes from my prompt to `main`. The portfolio half stopped where I told it to, and the reply ended with this line.

```
Next: /orbit:start push the portfolio Orbit series (after you've reviewed it locally)
```

## Every task ends on one line

The `Next:` line is a status, not an offer. `Next: nothing pending.` means the work is done. `Next: /orbit:ship` means I said "don't ship", and the change is waiting for me. `Next: /orbit:start <follow-up>` means the rest is outside the goal or needs my call, as pushing did here. My own CLAUDE.md asks for the same line.

## Landing is the default

A change that passes the verifier lands without asking me. With no Land line in the project's AGENTS.md, orbit builds each change on a branch in its worktree and fast-forwards `main` to it once the verifier passes it. A project that lands through pull requests adds `Land: pr`, and orbit opens the PR, drives it to merge-ready and merges it. Putting "don't ship" or "I'll land it" in the goal stops the task at the branch or the PR.

pstack stops at the PR and waits. Landing by default is a difference I chose on purpose, and it only works because the verifier runs first.

## The rest of this series

- [Every check passed. The verifier ran it and failed it anyway.](/writings/the-verifier-failed-it-anyway) Why nothing lands until an agent that did not write it has run it.
- [Claude's plan said subagents could not nest. A 12-second test said they could.](/writings/a-12-second-test-beat-the-plan) How orbit answers its own questions by running code before it asks me.
- [My git agent pushed a half-finished rebase to main. pstack already had the rule.](/writings/half-a-rebase-on-main) Why the main chat does not write the code, and why every agent has a rule for when to stop.
- [I told Claude to stop inventing rules and copy pstack](/writings/copy-pstack-first). How orbit copies pstack at one commit, and what each difference has to prove.

## Install it

Run these inside Claude Code.

```
/plugin marketplace add aayushbtw/orbit
/plugin install orbit@orbit
```

Claude Code leaves auto-update off for third-party marketplaces. Turn it on in the Marketplaces tab of `/plugin`, or update by hand with `claude plugin update orbit@orbit`. Then give `/orbit:start` a goal you would normally walk Claude through one step at a time.
