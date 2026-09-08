---
title: Writing Guide
description: Write, review, and improve articles and blog posts with clear structure, strong voice, and polished prose.
---

Every first draft comes out wrong in the same handful of ways. The voice goes corporate, the title says nothing, the opening clears its throat, the claims hide behind adjectives, and the punctuation gives away which model wrote it.

This is the guide I hand an agent before it writes anything. Each rule below is quoted from it, then run on a passage I wrote badly on purpose. Same subject on both sides, so the only thing that changed is the writing.

## "It could be argued" is not a position

> Be opinionated. Take a stance. "It depends" is not a conclusion. If there are tradeoffs, say which side you would pick and why.

The draft evaluates, qualifies, and arrives at an implementation without ever saying what was chosen. Nobody wrote it, either: the decision "was made". Watch the passive voice leave with the hedging.

<!-- ::start:compare -->
<!-- ::start:before -->

The team evaluated several approaches to the retry problem. It could be argued that exponential backoff is generally considered a reasonable default in most situations, though it depends on the workload. Ultimately a decision was made to proceed with an implementation.

<!-- ::end:before -->
<!-- ::start:after -->

We tried three retry strategies and exponential backoff won. It is not close: constant-interval retries turned a 30 second blip into a 20 minute outage, because every worker woke up at the same moment. Back off, add jitter, move on.

<!-- ::end:after -->
<!-- ::end:compare -->

## A title is the only sentence most people read

> The title is the highest-leverage sentence in the post. It must stop someone mid-scroll.

A version number is not a reason to click. The draft describes where the change landed; the rewrite says what happened, and the number does the stopping.

<!-- ::start:compare -->
<!-- ::start:before -->

Queue improvements in v2.1

<!-- ::end:before -->
<!-- ::start:after -->

A retry loop cost us six hours of silence. The fix was four lines.

<!-- ::end:after -->
<!-- ::end:compare -->

## An opening is not a warm-up

> The first 2-3 sentences must do one of: state the problem, state the conclusion, or set up a contradiction.

Thirty-two words go by in the draft before anything happens, and "in this blog post, we will explore" is on the banned list for exactly that reason. The rewrite states the problem and sets up the contradiction in two sentences: everything was on fire, and every dashboard was green.

<!-- ::start:compare -->
<!-- ::start:before -->

Background jobs are an important part of most production systems. In this blog post, we will explore some of the challenges we faced with our queue and share a few lessons learned along the way.

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

- Background
- Architecture
- Implementation
- Conclusion

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

Eight banned words in one sentence, and not one of them says how much faster anything got. That is the tell: "best-in-class" and "significant" survive precisely because they cannot be checked. The rewrite trades all eight for two numbers, and gets shorter doing it.

<!-- ::start:compare -->
<!-- ::start:before -->

We're thrilled to announce that our best-in-class job runner now leverages a robust new scheduler to seamlessly streamline your workflows and unlock significant performance gains.

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

The scheduler is fast — really fast — and you’ll notice it right away. If you’d rather keep the old behaviour, there’s a flag for that.

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

In conclusion, we have explored the various challenges of queue management and shared some of the lessons we learned along the way. Hopefully these takeaways prove useful for your own systems.

<!-- ::end:before -->
<!-- ::start:after -->

We still cannot explain why every dashboard stayed green for six hours. If your monitoring would have caught this, I want to know what you are running.

<!-- ::end:after -->
<!-- ::end:compare -->

## Every rule is the same rule

Every rule above does the same thing from a different angle: it forces a specific claim where a vague one would have been easier to write. The hedge, the version-number title, the throat-clearing opening and the eight adjectives are all ways of publishing without committing to anything.

The guide is worth having because that pressure is hard to keep up alone, and an agent will apply it to the paragraph you were about to leave alone.
