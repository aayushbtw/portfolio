---
title: I told Claude to stop inventing rules and copy pstack
description: Orbit copies pstack at one pinned commit. Every place it differs has a row and a reason, and a script checks that no newer pstack text slipped in.
publishedAt: 2026-10-30
series: Orbit
part: 5
---

On October 24 I found out that orbit had dropped two core parts of pstack, and the comparison meant to catch that had missed both. I asked because I was sure pstack worked differently.

```
/orbit:start fix the gaps, and also im sure pstack has has different flow than ours, like it codes on subagent im pretty sure? also how does it handle multiple sessions working on same project? anything on worktrees? check these differences and tell me
```

It did. pstack writes code in a subagent and gives each task its own worktree, and orbit did neither. The comparison Claude had run looked at files, not the flow text inside them. When Claude came back recommending both, I asked "ur suggesting this now since i pointed this out, what else we dont do?"

Later that day Claude rated pstack's tdd skill "Low" and said to skip it, because "Orbit already does failing-test-first". I asked "did u invent this is it the same on pstack?" The "Low" was Claude's own judgment, and part of the overlap was a line orbit had written itself. My reply set the rule for everything after it.

```
copy pstack instead. dont invent anything yet.
```

I had said an earlier version on October 13, "whatever matches pstack... i know pstack knows what its doing. never ask me look at pstack for ref." That covered design choices. The 24th extended it to wording.

## Copy at one commit

pstack keeps changing, so orbit copies it at one commit, `9580c23`. `skills.json` lists every file orbit vendors with the commit it came from, and 55 of its 56 entries point at the pin. The other one, the playbook scripts, comes from a later commit, and the differences doc gives the reason. At the pin those scripts still carry a tool that upstream later removed.

The pin also gives "is this a gap" a single answer. On October 30 an audit read a fresh clone of pstack and flagged a rule orbit had dropped, the one that has the agent restate the user's goal first. That rule only exists after the pin, so orbit leaves it out until the pin moves.

## A difference needs a row and a reason

Copying is the default, and a difference has to earn a row in [docs/pstack-differences.md](https://github.com/aayushbtw/orbit/blob/main/docs/pstack-differences.md). Each row names the area, quotes what pstack does at the pin, says what orbit does, and gives the reason. Most reasons are things Claude Code forces.

- pstack in Claude Code loads its rules when you type `/pstack:poteto-mode` for a task. Orbit prints them every session from two SessionStart hooks, and since [Part 2](/writings/the-verifier-failed-it-anyway) the row also explains the 10 KB limit.
- pstack's verifier is a Cursor cloud agent. Orbit's is a Claude Code subagent in its own worktree, because pstack's own Claude Code adapter maps one to the other.
- pstack passes `run_in_background: true` on every spawn. Orbit drops it, because Claude Code subagents run in the background by default.

A rule with no source goes, even one in my favor. On October 30 orbit deleted a line from `rules.md` that said my own CLAUDE.md format and length rules win. It had no pstack source, and nothing recorded that I had asked for it.

## Shipping by default is my call, not pstack's

Some rows record my own product calls, and the one I care about most is shipping. A pstack task ends at a ready PR and lands only when someone asks. On October 29 orbit split its ship command into pstack's three playbooks and took that default with it. I noticed the same day.

```
we dont auto ship anymore?
```

Claude confirmed it and recommended keeping pstack's behavior. When I asked how anyone works fast that way, it showed me pstack's answer, which is to put the ship in the prompt, as in "ship it when verified". I wrote back.

```
ill be writing more ship it when verified. than if it was dont ship until i say so
```

Claude's answer was that the verifier still gates every landing, so pstack's safety stays, and "All that changes is who has to type the extra words." The row cites my sentence, with its date, as the reason.

## Check the text, then check it with a script

The corrections after that were all about how to compare. On October 25 Claude fixed worktree safety from the incident files alone and missed a rule in pstack's opening-a-pr playbook. I asked "why are you leaving gaps?" Since then, before Claude says orbit matches pstack on a topic, it searches all of pstack for that topic and maps every hit to an orbit line or a row. On October 29 it listed three open gaps without checking them, and I wrote "when u say gaps/open confirm it with pstack 1st". Two of the three already matched pstack.

On October 30 an audit found text in orbit that pstack only added after the pin. The advisor said another read-through was not enough, so orbit built a checker before it touched anything. The checker runs three tests.

- Any `skills.json` entry off the pin needs a row that names its commit.
- No orbit sentence may carry text that pstack added after the pin. The script takes every sentence that upstream commit `ab1f702` added and searches orbit's skills, agents and `rules.md` for it.
- Every quote in the table's pstack column has to exist at the pin.

Its first run found 20 sentences from after the pin. Restoring autopilot-stack to the pinned text brought that to 11, and reverting the rest brought it to 0. It still prints this.

```
post-pin sentences checked: 135; failures: 0
```

Moving the pin to a newer pstack is its own job. When it happens, every quote in the pstack column has to match the new commit, and the checker has to pass against it. That is also the day the goal-restatement rule comes in.
