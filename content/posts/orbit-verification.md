---
title: Verification
description: Why orbit verifies every change in a fresh agent that has no edit tools, and the bug that rule caught after the tests passed.
publishedAt: 2026-11-04
series: Orbit
part: 2
---

An agent that reviews its own change still has its plan in context. It reads the diff as what it meant to write, not what it wrote. Its tests come from the same plan, so they pass for the same reasons the code does. A green suite proves only that the code agrees with itself.

So in orbit, the agent that writes a change never decides it is done. A different agent does, and it starts with none of the writer's reasoning. [Part 1](/writings/orbit-introduction) covers the loop this sits in.

![The writer side plans the change and writes the code and its tests from the same plan. The diff goes to a verifier subagent that starts fresh, gets the goal and the diff but not the plan, and runs the old and new versions with no edit tools. PASS merges. FAIL sends the fix to a fresh writer.](/writings/orbit-verifier.png)

## The verifier gets the goal, not the plan

Before a change lands, orbit starts a new agent called the verifier. Its brief holds the commit to test, the commit before it, a paragraph on what the change is for, and the paths it touched. It never sees the plan or the conversation that produced the code.

It has four tools: Read, Grep, Glob and Bash. With no Edit or Write, it can't fix what it finds and then pass its own fix. It runs in its own git worktree, checks out the change, and runs it the way a user would. Then it checks out the commit before and runs the same steps again.

That second run is what turns an observation into evidence. "The page shows the run" says little. "The old version showed no link, and the new one shows a link that opens the run" says the change did its job.

It answers with one of three verdicts. PASS, PASS+NOTES with the parts it couldn't run, or FAIL with the smallest repro. A run that can't tell counts as a FAIL, because a verifier that isn't sure should never wave a change through.

## It failed a change the tests passed

This week a change had to keep a user's rating on an answer when they retry it. The writer built it, the review passed, and the retry worked.

Then the verifier tried a case nobody had written a test for. It stopped an answer mid-stream, rated it, and opened that run from its dashboard link. The panel said "This run isn't in this org."

A run stopped mid-stream never writes the row that the panel looks it up by. The old version had no link there at all, so the change had added a broken one. The verifier failed the PR. The fix added 3 tests that fail without it, and a second, fresh verifier passed the fixed version.

The writer had no reason to try that case. Its plan was about retries, and its tests were about retries. The verifier only knew what the change was for, so it tried what a user might do next.

## Fixes go to a fresh agent too

When a review or a verifier finds a problem, orbit doesn't send it back to the agent that wrote the code. A new agent gets the original brief, the findings and the current diff, and writes the fix. The agent that made the mistake still has the reasoning that produced it in context.

This costs more. Every piece of code and every verification starts a new agent, so orbit spends more tokens than a plain session. I think that is the right trade, because the verifier finds the bug before a user does.

## You can do this without orbit

Any agent setup with subagents can split the two jobs.

- Verify in a fresh subagent, not in the chat that wrote the code.
- Give it the goal and the commits. Keep the plan out.
- Take away its edit tools.
- Make it run the old version too, so it reports a before and an after.
- Count "I couldn't tell" as a fail.

[Part 3](/writings/orbit-usage) covers what to type into orbit and how to set it up in a project.
