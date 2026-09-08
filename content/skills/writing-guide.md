---
title: Writing Guide
description: Write, review, and improve articles and blog posts with clear structure, strong voice, and polished prose.
---

Every first draft comes out wrong in the same few ways, and I stopped trusting myself to catch them. This is the guide I hand an agent before it writes anything, modified from Sentry's [blog-writing-guide](https://github.com/getsentry/skills/blob/main/skills/blog-writing-guide/SKILL.md).

Each rule below is quoted from it. The left column is what an agent gives you for a prompt with no guide loaded. The right is the same prompt with it.

## A balanced take is usually no take

> Be opinionated. Take a stance. "It depends" is not a conclusion. If there are tradeoffs, say which side you would pick and why.

Four hedges in three sentences, and no answer. "Generally regarded", "ultimately depends" and "balanced reliability with simplicity" are all ways of describing a decision without naming it.

<!-- ::start:compare -->
<!-- ::start:before -->

When it comes to retry strategies, there are several approaches worth considering. Exponential backoff is generally regarded as a solid default, though the right choice ultimately depends on your specific workload and requirements. We evaluated the options carefully and settled on an approach that balanced reliability with simplicity.

<!-- ::end:before -->
<!-- ::start:after -->

We tried three retry strategies and exponential backoff won. It is not close: constant-interval retries turned a 30 second blip into a 20 minute outage, because every worker woke up at the same moment. Back off, add jitter, move on.

<!-- ::end:after -->
<!-- ::end:compare -->

## A title is the only sentence most people read

> The title is the highest-leverage sentence in the post. It must stop someone mid-scroll.

The colon title is the tell. It names a topic and a genre, promises lessons, and gives nobody a reason to click. The rewrite says what happened and lets the number do the stopping.

<!-- ::start:compare -->
<!-- ::start:before -->

Improving Our Queue Reliability: Lessons Learned

<!-- ::end:before -->
<!-- ::start:after -->

A retry loop cost us six hours of silence. The fix was four lines.

<!-- ::end:after -->
<!-- ::end:compare -->

## An opening is not a warm-up

> The first 2-3 sentences must do one of: state the problem, state the conclusion, or set up a contradiction.

Forty-seven words before anything happens, and two of the three sentences are scene-setting for a reader who already clicked. The rewrite states the problem and the contradiction at once: everything was on fire, and every dashboard was green.

<!-- ::start:compare -->
<!-- ::start:before -->

Background jobs are a critical component of modern web applications, handling everything from email delivery to data processing. However, when queues misbehave, the results can be difficult to diagnose. In this post, we walk through an incident we experienced and the lessons it taught us about monitoring.

<!-- ::end:before -->
<!-- ::start:after -->

Our queue drained 40,000 jobs in four minutes and every one of them was the same job. A retry loop had been feeding itself for six hours, and the dashboards stayed green the whole time.

<!-- ::end:after -->
<!-- ::end:compare -->

## A heading should survive being read alone

> Headings must convey information. "Background" and "Architecture" are useless. "Why pre-aggregation destroys debugging context" tells the reader what they will get.

Skim the left column and you learn nothing about the post. Skim the right one and you already have the shape of it. This is also the rule this page failed first: every heading here started life as a one-word label.

<!-- ::start:compare -->
<!-- ::start:before -->

- Introduction
- Understanding the Problem
- Our Solution
- Key Takeaways

<!-- ::end:before -->
<!-- ::start:after -->

- Why the dashboards stayed green
- What a retry loop costs per hour
- The four lines that fixed it
- What we still cannot explain

<!-- ::end:after -->
<!-- ::end:compare -->

## Adjectives are where claims go to hide

> Numbers over adjectives. "Significantly faster" means nothing. "p99 dropped from 340ms to 45ms" means something.

Five claims and no numbers. "Significantly", "faster", "more reliable", "substantial" and "noticeable" all survive precisely because none of them can be checked. The rewrite trades all five for two measurements, and gets shorter doing it.

<!-- ::start:compare -->
<!-- ::start:before -->

The new scheduler significantly improves queue performance, delivering faster processing times and a more reliable experience for users. It's a substantial upgrade that should make a noticeable difference in day-to-day operations.

<!-- ::end:before -->
<!-- ::start:after -->

The job runner has a new scheduler. Median queue wait went from 8 seconds to under 200ms, and the p99 stopped spiking on Mondays.

<!-- ::end:after -->
<!-- ::end:compare -->

## Punctuation is a fingerprint

> Em dashes: use commas, periods, or parentheses instead. Smart quotes: use straight quotes only. "You'd" and "you'll" sound robotic.

Nothing in the draft is wrong. It reads as generated, and the reasons are mechanical: em dashes, curly quotes, and the stilted contractions that models reach for and people do not. All three are on the list, so all three come out.

<!-- ::start:compare -->
<!-- ::start:before -->

The scheduler is fast — noticeably so — and you’ll see the difference immediately. If you’d prefer to keep the previous behavior, there’s a flag for that.

<!-- ::end:before -->
<!-- ::start:after -->

The scheduler is fast, and you will notice it on the first deploy. If you want the old behaviour, there is a flag for it.

<!-- ::end:after -->
<!-- ::end:compare -->

## An ending is not a receipt

> Don't summarize the article back at the reader. Extend, land a takeaway, or provoke.

The draft recounts what you have already read and hopes it was useful, which is not a position. The rewrite admits what is still unexplained and asks for the one thing the author wants.

<!-- ::start:compare -->
<!-- ::start:before -->

In conclusion, queue reliability is a nuanced topic that requires careful attention to both monitoring and retry semantics. We hope the lessons shared here prove valuable as you think about your own systems.

<!-- ::end:before -->
<!-- ::start:after -->

We still cannot explain why every dashboard stayed green for six hours. If your monitoring would have caught this, I want to know what you are running.

<!-- ::end:after -->
<!-- ::end:compare -->

## Every rule is the same rule

Every rule above does the same thing from a different angle: it forces a specific claim where a vague one would have been easier to write. The hedge, the colon title, the throat-clearing opening and the five unmeasured claims are all ways of publishing without committing to anything.

The guide is worth having because that pressure is hard to keep up alone, and an agent will apply it to the paragraph you were about to leave alone.
