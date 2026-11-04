---
title: Architecture
description: What is inside orbit. The rules every session loads, the playbooks that set the steps, and the agents that write, commit and verify the code.
publishedAt: 2026-11-04
series: Orbit
part: 4
---

orbit is almost all Markdown that Claude reads, in three kinds of file. Rules tell Claude when to reach for what, skills hold the steps for each kind of work, and agents do the jobs the main chat should not do itself. [Part 1](/writings/orbit-introduction) shows the loop they add up to, and [Part 2](/writings/orbit-principles) covers the ideas behind them.

## Rules load into every session

orbit's rules live in one file, `rules.md`. When a Claude Code session starts, a hook prints it into the session, so the rules apply without me typing anything.

The first line is the one that matters most. It sends any goal that does not name a skill through `/orbit:start`. That is why a goal typed with no command still runs through orbit.

The rest is a list of triggers and defaults:

- **Triggers.** Before writing code, name the data shape first. Before committing, run the cleanup skill. Before asking me which approach to take, check whether running something would answer it.
- **Delegation.** Which agent does which job, and when to start a fresh one.
- **Task end.** What counts as done, and what to pause for, such as deploys and deleting data.
- **The reply.** Short sentences, every claim backed by evidence, and one `Next:` line at the end.

Claude Code only keeps about 10 KB of a single hook's output, and `rules.md` is past that. So two hooks print it in two halves. Before the split, one change pushed the file over the limit and cut off the routing line. orbit then skipped plain goals in 6 test runs out of 6. Every test still passed, and only the verifier caught it.

## Skills hold the steps for each task

`/orbit:start` reads the goal and picks a playbook. A playbook is one Markdown file per kind of work, such as bug, feature, refactor, perf or investigate. Each one opens with a stance, lists numbered steps, and ends with what the final reply has to contain. The bug playbook, for example, has to reproduce the bug on the real app before anyone writes the fix.

Every playbook that changes code goes through the same four gates.

1. **Worktree.** Make a separate checkout before the first edit.
2. **Plan.** If the change adds a module or touches more than 3 files, get the plan reviewed.
3. **Delegate.** The main chat does not write code. A fresh agent writes each piece.
4. **Opening a PR.** Clean up the diff, then land it or open a PR.

Under the playbooks sit 24 principles, one skill each. [Part 2](/writings/orbit-principles#every-rule-has-a-name) covers how Claude uses them.

Around those are helper skills that playbooks call and I can run directly. `/orbit:how` and `/orbit:why` explain code. `/orbit:architect` sketches a design before code. `/orbit:interrogate` has two reviewers pick a change apart.

## Each agent has one job

The main chat plans, reviews and decides. Everything else goes to an agent with one job.

- **poteto-agent** writes the code, one piece per agent. The hardest pieces run on Opus, the rest on the session's model.
- **gitops** runs every commit, push and PR, on Sonnet. Git work is routine, so it does not need the bigger model.
- **advisor** is a read-only Opus agent that reviews big plans before any code exists.
- **comment-sicko** deletes comments that only repeat the code, before review.
- **verifier** runs the change before it lands. It has no Edit or Write tool and works in its own checkout. It runs the change and the commit before it the way a user would, then returns PASS, PASS+NOTES or FAIL.

Each new piece of work gets a fresh agent, never a resumed one. Instructions sent to an agent mid-run can get lost. A fresh agent gets one brief with everything it needs.

[Part 2](/writings/orbit-principles#a-different-agent-checks-each-change) explains why the writer, the reviewer and the verifier are always different agents.

## How orbit stays close to pstack

orbit started as a port of [pstack](https://github.com/cursor/plugins/tree/main/pstack), Lauren Tan's plugin, and I keep it close. orbit copies pstack at one fixed commit, `9580c23`. Every place orbit differs has a row in [docs/pstack-differences.md](https://github.com/aayushbtw/orbit/blob/main/docs/pstack-differences.md). Each row quotes pstack, says what orbit does instead and gives the reason.

The biggest differences are these.

- **Rules load on their own.** In pstack you type a command per task to load the rules. orbit prints them into every session.
- **One entry point.** `/orbit:start` picks the playbook, so I do not have to.
- **Extra agents.** pstack ships only the code writer and the comment cleaner. orbit adds gitops, the advisor and the verifier.
- **Landing by default.** A verified change lands unless I say "don't ship".

A rule with no source goes, even one I would like. Reading orbit against pstack by eye is not enough, so a script checks it. It fails on any orbit text that comes from a newer pstack than the pin, and on any quote in the differences doc that does not exist at the pin.

The source is all on [GitHub](https://github.com/aayushbtw/orbit). Start with `rules.md`, then the playbook for the kind of work you do most.
