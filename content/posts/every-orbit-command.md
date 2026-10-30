---
title: Every orbit command
description: Each orbit command in one line, grouped by what you want to do. Run a task, understand code, improve Claude, prove a change works, or stop and resume.
publishedAt: 2026-10-30
series: Orbit
part: 3
---

Orbit is a Claude Code plugin that runs a task from goal to landed change. These are all of its commands, grouped by what you want to do. For most work you need only `/orbit:start <goal>`, which picks the flow and the steps and routes to many of the commands below.

## Run a task

- `/orbit:start <goal>` runs any new task, such as a bug, a feature, a refactor or a slow path. It also answers a question with no code change.
- `/orbit:start <goal>, don't ship` builds a change and stops before it lands. "I'll land it" works the same way.
- `/orbit:playbook <flow>` runs one flow by name, or shows only its step list. The next section lists the flows.
- `/orbit:playbook hillclimb` improves one metric over many rounds, toward a target. `/orbit:start` with a metric goal routes there too.
- `/orbit:figure-it-out <goal>` takes large or cross-cutting work, or work you step away from, and designs its own steps. `/orbit:start` routes there too.
- `/orbit:start autopilot this queue: <items>` runs a queue of independent changes to merged, with one owner per item.
- `/orbit:start build the stack, I'll land it: <items>` builds and verifies a queue as one stack that you land.
- `/orbit:start multi-PR plan: <goal>` writes a plan for work that spans phases or several PRs, then stops. The plan runs on your go.
- `/orbit:playbook babysit` gets an open PR green, answers its review threads, or checks its status. `/orbit:start` routes "babysit this" there.
- `/orbit:ship` lands a change that is ready. A fresh verifier runs the change first.
- `/orbit:show-me-your-work` keeps a decision trail for a long or unattended run that you will review later.
- `/orbit:ketchup` catches you up on what changed since your last message.
- `/orbit:worktree-cleanup` prunes merged or abandoned worktrees and stale iOS simulators when disk is tight.

## Flows that /orbit:playbook runs

`/orbit:start` picks a flow from the goal, so you name one only to run it directly.

- `investigate` answers a read-only question with citations. No commit, no PR.
- `bug` reproduces a reported defect, finds the root cause, and fixes it with runtime evidence.
- `feature` builds new or changed behavior from a named data shape.
- `refactor` changes structure or shape and keeps behavior the same.
- `prototype` builds a throwaway sketch to settle a design or behavior question, and ships nothing.
- `perf` traces a measured slowness and improves it against a baseline.
- `hillclimb` improves one metric against a target in measured rounds, with one commit per accepted win.
- `autopilot-full` runs a queue of independent PRs to merged, with one owner per PR.
- `autopilot-stack` builds a queue into one linear stack of PRs that you land.
- `multi-phase-plan` writes a plan for work that spans phases or stacked PRs.
- `opening-a-pr` runs at the end of every other flow.
- `babysit` drives a PR or a stack to merge-ready, through conflicts, review threads and CI.
- `shipping` verifies each change independently, then lands the verified run bottom-up. `/orbit:ship` runs it.

## Understand code

- `/orbit:how <subsystem>` explains how a subsystem works and where new code belongs, from parallel read-only explorers.
- `/orbit:why <code or decision>` explains why code is the way it is, from git, PRs and connected MCP servers, with cited findings.
- `/orbit:architect <what>` sketches types, signatures and module structure from two parallel design runners, then builds against the chosen sketch.
- `/orbit:arena <task>` runs several attempts at one artifact, picks a base, and grafts in the strongest parts of the others.
- `/orbit:interrogate` runs an adversarial review of a change, with one reviewer per model. It never applies a fix on its own.
- `/orbit:swarm <job>` fans out parallel workers for coverage, races or exploration, and returns one report.
- `/orbit:recall [topic]` rebuilds your recent working context across sessions.

## Improve Claude

- `/orbit:correct <mistake>` turns a mistake Claude repeats into a lasting guard, at the highest level that works. It removes the cause if it can, else adds a type or lint rule, then a test, then a doc line.
- `/orbit:reflect` has three reviewers read the whole session and proposes skill edits, which you approve. Items that a lint or check would enforce better come back as `/orbit:correct` candidates.
- `/orbit:automate-me` turns your working style into a `-mode` skill.

## Prove a change works

- `/orbit:create-verification-skill` runs once in a project that users can run or install. It writes `.claude/skills/verify-<app>/`, a skill that drives the app the way a user does, with a feature map. The verifier uses it on every change.
- `/orbit:maintain-verification-skill` runs after the app changes. It drives every feature live, fixes the skill and the map where they drifted, and reports real bugs.

## Stop and resume

- `/orbit:pause-safely` finishes the current step, commits a `wip:` commit, saves a resume note outside the repo, and tells you the first action on resume. Run it before you switch model or close the session.
- `/orbit:session-pickup` runs in a new session. It reads the last session's transcript, the git log and the resume note, and carries on without redoing finished work.

Orbit also acts on a few phrases mid-task:

- "continue" or "do it" resumes the todo list.
- "new task" starts a fresh one.
- "pause" or "stop for now" runs `/orbit:pause-safely`.
- "keep going" or "don't stop" never pauses.

Some of these commands also run on their own inside a flow. [How orbit decides](/writings/how-orbit-decides) says which, and when.
