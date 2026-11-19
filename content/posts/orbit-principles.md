---
title: Principles
description: The ideas Orbit is built on. A separate agent checks each change, hard designs get several attempts, and experiments replace questions.
publishedAt: 2026-11-04
series: Orbit
part: 2
---

Orbit doesn't trust a model's first answer, whether that answer is code, a design or a guess about which option is better.

## A different agent checks each change

An agent that reviews its own change still has its plan in context. It reads the diff as what it meant to write. Its tests come from the same plan, so they pass for the same reasons the code does.

Orbit gives the jobs to different agents. The lead, the chat that runs the playbook, plans and reviews. A fresh subagent writes each piece of code. Before anything lands, another agent, the verifier, runs the change the way a user would. The verifier:

- gets the goal and the commits, not the plan
- commits nothing, so a bug it finds goes back to a writer instead of getting patched and passed
- runs the old version too, and reports what changed between the two

In a T3 thread with providers set in `/orbit:setup`, the verifier runs on another provider family.

![The writer side plans the change and writes the code and its tests from the same plan. The diff goes to a verifier that starts fresh and can run on another provider family in T3. It gets the goal and the diff but not the plan, and runs the old and new versions without committing anything. PASS lands the change. FAIL sends the fix to a fresh writer.](/writings/orbit-verifier.png)

In early November the verifier failed a change whose tests all passed. The change kept a user's rating when they retried an answer, and its tests covered retries. The verifier also stopped an answer mid-stream, rated it, and opened that run from its dashboard link. The page said the run didn't exist. The plan was only about retries, and the tests came from the plan.

When a review or the verifier finds a problem, a new agent writes the fix. It gets the brief, the findings and the diff.

## Hard designs get several attempts

The first design a model writes is rarely the best, and it gets expensive to change once code is built on it. For a design with more than one reasonable shape, Orbit runs `/orbit:arena`.

![Frame writes one prompt and one rubric. N candidates work in parallel, each in its own worktree. A read-only judge on another model family scores them all while the lead reads and scores them too. The lead picks the base that is easiest to extend, grafts the best parts of the losers into it, and verifies the result like any change.](/writings/orbit-arena.png)

1. The lead writes one prompt and a rubric of 3 to 6 criteria.
2. Two or more candidates build it in parallel, each in its own worktree. By default one runs on Opus and one on the session's model.
3. A read-only judge scores every candidate, and the lead scores them too. If they disagree, the rubric was unclear or one of them is biased. The judge never runs on the lead's family. In T3 with providers set in `/orbit:setup`, it is the seat on another family. Without one, a different Claude model stands in, and if both candidate models are the lead's own, the lead picks alone.
4. The lead picks the candidate that is easiest to extend as the base.
5. The lead copies the best one or two ideas from the other candidates into the base.
6. The result is verified like any other change.

Reviews use the same idea. `/orbit:interrogate` first fixes the problems already known, such as open review comments, confirmed bugs and failing checks. Then two adversaries try to break the change, by default one on Opus and one on the session's model, each keeping its repros in its own worktree. In T3 with providers set, a seat on another family replaces the second one. A finding survives only when a run proves it, and interrogate reports its findings without fixing them.

## Experiments replace questions

Some questions have an answer you can measure, such as which layout reads better at phone width, or whether streaming is faster than buffering for a 50 MB file. Before the lead asks me which option I want, it checks whether a test would answer it.

If a test would, the lead builds a throwaway prototype in a scratch folder, runs each option, and comes back with screenshots or timings and a recommendation. The prototype never ships.

On one run, a plan assumed subagents cannot start their own subagents. Instead of asking me, Orbit tested it in an empty repo, had the answer 12 seconds later, and changed the plan.

The lead still asks me about product decisions that no test can answer. For anything that's easy to undo, it decides, does the work, and tells me why.

## Each kind of task has its own steps

- **A bug.** Orbit reproduces it first and, when a test is cheap, commits a test that fails on today's code. The fix lands after, in its own commit. The test existed before the fix did, so it can't be shaped to fit it, and a pass means the fix works.
- **A slow endpoint.** Orbit measures a baseline first, and explains what limited a speedup before reporting it.
- **A question.** Orbit answers with citations and changes no code.

## Every rule has a name

Orbit has 24 principles, copied from pstack, such as "subtract before you add", "attack the premise" and "prove it works". Each one is a short rule plus the situation that triggers it. The lead keeps a one-line list of all 24 and reads a principle in full only when its situation comes up.

If two fixes for a flaky test fail the same check, "attack the premise" applies. The lead writes down what both fixes assumed and tests that before trying a third.

The lead's reply names each principle that changed a decision, so I can see why it chose what it did. I can also use a name to redirect it. Saying "laziness protocol" tells the lead to drop a new abstraction and make the smallest change.
