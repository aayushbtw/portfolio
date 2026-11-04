---
title: Usage
description: What to type into Orbit for each kind of work, the words that steer a run, what the Next line means, and how to hand Orbit a new project.
publishedAt: 2026-11-04
series: Orbit
part: 3
---

The words in your `/orbit:start` goal decide which steps run, whether the change lands, and whether Orbit stops to ask you. Orbit writes the steps as a todo list you can watch, and a step it skips stays on the list with the reason. [docs/usage.md](https://github.com/aayushbtw/orbit/blob/main/docs/usage.md) lists every command.

## The goal for each kind of work

- **Something broke.** `/orbit:start fix <what broke>`. It reproduces the bug before it writes a fix.
- **New behavior.** `/orbit:start add <what it should do>`. It reads the code around the change, sketches the shape, and builds it one piece at a time.
- **A question.** `/orbit:start <question>`. It answers with citations and changes nothing.
- **A decision you cannot make on paper.** Put "sketch it to decide" or "mock it up" in the goal. It builds each option as throwaway code, shows you each one, recommends one and ships nothing.
- **Work across several PRs.** `/orbit:start multi-PR plan: <goal>`. It writes a checklist with one section per PR and waits for your go.
- **A list of independent changes.** `/orbit:start autopilot this queue: <items>`. Each item gets its own agent and worktree, and each one lands only after a verifier passes it.
- **Something you will walk away from.** Say so in the goal. Orbit logs every decision with its evidence, and a reviewer on a different model reads that log before the run hands back.

## Steer a run with a few words

- **"don't ship"** stops the change before it lands. Run `/orbit:ship` when you are ready, and a verifier checks it first.
- **"continue"** or **"do it"** picks the todo list back up. **"new task"** starts a fresh one.
- **"going to bed"** or **"don't stop"** keeps it running instead of pausing to ask.

To stop in the middle of a task, run `/orbit:pause-safely`. It finishes the current step, commits a work-in-progress checkpoint and writes a resume note. In a new session, `/orbit:session-pickup` reads that note and the git log and carries on without redoing finished work.

## The Next line says where the run stopped

Every reply ends with one `Next:` line.

- `Next: nothing pending.` The goal is done, and any change is on `main`.
- `Next: /orbit:ship` You said "don't ship", and the change is waiting for you.
- `Next: /orbit:start <follow-up>` The rest is outside the goal or needs your call. The reply says which.
- `Next: new session, then /orbit:session-pickup` The run paused.

## Ask about code without changing it

- `/orbit:how <subsystem>` explains how something works and where new code belongs.
- `/orbit:why <code or decision>` explains why code is the way it is, from git history and PRs.

## Set up a new project in four steps

Take each step only after the last one has held up.

**1. One small bug, no landing.** Give it something low stakes and end the goal with "don't ship". Read the diff and the reply, then run `/orbit:ship` yourself.

**2. A verify skill.** Run `/orbit:create-verification-skill` once. It reads the repo and writes a skill that tells the verifier how to launch your app, check it is healthy, drive it, and clean up. Without one, the verifier falls back to a generic browser or terminal driver, which knows nothing about your app. With the skill in place, I stop adding "don't ship".

**3. A Workflow block for anything your project does differently.** Orbit assumes [Vite+](https://viteplus.dev), runs `vpr check` before landing, and fast-forwards onto `main`. If your project differs, add a `## Workflow` block to its AGENTS.md with only the lines that differ.

```md
## Workflow

- Check: `vpr check`, plus `vpr e2e` when the UI changed.
- Land: `pr`
- Before code: `src/server/: node_modules/effect/AGENTS.md`
- Review also checks: `docs/architecture.md`.
```

- `Check` replaces the commands that must pass before anything lands.
- `Land: pr` makes Orbit open a PR, take it through review comments and CI, and merge it once a verifier passes it. This is the one to use on a team.
- `Before code` names a guide for a path. Every agent writing code under that path reads it first.
- `Review also checks` names docs the plan reviewer reads.

**4. A queue.** Once single changes land cleanly, hand it a list with `autopilot this queue`. If you want to review before anything merges, say "build the stack, I'll land it" instead. Orbit builds and verifies the same way, then hands you one stack of PRs to land with `/orbit:ship`.

The source is on [GitHub](https://github.com/aayushbtw/orbit). Start with `rules.md`, then the playbook for the kind of work you do most.
