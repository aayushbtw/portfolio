---
title: Introduction
description: A Claude Code plugin that holds the process, so a one-line goal is enough. Nothing lands until a second agent has run it the way a user would.
publishedAt: 2026-11-04
series: Orbit
part: 1
---

In October I made 1,735 commits and merged 232 pull requests. A lot of that work started as a one-line goal typed into Claude Code.

Claude Code can't take one line that far on its own. It asks which approach I want when it could try both and look. Each of those questions is me reviewing its work, so when I stop answering, nothing reviews it. It calls a fix done because the tests pass, and it wrote those tests from the same plan as the code. An hour away leaves me a pile of changes to check myself.

[Orbit](https://github.com/aayushbtw/orbit) is the plugin I built to put that review back without putting me back in the loop. I say what I want and how I'll know it worked. Orbit picks the steps, and lands nothing until a second agent that never saw the plan has run the change the way I would.

```sh
claude plugin marketplace add aayushbtw/orbit
claude plugin install orbit@orbit
```

Then `/orbit:setup` reports each missing tool with its install command and checks the project. It changes nothing until I say yes.

## How a task runs

Every task starts with one command and a goal.

```
/orbit:start <goal>
```

![You run /orbit:start with a one-line goal. The lead picks the playbook and makes a worktree. A fresh subagent writes a unit, the lead reviews and runs it, gitops commits it, and the loop repeats. The lead cleans up the diff, a fresh verifier that never saw the plan runs it, the change lands only on PASS, and you get a Next: line.](/writings/orbit-flow.png)

1. **It picks a playbook.** Orbit reads the goal and decides what kind of work it is, such as a bug, a feature, a refactor or a question, and each kind has its own steps.
2. **It works in its own copy of the repo.** Each change gets its own git worktree, so several tasks can run at once without touching each other's files.
3. **A big plan gets a second opinion.** If the change adds a module or touches more than 3 files, a read-only reviewer called the advisor checks the plan before any code exists.
4. **A fresh agent writes each piece.** The lead, the chat that runs the playbook, does not write code. It hands one small piece at a time to a new agent, reads the diff and runs the project's checks. An agent called gitops commits it before the next piece starts.
5. **It cleans the diff.** Before review, a deslop pass removes AI-generated code slop, and an agent called comment-sicko deletes comments that only repeat the code.
6. **A verifier runs it before it lands.** Another new agent, one that works in its own copy and commits nothing, runs the change and the commit before it the way a user would, and returns pass or fail. A fail sends the work back.

Steps 4 and 6 matter most, because the agent that wrote the code is the worst one to check it.

## Rules, skills and agents

- **Rules.** `rules.md` holds triggers and defaults, such as naming the data shape before writing code and running the cleanup skill before a commit. Hooks print it into every Claude Code session, so the rules apply without a command. Its first line tells the lead to send any goal that names no skill through `/orbit:start`.
- **Skills.** Each kind of work has a playbook skill with numbered steps and a list of what the final reply must contain. Under them sit 24 principles, one skill each. Helper skills such as `/orbit:how`, `/orbit:why` and `/orbit:interrogate` run inside a playbook or on their own.
- **Agents.** Each agent in the steps above is one file that sets its tools and model. The advisor gets no edit tools, and the verifier can write only scratch files and commits nothing. The advisor runs on Fable, and gitops runs on Sonnet because git work does not need a bigger model. Each new piece of work goes to a fresh agent with one full brief, because instructions sent to a running agent can get lost.

Claude Code keeps only about 10 KB of one hook's output. When a change pushed `rules.md` past that, the routing line was cut off, and Orbit skipped goals typed without `/orbit:start` in 6 test runs out of 6. Every test still passed, and only the verifier caught it. The file now prints in three parts from three hooks.

## Built on pstack

Most of Orbit is [pstack](https://github.com/cursor/plugins/tree/main/pstack), Lauren Tan's plugin, built from the agent workflows they use every day at Cursor. Orbit copies it at one fixed commit, `e1cc031`, and ports it to Claude Code. The main differences:

- **Rules load on their own.** In pstack you type a command per task to load them.
- **One entry point.** `/orbit:start` picks the playbook.
- **Extra agents.** pstack ships the code writer and the comment cleaner. Orbit adds gitops, the advisor and the verifier.
- **Landing by default.** A verified change lands unless I say "don't ship".
- **A T3 Code adapter.** pstack's only adapter maps it to Claude Code. Orbit adds one for T3 Code, so a thread led by another provider can run it.

Every difference has a row in [docs/pstack-differences.md](https://github.com/aayushbtw/orbit/blob/main/docs/pstack-differences.md) that quotes pstack and gives the reason.

## Run on any provider in T3

Orbit also runs in a [T3 Code](https://github.com/pingdotgg/t3code) thread led by Claude or by another provider, such as Codex or Grok. Only a Claude lead gets `rules.md` from the hooks, so a lead on another provider loads it through orbit's `rules` skill. In a T3 thread, `/orbit:setup` asks once which providers fill a review panel's seat on another model family, and the same providers run the verifier before a change lands. With none listed, those seats stay on the lead's family. In live T3 runs, a Claude lead passed 16 of 16 scenarios, and a Codex lead passed 17 of 17 with its code children on gpt-6.1-sol.

## Limits

- **Only Claude and Codex leads are proven.** Every Grok run so far stopped on a usage error before the lead acted.
- **Every change runs the full loop.** A one-line fix still gets a fresh agent, a review and a verifier.
- **It spends more tokens than Claude Code without it.** Each piece and each verifier starts a new agent.
- **Routing is a rate.** A goal typed without `/orbit:start` goes through Orbit most of the time, not every time. In one test it was 11 runs out of 12.
