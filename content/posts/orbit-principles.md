---
title: Principles
description: The ideas orbit is built on. The writer never judges its own work, one attempt is not a design, a question you can run is not a question, and every rule has a name you can steer with.
publishedAt: 2026-11-04
series: Orbit
part: 2
---

A model's first answer is one sample. It might be the best one, but nothing in the process checks. Most of orbit is rules that treat that first answer as a draft: get a second opinion from someone who didn't write it, try more than one shape, and run the thing instead of guessing.

This part covers those ideas and why each one exists. [Part 1](/writings/orbit-introduction) shows the loop they sit in.

## The writer never judges its own work

An agent that reviews its own change still has its plan in context. It reads the diff as what it meant to write, not what it wrote. Its tests come from the same plan, so they pass for the same reasons the code does.

So orbit splits the jobs. The main chat plans and reviews. A fresh subagent writes each piece of code. Before anything lands, a third agent, the verifier, runs the change the way a user would. It gets the goal and the commits, not the plan. It has no edit tools, so it can't fix what it finds and pass its own fix. It runs the old version too, so it can report a before and an after.

![The writer side plans the change and writes the code and its tests from the same plan. The diff goes to a verifier subagent that starts fresh, gets the goal and the diff but not the plan, and runs the old and new versions with no edit tools. PASS merges. FAIL sends the fix to a fresh writer.](/writings/orbit-verifier.png)

This week that caught a change whose tests passed. The change kept a user's rating when they retried an answer, and the retry worked. Then the verifier stopped an answer mid-stream, rated it, and opened that run from its dashboard link. The panel said the run didn't exist. The writer's plan was about retries, so its tests were about retries. The verifier only knew what the change was for, so it tried what a user might do next.

Fixes follow the same rule. A review finding goes to a new agent with the brief, the findings and the diff, never back to the one that made the mistake.

## One attempt is not a design

The first shape a model reaches for is rarely the best one, and once code grows around it, that shape is expensive to change. So for anything with more than one reasonable shape, orbit runs an arena.

![Frame writes one prompt and one rubric. N candidates work in parallel, each in its own worktree. A read-only judge scores them all while Claude reads and scores them too. Claude picks the base that is easiest to extend, grafts the best parts of the losers into it, and verifies the result like any change.](/writings/orbit-arena.png)

Every candidate gets the same prompt, and Claude writes a rubric of 3 to 6 criteria before any of them start. By default two candidates run, one on Opus and one on the session's model, so the attempts differ by model and not only by luck. A read-only judge scores each one, and Claude scores them too. A disagreement between the two means one of them is biased or the rubric was unclear.

The winner is not the cleverest candidate. It is the one a future maintainer can extend with the least risk of breaking it. Then Claude walks each loser for the one or two ideas worth keeping and folds them in by hand, so the result still reads as one design. If the candidates all agree, there is nothing to graft. If they disagree wildly, the prompt was too loose, and the arena runs again.

The same idea shows up in review. `/orbit:interrogate` sends a change to two read-only reviewers on different models. A flaw that both models find on their own carries the most weight.

## A question you can run is not a question

Some design questions have an answer you can observe. Which layout reads better at phone width. Whether streaming beats buffering for a 50 MB file. How long a cold start takes. orbit's rules say these aren't mine to answer. Before Claude asks me which approach I want, it checks whether running something would settle it.

If it would, Claude builds a throwaway prototype in a scratch directory, puts the options side by side, and brings back screenshots or timings with a recommendation. The prototype never ships. The question it settled goes to the real build.

What's left for me are the calls no experiment can settle, like what the product should do. Everything reversible, Claude decides, does and explains, and I correct it if I disagree.

## Each kind of work has its own order

A bug, a feature, a slow endpoint and a question need different work, and the order of the steps is where most of the judgment lives. So each has its own playbook. A bug is reproduced before anyone writes a fix, and the failing repro is committed before the fix. A slow endpoint gets a baseline number before any change, and before orbit trusts a speedup, it has to explain what limited it. A question gets an answer with citations and touches no code.

Inside a playbook, work goes out in small pieces that each end in a check. Claude builds, reviews and commits one piece before the next starts, so each step is proven before the next one builds on it.

## Every rule has a name

orbit carries 24 principles, copied from pstack, such as "subtract before you add", "attack the premise" and "prove it works". Each one is a short rule with the situation that triggers it. Claude keeps a one-line index of all 24 and reads a principle in full only when its trigger comes up.

Say Claude's second fix for a flaky test fails the same check as the first. That is the trigger for "attack the premise". Claude writes down what both fixes assumed and tests that belief before it tries a third.

The names work in both directions. Claude's reply names each principle that changed a decision, so I can see which rule moved which choice. And when it heads somewhere I don't want, I say the name. "Laziness protocol" is enough to turn a new abstraction back into the smallest change, because the name carries the whole rule.

[Part 3](/writings/orbit-usage) covers what to type into orbit and how to set it up in a project.
