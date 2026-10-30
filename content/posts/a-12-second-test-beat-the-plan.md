---
title: Claude's plan said subagents could not nest. A 12-second test said they could.
description: Orbit settles facts by running something before it asks me. How it reads the code and its history, prototypes, and sketches the shape of a change before anyone writes it.
publishedAt: 2026-10-30
series: Orbit
part: 3
---

On October 29 orbit was about to port pstack's autopilot-full playbook, where one owner agent carries each change from build to merge. Claude's plan had a limit written into it. Each owner had to be a separate Claude Code session, "since subagents can't nest". Building on that would have meant a root agent that launches and watches whole sessions.

Before anything was built on it, the run tested the claim with one command in an empty repo.

```sh
claude -p --max-budget-usd 2 --output-format stream-json --verbose 'Use the Agent tool to spawn ONE general-purpose subagent with this exact prompt: "Use the Agent tool to spawn one general-purpose subagent whose only job is to reply with the word NESTED-OK. Report exactly what it replied, or report the exact error / say that you have no Agent tool." Then tell me verbatim what the subagent reported.'
```

Twelve seconds later the answer came back as "The subagent replied `NESTED-OK`." Owners became subagents in their own worktrees, and the decision trail recorded why. Nobody asked me whether subagents can nest, and nobody should have. It was a fact, and facts get settled by running something.

## A fact is not my call

`rules.md` has a rule for the moment Claude is about to ask me "which approach" or "what should this do". It classifies the question first. If running something would show the answer, such as behavior, timing, layout, output or performance, the question is not mine. Claude sketches the options with the prototype playbook and lets the result decide. Only a product or preference call that no experiment can settle reaches me.

The prototype playbook is the one place orbit wants speed over polish. It builds throwaway code in a scratch folder and puts the variants behind one switcher. For a visual decision it takes a screenshot of each variant through the project's verify skill. For a behavior or timing decision it prints the output or logs the time. It returns a decision and the throwaway artifact, never shippable code, and `/orbit:playbook prototype` runs it directly.

When the flow was ported, its verifier ran this prompt against the old plugin and the new one.

```
/orbit:start I can't decide between a regex and a char loop for a tiny slug function. build both and let the result decide
```

The old plugin treated it as a feature. It ran an experiment, built the regex version and pushed it to `main`. The new one built both versions as a throwaway sketch, printed their output on a set of edge cases next to a micro-benchmark, recommended the regex with its tradeoffs, and shipped nothing.

## Read the code and its history first

Three commands do the reading. `/orbit:how` explains how a subsystem works, from parallel read-only explorers when it spans many files. `/orbit:why` explains why code is the way it is, from git history, PRs and every MCP server I have connected, and it keeps what it found apart from what it infers. `/orbit:recall` rebuilds my working context from recent chats before I pick work back up.

```
/orbit:how how does the SessionStart hook get rules.md into a session
/orbit:why why does rules.md print through two hooks
/orbit:recall my work on the pstack parity trail
```

Research also means not trusting my own numbers. On October 26 I gave orbit a cost analysis from netigen-v2, one of my projects. It said orbit ran about 7 reviewer agents per ship, "so fix rounds re-run the full two-model panel", and it proposed reviewing only the fix diff. The investigation would not adopt that. Its verdict on that row was "Explain the number first", because nothing in the ship text re-ran the panel that often. A trace through the transcripts found the cause. Each ship call was landing several tasks, and each task got its own first review. Of the 74 reviewer spawns, 64 were a task's first review and 10 were reruns. Reviewing only the fix diff would have touched those 10.

## The plan gets a second reader

When a change adds a module or touches more than 3 files, the plan goes to the advisor before any code exists. The advisor is a read-only agent on Opus that returns a verdict and concrete changes. On October 30 it returned "approve with changes" on the run from [Part 1](/writings/driving-claude-code-by-hand). The plan had a step that deleted orbit's `docs/` folder. The advisor pointed out that `docs/pstack-differences.md` is where orbit records every difference from pstack, that deleting it was destructive, and that "nothing in the request asks for it." Claude dropped the step. On the plan's re-audit, the advisor said "Not strong enough alone. Add the script." [Part 5](/writings/copy-pstack-first) shows that script.

## Sketch the shape before the code

For code that crosses a function boundary, `/orbit:architect` sketches types and signatures before anything is implemented. It grounds itself with `/orbit:how`, then runs `/orbit:arena`. Two runners, one on Opus and one on my session's model, each draft a full design in their own worktree. A separate judge scores them against a rubric, and Claude picks a base and grafts in the best parts of the other. A delegate then writes the code against that sketch. If the same workaround keeps showing up, or the types need `any` and casts to compile, Claude throws the sketch out and runs the arena again.

```
/orbit:architect a size limit on what each SessionStart hook prints
```

## Plans for work that spans PRs

Work across several PRs can start as a plan instead.

```
/orbit:start multi-PR plan: move orbit's pin to newer pstack
```

The multi-phase-plan flow settles open questions with prototypes first. Then it writes a checklist with one section per PR, saying what to build, what I should see and which checks prove it. Every verification block opens with "Tests alone are not sufficient verification." A script lints the plan, and the flow stops until I say go.

If an agent asks me which of two approaches is faster, it has not done its job yet. It can time both.
