---
title: How orbit decides
description: The rules orbit loads every session, the principles behind its choices, the verifier that gates every landing, and where orbit departs from pstack.
publishedAt: 2026-10-30
series: Orbit
part: 5
---

Orbit, a Claude Code plugin that takes a goal to a landed change, makes most of its choices without asking you. Each choice traces to a file in the plugin. A rules file loads every session, 24 principles fire on named triggers, and a verifier that never wrote the code decides what lands.

## The rules load before you type anything

Orbit's rules live in `rules.md`. Two SessionStart hooks print it at the start of every session, so the rules hold without you remembering a command. It takes two hooks because Claude Code inlines only about 10 KB of output per hook.

The first line sends any goal that names no skill through `/orbit:start`. The rest sets how every task behaves:

- Before Claude asks you "which approach", it checks whether running something could answer the question, such as a timing, a layout or an output. If so, it builds a throwaway prototype and lets the result decide.
- Claude pauses for irreversible writes, which are force-pushes to shared branches, deploys, data deletion and customer messages. It also pauses for a product call that is yours. Pushing, merging and opening PRs do not count as irreversible.
- Claude finishes every follow-up inside the goal. It lists anything outside the goal and does not build it.

## Principles fire on triggers

The playbook holds all 24 of pstack's principles, in pstack's five groups. Each principle names the situation that triggers it, and Claude reads its full text only when that trigger fires. Two examples:

- Attack the premise fires when two fixes that share one premise have failed the same gate. Claude writes the premise down and tests it before it writes another fix.
- Prove it works fires before Claude calls a task done. It verifies against the real artifact, not "it compiles".

The reply names each principle that shaped a decision and the choice it changed. It cites only principles whose full text Claude read that session. You can steer with the names, as in "apply subtract before you add".

Stack rules work the same way for a language. Before Claude writes a `.ts` or `.tsx` file, it reads orbit's TypeScript rules. TypeScript is the one stack orbit has rules for.

## The verifier decides what lands

Shipping spawns a fresh `verifier` for each change, in its own worktree and with no Edit or Write tools. It checks out the head commit, runs the change the way a user would, does the same at the parent commit, and reports what differs. Its reply opens with `PASS`, `PASS+NOTES` or `FAIL`.

Two rules give that verdict its weight. Only an agent that did not write the code can give it, because an author checks what it meant to build. Green CI and an approving bot review never count, because neither runs the change as a user would.

The verifier drives the change through the project's `verify-*` skill when there is one, else `/orbit:control-ui` or `/orbit:control-cli`. Its verdict covers a patch, not a commit. If a branch is rebased after its verdict, Shipping compares patch-ids before it trusts the old verdict.

The verifier is why landing can be the default. A change that ships without asking you has still been run by an agent that did not build it.

## What runs in the background

Five agents do work you do not see:

- `poteto-agent` writes the code for each unit, on Opus for the hardest changes and on your session's model for the rest. The agent that wrote the code never reviews it.
- `gitops` runs on Sonnet and handles commits, pushes, PRs and merges.
- `comment-sicko` deletes comments outside its keep list before review.
- `verifier` runs on your session's model and gates every landing.
- `advisor` runs on Opus and only reads. It reviews plans at the plan gate, and you can ask for it at any other time.

`poteto-agent` and `comment-sicko` run only inside a flow you start. The verifier runs only inside Shipping and the two autopilot flows. `/orbit:how`, `/orbit:why` and `/orbit:arena` also run inside flows. Commands such as `/orbit:correct`, `/orbit:reflect` and `/orbit:recall` run only when you type them.

## Where orbit departs from pstack

Orbit copies pstack, the project it is ported from, at commit 9580c23, and records each difference with its reason. The main kinds:

- **Rules load on their own.** pstack on Claude Code needs `/poteto-mode` typed for each task. Orbit prints its rules every session, so routing lives in the rules.
- **Orbit adds two agents.** An Opus advisor reviews plans at the plan gate, and `gitops` makes every commit, push and forge write. pstack has neither.
- **Changes land on main.** pstack lands every change through a PR. Orbit's default Land is `main`, and `Land: pr` keeps pstack's PR path.
- **Tasks ship by default.** A pstack task ends at Opening a PR. An orbit change goes on through Shipping once the verifier passes it.
- **Claude models only.** pstack's defaults pair Opus with Grok. Orbit uses Opus for the hardest code and your session's model for the rest. In an Opus session, the `/orbit:interrogate` reviewers and the `/orbit:arena` runners all run on Opus, so they lose their model diversity.
- **Cursor pieces are swapped or dropped.** The verifier is a Claude Code subagent in a worktree, not a Cursor cloud agent. `gh` is the only forge, and seven pstack playbooks, among them Orchestrate and Eval, are not ported.

The full table, with the reason for each row, is in [docs/pstack-differences.md](https://github.com/aayushbtw/orbit/blob/main/docs/pstack-differences.md).

One upstream rule is left out on purpose. After the pinned commit, pstack added a rule to restate the user's goal first. Orbit tracks the pin, so that rule waits until orbit moves to a newer pstack commit.
