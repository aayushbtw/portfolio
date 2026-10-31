---
title: Using orbit
description: What to type into orbit for each kind of work, how to steer a run, and how to set it up in a new project.
publishedAt: 2026-10-30
series: Orbit
part: 2
---

[Part 1](/writings/introducing-orbit) covers what orbit is and the loop every change goes through. This part is the day-to-day: what I type, how I steer a run, and how I'd set orbit up in a new project. [docs/usage.md](https://github.com/aayushbtw/orbit/blob/main/docs/usage.md) lists every command.

## Start every task the same way

```
/orbit:start <goal>
```

orbit reads the goal, picks a playbook and writes its steps as a todo list. You can watch it work through the list. A step it decides to skip stays on the list with the reason, so nothing gets dropped quietly.

The goal is plain English, and I give it the what, never the how. Most of mine are one lowercase line.

## What I type for each kind of work

- **Something broke.** `/orbit:start fix the flaky chat-scroll tests`. It reproduces the bug first, commits the failing repro, and only then writes the fix.
- **New behavior.** `/orbit:start share the asset card with /projects`. It reads the code around the change, sketches the shape, and builds it one piece at a time.
- **A question.** `/orbit:start why are we on this branch? do we have things to merge or pending?`. It answers with citations and changes nothing.
- **A decision I can't make on paper.** Put "sketch it to decide" or "mock it up" in the goal. It builds each option as throwaway code, shows me each one, recommends one and ships nothing.
- **Work across several PRs.** `/orbit:start multi-PR plan: <goal>`. It writes a checklist with one section per PR and waits for my go.
- **A list of independent changes.** `/orbit:start autopilot this queue: <items>`. Each item gets its own agent and worktree, and each one lands only after a verifier passes it.
- **Something I'll walk away from.** I end the goal with "take ownership, im stepping away". orbit logs every decision with its evidence, and a reviewer on a different model reads that log before the run hands back.

## Steer a run with a few words

- **"don't ship"** stops the change before it lands. Run `/orbit:ship` when you're ready, and a verifier checks it first.
- **"continue"** or **"do it"** picks the todo list back up. **"new task"** starts a fresh one.
- **"going to bed"** or **"don't stop"** keeps it running instead of pausing to ask.

To stop in the middle of a task, run `/orbit:pause-safely`. It finishes the current step, commits a work-in-progress checkpoint and writes a resume note. In a new session, `/orbit:session-pickup` reads that note and the git log and carries on without redoing finished work.

## Read the Next line

Every reply ends with one `Next:` line. It tells you where the run stopped, so you never have to guess.

- `Next: nothing pending.` The goal is done, and any change is on `main`.
- `Next: /orbit:ship` You said "don't ship", and the change is waiting for you.
- `Next: /orbit:start <follow-up>` The rest is outside the goal or needs your call. The reply says which.
- `Next: new session, then /orbit:session-pickup` The run paused.

## Ask about code without changing it

- `/orbit:how <subsystem>` explains how something works and where new code belongs.
- `/orbit:why <code or decision>` explains why code is the way it is, from git history and PRs.

## Set it up in a new project

I'd hand a project to orbit in small steps and take the next one only after the last has held up.

**1. One small bug, no landing.** Give it something low stakes and end the goal with "don't ship". Read the diff and the reply, then run `/orbit:ship` yourself.

**2. A verify skill.** Run `/orbit:create-verification-skill` once. It reads the repo and writes a skill that tells the verifier how to launch your app, check it's healthy, drive it, and clean up. Without one, the verifier falls back to a generic browser or terminal driver, which knows nothing about your app. With the skill in place, I stop adding "don't ship".

**3. A Workflow block for anything your project does differently.** orbit assumes [Vite+](https://viteplus.dev), runs `vpr check` before landing, and fast-forwards onto `main`. If your project differs, add a `## Workflow` block to its AGENTS.md with only the lines that differ.

```md
## Workflow

- Check: `vpr check`, plus `vpr e2e` when the UI changed.
- Land: `pr`
- Before code: `src/server/: node_modules/effect/AGENTS.md`
- Review also checks: `docs/architecture.md`.
```

- `Check` replaces the commands that must pass before anything lands.
- `Land: pr` makes orbit open a PR, take it through review comments and CI, and merge it once a verifier passes it. This is the one to use on a team.
- `Before code` names a guide for a path. Every agent writing code under that path reads it first.
- `Review also checks` names docs the plan reviewer reads.

**4. A queue.** Once single changes land cleanly, hand it a list with `autopilot this queue`. If you want to review before anything merges, say "build the stack, I'll land it" instead. orbit builds and verifies the same way, then hands you one stack of PRs to land with `/orbit:ship`.

[Part 3](/writings/what-the-verifier-caught) is a change that passed every test and still broke orbit, and how the verifier caught it.
