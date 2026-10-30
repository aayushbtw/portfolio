---
title: Every check passed. The verifier ran it and failed it anyway.
description: Orbit lands nothing until an agent that did not write the change has run it the way a user would. On October 30 that agent caught what 61 tests and an audit missed.
publishedAt: 2026-10-30
series: Orbit
part: 2
---

On October 30 a change to orbit passed every check I had, and then the verifier failed it. The change copied more of pstack's rules into `rules.md`, the file orbit prints at the start of every Claude Code session. A drift checker went from 20 hits to 0. A fresh auditor compared the text with pstack and found one contradiction and one dropped sentence, which a fix round closed. `claude plugin validate` passed, and so did all 61 script tests.

The verifier built a scratch repo with a `cli.js` and a `package.json`. Then it gave Claude Code a plain goal with no skill named, against the old plugin and the new one.

```sh
claude -p "Add a --version flag to cli.js that prints the version from package.json." --plugin-dir <checkout> --add-dir <checkout> --max-turns 3 --permission-mode acceptEdits --disallowedTools=EnterWorktree,Agent --output-format stream-json --verbose
```

On the parent commit, the first thing Claude did was call `/orbit:start`, in 3 runs out of 3. On the new commit it never did. In 6 runs out of 6 it skipped orbit and went straight to editing `cli.js`.

## The rules were too long to reach the session

The new `rules.md` printed 12,609 characters. Claude Code puts about 10 KB of a hook's output into the session. Past that, the session gets a 2 KB preview and the path of a file that holds the rest. The line that sends a plain goal through `/orbit:start` sat at character 11,600. When the verifier asked a session on the new commit what its hook had printed, it answered "Output too large (12.3KB)" and quoted a "Preview (first 2KB)".

The verifier did not stop at the symptom. It copied the new version, cut rules until the output was 9,634 characters, and ran the goal again. Claude routed through `/orbit:start` in 2 runs out of 2. The report said "Size is the cause, not the new wording."

None of the other checks ran the plugin. The tests ran the playbook scripts. `validate` read the manifest. The auditor read the text. Not one of them started a session and typed a goal into it.

## Two hooks and a second verifier

The fix, `cd50e43`, prints `rules.md` through two SessionStart hooks split at `# Code Quality`, and moves the routing line to the top of the file. The two outputs are 7.4 KB and 5.3 KB, each under the limit.

A fresh verifier ran the same goal 12 times on the fix, and 11 runs started with `/orbit:start`. It also ran the parent 9 times and got 5, so the first verifier's 3 out of 3 was a small sample. Routing is a rate. Even so, 0 out of 6 meant orbit never ran for a goal typed without a command, and the split brought it back.

## The verifier judges only what it runs

The verifier is defined in `agents/verifier.md`, and its prompt opens with "You did not write this change. Judge it only by running it." It has Read, Grep, Glob and Bash, and no Edit or Write tool. It works in its own git worktree, checks out the head commit, and runs the change the way its user would, through the project's verify skill when it has one. Then it checks out the parent and runs the same steps, so it can report what differs between the two. It drives a change to prompts, like this one, with `claude -p` in a scratch repo. Its reply starts with `PASS`, `PASS+NOTES` or `FAIL`.

Two rules from pstack's shipping playbook decide whose verdict counts. Only an agent that did not write the code can give one, because an author checks what it meant to build. And green CI or an approving review never counts, because neither one runs the change. A run that is inconclusive, or that drove the wrong screen, is a FAIL.

This is why orbit can land by default. It does not wait for me to read the diff. Before a change lands, an agent that wrote none of it has run it against the commit before it and said what changed.

## Give the verifier a real way to run your app

A verifier is only as good as its way of driving the app. Run this once in any project a user can run or install.

```
/orbit:create-verification-skill
```

It reads the repo, asks me only what it cannot find there, and writes a project skill at `.claude/skills/verify-<app>/`. The skill covers these.

- How to start the app, and how to tell when it is ready.
- One read-only health check to run before trusting an instance.
- How to drive the app with the repo's real selectors and commands.
- What evidence to capture, and where it goes.
- How to clean up without deleting that evidence.

It also writes a feature map, one file per feature, saying how a user reaches it and what end state proves it worked. Before it hands the skill over, it runs it once from launch to cleanup. A verify skill nobody has run is a draft.

When the app changes, the map drifts.

```
/orbit:maintain-verification-skill
```

This gives each feature file to its own read-only agent to check against the source, then drives every feature live in one session. It fixes the skill and the map where they drifted, and it reports real bugs instead of rewriting the docs around them. It ends clean, changed or blocked, and says which.

A project without a verify skill still gets verified. The verifier falls back to `control-ui` for browser and Electron apps, or `control-cli` for CLIs and TUIs, two skills orbit takes from Cursor's team kit. They work, but when the repo has no setup of its own, they build a temporary one on every run. Run `/orbit:create-verification-skill` before the first real task in a project.

One thing from that October 30 run is still open. No test fails if either hook's output grows past the limit again. Until one does, the verifier is the only check that would catch it.
