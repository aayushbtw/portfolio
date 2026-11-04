---
title: Principles
description: The ideas orbit is built on. A separate agent checks each change, hard designs get several attempts, and experiments replace questions.
publishedAt: 2026-11-04
series: Orbit
part: 2
---

orbit doesn't trust a model's first answer. Each idea below is a way of checking that answer before it lands. [Part 1](/writings/orbit-introduction) shows the loop they run in.

## A different agent checks each change

An agent that reviews its own change still has its plan in context. It reads the diff as what it meant to write. Its tests come from the same plan, so they pass for the same reasons the code does.

orbit gives the jobs to different agents. The main chat plans and reviews. A fresh subagent writes each piece of code. Before anything lands, another agent, the verifier, runs the change the way a user would. The verifier:

- gets the goal and the commits, not the plan
- has no edit tools, so it can't fix a bug and then pass its own fix
- runs the old version too, and reports what changed between the two

![The writer side plans the change and writes the code and its tests from the same plan. The diff goes to a verifier subagent that starts fresh, gets the goal and the diff but not the plan, and runs the old and new versions with no edit tools. PASS merges. FAIL sends the fix to a fresh writer.](/writings/orbit-verifier.png)

This week the verifier failed a change whose tests passed. The change kept a user's rating when they retried an answer. The verifier also stopped an answer mid-stream, rated it, and opened that run from its dashboard link, and the page said the run didn't exist. The tests only covered retries, because the plan was about retries.

When a review or the verifier finds a problem, a new agent writes the fix. It gets the brief, the findings and the diff.

## Hard designs get several attempts

The first design a model writes is rarely the best, and it gets expensive to change once code is built on it. For a design with more than one reasonable shape, orbit runs `/orbit:arena`.

![Frame writes one prompt and one rubric. N candidates work in parallel, each in its own worktree. A read-only judge scores them all while Claude reads and scores them too. Claude picks the base that is easiest to extend, grafts the best parts of the losers into it, and verifies the result like any change.](/writings/orbit-arena.png)

1. Claude writes one prompt and a rubric of 3 to 6 criteria.
2. Two or more candidates build it in parallel, each in its own worktree. By default one runs on Opus and one on the session's model.
3. A read-only judge scores every candidate, and Claude scores them too. If they disagree, the rubric was unclear or one of them is biased.
4. Claude picks the candidate that is easiest to extend as the base.
5. Claude copies the best one or two ideas from the other candidates into the base.
6. The result is verified like any other change.

Reviews use the same idea. `/orbit:interrogate` sends a change to two read-only reviewers on different models. A problem that both find on their own counts the most.

## Experiments replace questions

Some questions have an answer you can measure, such as which layout reads better at phone width, or whether streaming is faster than buffering for a 50 MB file. Before Claude asks me which option I want, it checks whether a test would answer it.

If a test would, Claude builds a throwaway prototype in a scratch folder, runs each option, and comes back with screenshots or timings and a recommendation. The prototype never ships.

Claude still asks me about product decisions that no test can answer. For anything that's easy to undo, it decides, does the work, and tells me why.

## Each kind of task has its own steps

A bug, a feature, a slow endpoint and a question each get their own playbook.

- **A bug.** Claude reproduces it before writing a fix, and commits the failing test before the fix.
- **A slow endpoint.** Claude measures a baseline first, and explains what limited a speedup before reporting it.
- **A question.** Claude answers with citations and changes no code.

In every playbook, the work goes out in small pieces. Each piece is built, reviewed and committed before the next one starts.

## Every rule has a name

orbit has 24 principles, copied from pstack, such as "subtract before you add", "attack the premise" and "prove it works". Each one is a short rule plus the situation that triggers it. Claude keeps a one-line list of all 24 and reads a principle in full only when its situation comes up.

For example, if two fixes for a flaky test fail the same check, "attack the premise" applies. Claude writes down what both fixes assumed and tests that before trying a third.

Claude's reply names each principle that changed a decision, so I can see why it chose what it did. I can also use a name to redirect it. Saying "laziness protocol" tells Claude to drop a new abstraction and make the smallest change.

[Part 3](/writings/orbit-usage) covers what to type into orbit and how to set it up in a project.
