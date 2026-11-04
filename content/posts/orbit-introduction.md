---
title: Introduction
description: A Claude Code plugin that holds the process, so a one-line goal is enough. Nothing lands until a second agent has run it the way a user would.
publishedAt: 2026-11-04
series: Orbit
part: 1
---

In October I made 1,735 commits and merged 232 pull requests. A lot of that work started as a one-line goal typed into Claude Code.

Plain Claude Code can't take one line that far. It says a fix works because the tests pass. It asks me which approach I want when it could try both and look. And if I leave it alone for an hour, I come back to a pile of changes I now have to check myself.

[orbit](https://github.com/aayushbtw/orbit) is the plugin I built to fix that. It moves the process out of my prompt and into the plugin. I say what I want and how I'll know it worked. orbit decides the steps, and lands nothing until a separate agent has run the result the way I would.

```sh
claude plugin marketplace add aayushbtw/orbit
claude plugin install orbit@orbit
```

## How a task runs

Every task starts with one command and a goal.

```
/orbit:start <goal>
```

![You run /orbit:start with a one-line goal. Claude picks the playbook and makes a worktree. A fresh subagent writes one unit, Claude reviews and runs it, and the loop repeats for the next unit. Claude cleans up the diff, a verifier subagent that never saw the code runs it, and the change merges only on PASS.](/writings/orbit-flow.png)

1. **It picks a playbook.** orbit reads the goal and decides what kind of work it is, such as a bug, a feature, a refactor or a question. Each kind has its own steps. A bug is reproduced before anyone writes the fix. A slow page gets a baseline number before any change. A question gets a cited answer and no edits.
2. **It works in its own copy of the repo.** Each change gets its own git worktree, so several tasks can run at once without touching each other's files.
3. **A big plan gets a second opinion.** If the change adds a module or touches more than 3 files, a read-only reviewer called the advisor checks the plan before any code exists.
4. **A fresh agent writes each piece.** The main chat does not write code. It hands one small piece at a time to a new agent, reads the diff and runs the project's checks. An agent called gitops commits it before the next piece starts.
5. **It cleans the diff.** Before review, orbit strips AI slop, and an agent called comment-sicko deletes comments that only repeat the code.
6. **A verifier runs it before it lands.** Another new agent, one that cannot edit files, runs the change and the commit before it the way a user would, and returns pass or fail. A fail sends the work back.

Steps 4 and 6 matter most, because the agent that wrote the code is the worst one to check it. [Part 2](/writings/orbit-principles) explains why.

## What orbit is made of

orbit is almost all Markdown that Claude reads, in three kinds of file.

- **Rules.** `rules.md` holds triggers and defaults, such as naming the data shape before writing code and running the cleanup skill before a commit. A hook prints it into every session, so the rules apply without a command. Its first line sends any goal that names no skill through `/orbit:start`.
- **Skills.** Each kind of work has a playbook skill with numbered steps and a list of what the final reply must contain. Under them sit 24 principles, one skill each. Helper skills such as `/orbit:how`, `/orbit:why` and `/orbit:interrogate` run inside a playbook or on their own.
- **Agents.** Each agent in the steps above is one file that sets its tools and model. The verifier and the advisor get no edit tools. The hardest code runs on Opus, and gitops runs on Sonnet because git work does not need a bigger model. Each new piece of work goes to a fresh agent with one full brief, because instructions sent to a running agent can get lost.

Claude Code keeps only about 10 KB of one hook's output. When a change pushed `rules.md` past that, the routing line was cut off, and orbit skipped plain goals in 6 test runs out of 6. Every test still passed, and only the verifier caught it. The file now prints in two halves from two hooks.

## It runs a test instead of asking

When Claude is about to ask which approach I want, orbit's rules make it check whether running something would answer the question. On one run, a plan assumed subagents cannot start their own subagents. Instead of asking me, orbit tested it in an empty repo, had the answer 12 seconds later, and changed the plan.

## Built on pstack

Most of orbit is [pstack](https://github.com/cursor/plugins/tree/main/pstack), Lauren Tan's plugin built from the agent workflows Lauren uses every day at Cursor. orbit copies it at one fixed commit, `9580c23`, and ports it to Claude Code. The main differences:

- **Rules load on their own.** In pstack you type a command per task to load them.
- **One entry point.** `/orbit:start` picks the playbook.
- **Extra agents.** pstack ships the code writer and the comment cleaner. orbit adds gitops, the advisor and the verifier.
- **Landing by default.** A verified change lands unless I say "don't ship".

Every difference has a row in [docs/pstack-differences.md](https://github.com/aayushbtw/orbit/blob/main/docs/pstack-differences.md) that quotes pstack and gives the reason. A script fails on any orbit text taken from a newer pstack than the pin, and on any quote in that doc that pstack does not contain.

## Limits

- **Claude Code only.**
- **Every change runs the full loop.** A one-line fix still gets a fresh agent, a review and a verifier.
- **It spends more tokens than a plain session.** Each piece and each verifier starts a new agent.
- **Routing is a rate.** A goal typed without `/orbit:start` goes through orbit most of the time, not every time. In one test it was 11 runs out of 12.

[Part 2](/writings/orbit-principles) covers the principles behind it. [Part 3](/writings/orbit-usage) covers what to type and how to set orbit up in a project.
