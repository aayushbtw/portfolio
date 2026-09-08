---
title: Writing Guide
description: Write, review, and improve articles and blog posts with clear structure, strong voice, and polished prose.
---

Drafts fail in the same few places. The voice goes corporate, the opening clears its throat, the claims hide behind adjectives, and the punctuation gives away which model wrote it. The guide covers voice, titles, openings, endings, banned language and those tells, and it rewrites rather than annotates.

Four of them are below. Each is one passage written twice, same subject on both sides, so the only thing that changed is the writing.

## "It could be argued" is not a position

The guide's voice rules ask for a stance and a number. The draft has neither: it evaluates, it qualifies, and it arrives at an implementation without ever saying what was chosen or why. Watch the passive voice go with it.

<!-- ::start:compare -->
<!-- ::start:before -->

The team evaluated several approaches to the retry problem. It could be argued that exponential backoff is generally considered a reasonable default in most situations, though it depends on the workload. Ultimately a decision was made to proceed with an implementation.

<!-- ::end:before -->
<!-- ::start:after -->

We tried three retry strategies and exponential backoff won. It is not close: constant-interval retries turned a 30 second blip into a 20 minute outage, because every worker woke up at the same moment. Back off, add jitter, move on.

<!-- ::end:after -->
<!-- ::end:compare -->

## An opening is not a warm-up

The guide gives an opening one job: state the problem, state the conclusion, or set up a contradiction. Thirty-two words go by in the draft before anything happens, and "in this blog post, we will explore" is on the banned list for exactly that reason.

<!-- ::start:compare -->
<!-- ::start:before -->

Background jobs are an important part of most production systems. In this blog post, we will explore some of the challenges we faced with our queue and share a few lessons learned along the way.

<!-- ::end:before -->
<!-- ::start:after -->

Our queue drained 40,000 jobs in four minutes and every one of them was the same job. A retry loop had been feeding itself for six hours, and the dashboards stayed green the whole time.

<!-- ::end:after -->
<!-- ::end:compare -->

## Adjectives are where claims go to hide

Eight banned words in one sentence, and not one of them says how much faster anything got. That is the tell: "best-in-class" and "significant" survive precisely because they cannot be checked. The rewrite trades all eight for two numbers, and gets shorter.

<!-- ::start:compare -->
<!-- ::start:before -->

We're thrilled to announce that our best-in-class job runner now leverages a robust new scheduler to seamlessly streamline your workflows and unlock significant performance gains.

<!-- ::end:before -->
<!-- ::start:after -->

The job runner has a new scheduler. Median queue wait went from 8 seconds to under 200ms, and the p99 stopped spiking on Mondays.

<!-- ::end:after -->
<!-- ::end:compare -->

## Punctuation is a fingerprint

Nothing in the draft is wrong. It reads as generated, and the reasons are mechanical: em dashes, curly quotes, and the stilted "you'll" and "you'd" that models reach for and people do not. All three are on the list, so all three come out.

<!-- ::start:compare -->
<!-- ::start:before -->

The scheduler is fast — really fast — and you’ll notice it right away. If you’d rather keep the old behaviour, there’s a flag for that.

<!-- ::end:before -->
<!-- ::start:after -->

The scheduler is fast, and you will notice it on the first deploy. If you want the old behaviour, there is a flag for it.

<!-- ::end:after -->
<!-- ::end:compare -->
