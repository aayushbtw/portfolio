---
title: My git agent pushed a half-finished rebase to main. pstack already had the rule.
description: The main chat plans, reviews and verifies, and fresh agents write the code. Every agent in orbit has one narrow job and a rule for when to stop.
publishedAt: 2026-10-30
series: Orbit
part: 4
---

On October 29 orbit's git agent pushed a rebase that had stopped on a conflict. Orbit had two verified units on a branch, ready to land, and the main chat asked gitops to fetch, rebase onto `origin/main` if it had moved, and push. It had moved, because a commit with a new README pitch had landed in the meantime. The rebase stopped on a conflict in `.claude-plugin/plugin.json`, and gitops pushed anyway. `main` got the first unit on its own, and the second sat in the worktree halfway through a rebase.

Nothing broke, because the unit that landed early had been verified on its own. But gitops had no rule for a conflict, and pstack did. Its babysit playbook says "A conflict is the one blocker you report rather than resolve. Say which branch needs the rebase and stop." Orbit had lost that sentence when it folded three pstack playbooks into one ship command. A few minutes after I read the report, I typed this.

```
/orbit:start split ship into pstack's opening-a-pr, babysit and shipping playbooks
```

The split put the sentence into `agents/gitops.md`, followed by one line of orbit's own, "Never push while a rebase or merge is in progress." Every agent in orbit is built like that. It has one job, and the job includes a point where it stops and hands back.

## The main chat plans, reviews and verifies

The main chat is the one I type into, and it does not write the change. It splits each change into units, and for each unit it briefs a fresh `poteto-agent`, pstack's code-writing agent, with the worktree path, the files, the data shape, the behavior to reach and the check that proves it. The hardest units go to Opus, and the rest run on my session's model. When the agent returns, the main chat reads the diff, confirms it touched only the files in its brief, and runs the check. Then gitops commits that unit by path, and only then does the next agent start.

pstack's feature playbook says the gain is "review separation, not lines saved". An agent that reviews its own diff reads what it meant to write. So size never skips the gate, and a one-line change gets a delegate too. The split also keeps the main chat small. The delegate's file reads and test output stay in its own context, and the main chat keeps the diff.

## One worktree per task

Before the first edit, the task moves into its own git worktree, named for the commit type and a short slug, on a branch to match. Two sessions on one project never share a checkout, and my main checkout stays as it was. Worktrees stay on disk until I run `/orbit:worktree-cleanup`.

## Three passes before anything lands

- `/orbit:deslop` removes AI slop from the diff, such as unnecessary comments, defensive checks the code path does not need, and casts to `any`.
- `/orbit:no-comments` spawns comment-sicko, pstack's comment-hating agent, whose first words on every run are "Yes... Ha ha ha... Yes!" It deletes every comment outside a short keep list and flags the code a comment was excusing.
- `/orbit:interrogate` runs when the design is contested. Two reviewers, one on Opus and one on my session's model, attack the change, and the main chat sorts their findings into act on, consider, noted and dismissed. It never applies a fix by itself.

The cleanup fixes that deslop and no-comments ask for are the one place orbit's rules let the main chat edit the diff itself.

## Work I walk away from

Long runs keep a decision trail through `show-me-your-work`. It is a TSV file with one row per decision, the reason, and a pointer to the evidence. The log is append-only, and a wrong call gets a new row that supersedes it. Before the run hands back, a reviewer on a different model reads the trail against the transcript and flags what I should check. This row is from the run in [Part 2](/writings/the-verifier-failed-it-anyway), and it is committed in orbit's repo.

```
2026-10-30T19:20:00Z	verify	split the SessionStart output across two hooks and move the /orbit:start line to the top	verifier FAIL: 12.6 KB hook output was cut to a 2 KB preview, routing 0/6 vs parent 3/3	per-hook cap measured; routing 3/3 after split	kept
```

Large or cross-cutting work goes to `/orbit:figure-it-out`, which designs its own steps, builds the check before the change, and keeps a trail as it goes. A queue of independent changes goes to autopilot. On October 29, after Claude recommended porting five pieces of pstack, I typed one word.

```
/orbit:start autopilot
```

Orbit read it as those five items on `autopilot-full`. Five owners built them in parallel, each in its own worktree, and each stopped at a verified branch. The main chat ran a fresh verifier on every head, and a fresh owner did each merge round, with another verifier after any rebase that changed code. All five were on `main` 57 minutes after I typed the word. A goal that says "build the stack, I'll land it" runs `autopilot-stack` instead, which verifies the same way and hands me one linear stack of PRs to land.

When I have to stop, `/orbit:pause-safely` finishes the current step, has gitops commit a `wip:` checkpoint, and writes a resume note to memory, outside the repo. In a new session, `/orbit:session-pickup` reads that note, the transcript and the git log, and carries on without redoing finished work. It is what my `/handoff` command from October 9 became when orbit matched pstack's pause and pickup on October 13.

gitops runs on Sonnet at medium effort. Its job needs no judgment. It needs to know when to stop.
