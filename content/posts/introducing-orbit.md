---
title: Introducing orbit
description: A Claude Code plugin that holds the process, so a one-line goal is enough, and lands nothing until a second agent has run it.
publishedAt: 2026-10-30
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

## Every change goes through the same loop

Every task starts with one command and a goal.

```
/orbit:start <goal>
```

![You run /orbit:start with a one-line goal. Claude picks the playbook and makes a worktree. A fresh subagent writes one unit, Claude reviews and runs it, and the loop repeats for the next unit. Claude cleans up the diff, a verifier subagent that never saw the code runs it, and the change merges only on PASS.](/writings/orbit-flow.png)

1. **It picks a playbook.** orbit reads the goal and decides what kind of work it is, such as a bug, a feature, a refactor or a question. Each kind has its own steps. A bug is reproduced before anyone writes the fix. A slow page gets a baseline number before any change. A question gets a cited answer and no edits.
2. **It works in its own copy of the repo.** Each change gets its own git worktree, so several tasks can run at once without touching each other's files.
3. **A big plan gets a second opinion.** If the change adds a module or touches more than 3 files, a read-only reviewer checks the plan before any code exists.
4. **A fresh agent writes each piece.** The main chat does not write code. It hands one small piece at a time to a new agent, reads the diff, runs the project's checks and commits it before the next piece starts.
5. **It cleans the diff.** Before review, orbit strips AI slop and comments that only repeat the code.
6. **A verifier runs it before it lands.** Another new agent, one that cannot edit files, runs the change and the commit before it the way a user would, and returns pass or fail. A fail sends the work back.

Steps 4 and 6 are the point. The agent that wrote the code is the worst one to judge it. [Part 2](/writings/the-writer-never-checks-its-own-code) is about why, and about a bug that rule caught after the tests passed.

## It tries before it asks

When Claude is about to ask which approach I want, orbit's rules make it check whether running something would answer the question. On one run, a plan assumed subagents cannot start their own subagents. Instead of asking me, orbit tested it in an empty repo, had the answer 12 seconds later, and changed the plan.

## Most of orbit is pstack

Most of orbit is [pstack](https://github.com/cursor/plugins/tree/main/pstack), Lauren Tan's plugin built from the agent workflows Lauren uses every day at Cursor. orbit copies it at one fixed commit and ports it to Claude Code. It adds the `/orbit:start` command, rules loaded into every session, the plan reviewer, and landing by default. Every place orbit differs from pstack is listed with a reason in [docs/pstack-differences.md](https://github.com/aayushbtw/orbit/blob/main/docs/pstack-differences.md).

## Every change pays for the full loop

- **Claude Code only.**
- **Every change runs the full loop.** A one-line fix still gets a fresh agent, a review and a verifier.
- **It spends more tokens than a plain session.** Each piece and each verifier starts a new agent.
- **Routing is a rate.** A goal typed without `/orbit:start` goes through orbit most of the time, not every time. In one test it was 11 runs out of 12.

[Part 2](/writings/the-writer-never-checks-its-own-code) covers why the writer never checks its own code. [Part 3](/writings/using-orbit) covers what to type and how to set orbit up in a project. [Part 4](/writings/how-orbit-works) opens orbit up: the rules, the playbooks and the agents behind the loop.
