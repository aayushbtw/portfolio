---
title: Fit orbit to your project
description: How to change orbit's check command, land through pull requests, point code agents at a library's guide, and stop a task before it lands.
publishedAt: 2026-10-30
series: Orbit
part: 4
---

Orbit is a Claude Code plugin that plans, builds and lands a change from one goal. Its defaults assume a solo project on [Vite+](https://viteplus.dev) that lands straight onto `main`. When your project works differently, tell orbit once, in the project's AGENTS.md, instead of repeating it in every chat.

## Start from the defaults

With nothing configured, orbit works like this:

- The check runs `vpr check`, then `vpr build` and `vpr test` if those scripts exist.
- Land is `main`. Each change is built in a worktree under `.claude/worktrees/`, and Shipping fast-forwards `main` to it once the verifier passes it. No PR opens.
- `/orbit:interrogate` reviews a change before it ships when the design is contested.

## Add a Workflow block

Add a `## Workflow` block to the project's AGENTS.md. List only what differs from the defaults, and leave out the lines you do not need:

```md
## Workflow

- Check: `vpr check`, plus `vpr e2e` when the UI changed.
- Land: `pr`
- Before code: `src/server/: node_modules/effect/AGENTS.md`
- Review also checks: `docs/architecture.md`.
```

The template, with a note on each line, is [templates/workflow-block.md](https://github.com/aayushbtw/orbit/blob/main/templates/workflow-block.md) in orbit's repo.

## Change the check command

If your project checks with something other than `vpr check`, `vpr build` and `vpr test`, write it on the Check line. The template's examples are `vpr e2e` and knip. The flows' verify steps run this line. Under Land `main`, Shipping also runs it in place of CI.

## Land through pull requests

To land through PRs, add `Land: pr`. Opening a PR then has gitops push the task branch as `<type>/<slug>` and open a ready PR, never a draft. Babysit drives the PR to merge-ready through conflicts, review threads and CI.

Shipping then spawns the verifier, and gitops posts its verdict on the PR. On a pass, gitops merges with `gh pr merge` and the Land line's merge method, `--squash` by default. To merge another way, add the method to the Land line.

## Point code agents at a library's guide

If code under a path needs a guide, such as a library's agent docs, add it to the Before code line. Write one `<path>: <source>` entry per source, and separate entries with `;`. A source is a file to read, or a command that prints a skill or its path:

```md
- Before code: `src/server/: node_modules/effect/AGENTS.md`; `src/routes/: vpx @tanstack/intent@latest load @tanstack/react-start#react-start --path`
```

Claude copies the matching entries word for word into the brief of each agent that writes code under that path. The agent reads each file whole and runs each command before it writes a line. The plan gate reads the entries too, and so does `/orbit:interrogate`.

## Add docs for planning and review

Docs that matter when planning or reviewing a change, but not for every line of code, go on the Review also checks line. The plan gate reads them before a change that adds a module or touches more than 3 files, and `/orbit:interrogate` gets them at review. To scope one to a path, write it as `src/server/: <source>`.

This site's own AGENTS.md has one such line, `Review also checks: DESIGN.md`. A plan or review of a change here reads the design rules first.

## Write rules for one folder

Rules for one folder go in an AGENTS.md, or a CLAUDE.md, inside that folder. An example is a `src/server/AGENTS.md` that names a library's guide. The plan gate reads every such file in the folders a change touches and the folders above them. It also reads each `.claude/rules/` file whose `paths` match. A code agent that opens an AGENTS.md follows any "read X first" it gives.

If every agent that writes code under a path must read a guide, put it on the Before code line as well. That line reaches each agent by name, so no agent has to find the guide through an AGENTS.md pointer.

## Stop a task before it lands

A change task ships by default. To keep the landing for yourself, put "don't ship" or "I'll land it" in the goal:

```
/orbit:start add rate limiting to the upload endpoint, don't ship
```

Under Land `pr`, the task stops at the PR. Under Land `main`, it stops at the unpushed branch. The reply gives the PR URL, or the worktree path and branch, and ends with `Next: /orbit:ship`. Run `/orbit:ship` when you are ready. A fresh verifier still runs the change before it lands.

For a queue of changes, say "stack them, don't ship" or "build the stack, I'll land it". Orbit then builds and verifies one stack and never merges it. You land the stack with `/orbit:ship`.

## Move repeated corrections out of chat

If you tell Claude the same project rule twice, it belongs in this block or in a folder AGENTS.md. If Claude keeps making the same mistake anyway, run `/orbit:correct`. It removes the cause if it can, else adds a type or lint rule, a test or a doc line.
