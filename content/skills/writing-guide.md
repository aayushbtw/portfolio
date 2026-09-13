---
title: Writing Guide
category: Writing
description: Write, review, and improve articles and blog posts with clear structure, strong voice, and polished prose.
---

Ask an agent to write a post and you get the same draft every time. It hedges every claim, puts a title on top that nobody would click, and opens with a paragraph of background before it gets to the point.

You could fix those by hand on every draft. Or you can give the agent a set of writing rules before it starts, and it avoids them on its own.

This guide is that set of rules. Below are seven of them. Each one explains why the rule matters, then shows the same prompt run twice: "Before" is what an agent writes without the guide, "After" is what it writes with it. The rules work just as well as a checklist when you review a draft yourself.

## Pick a side instead of hedging

> Be opinionated. Take a stance. "It depends" is not a conclusion. If there are tradeoffs, say which side you would pick and why.

People read a post to find out what you think. If you lay out the options and stop there, they leave with the same question they came in with.

<!-- ::start:compare -->
<!-- ::start:before -->

When it comes to retry strategies, there are several approaches worth considering. Exponential backoff is generally regarded as a solid default, though the right choice ultimately depends on your specific workload and requirements. We evaluated the options carefully and settled on an approach that balanced reliability with simplicity.

<!-- ::end:before -->
<!-- ::start:after -->

We tried three retry strategies and exponential backoff won. It is not close: constant-interval retries turned a 30 second blip into a 20 minute outage, because every worker woke up at the same moment. Back off, add jitter, move on.

<!-- ::end:after -->
<!-- ::end:compare -->

The before draft sounds like it reaches a conclusion. "Generally regarded" and "balanced reliability with simplicity" sound like answers, but neither one says which strategy they picked. The after draft names the winner in its first sentence and then explains why.

When you catch yourself writing "it depends", finish the sentence: depends on what, and which would you pick?

## Write a title that says what happened

> The title is the highest-leverage sentence in the post. It must stop someone mid-scroll.

Most people who see your post only ever read the title. If it just names a topic, they have no reason to click.

<!-- ::start:compare -->
<!-- ::start:before -->

Improving Our Queue Reliability: Lessons Learned

<!-- ::end:before -->
<!-- ::start:after -->

A retry loop cost us six hours of silence. The fix was four lines.

<!-- ::end:after -->
<!-- ::end:compare -->

The before title follows a common pattern: a topic, a colon, and a promise of "lessons". It would fit a thousand different posts. The after title tells you what went wrong and how small the fix was. Six hours of damage from a four line bug is surprising, and that makes you want to read on.

Try writing your title as the one sentence you would say to a friend about the post.

## Start with the problem, not the background

> The first 2-3 sentences must do one of: state the problem, state the conclusion, or set up a contradiction.

Someone who clicked already cares about the topic. Explaining why the topic matters wastes the first few seconds, when they are most willing to keep reading.

<!-- ::start:compare -->
<!-- ::start:before -->

Background jobs are a critical component of modern web applications, handling everything from email delivery to data processing. However, when queues misbehave, the results can be difficult to diagnose. In this post, we walk through an incident we experienced and the lessons it taught us about monitoring.

<!-- ::end:before -->
<!-- ::start:after -->

Our queue drained 40,000 jobs in four minutes and every one of them was the same job. A retry loop had been feeding itself for six hours, and the dashboards stayed green the whole time.

<!-- ::end:after -->
<!-- ::end:compare -->

The before opening is 47 words of background and "in this post we will", and nothing has happened yet. The after opening starts with the incident itself. It also sets up a contradiction: the same job was running thousands of times, yet every dashboard said things were fine.

Delete your first paragraph and see if the post still makes sense. It usually does.

## Make each heading say something

> Headings must convey information. "Background" and "Architecture" are useless. "Why pre-aggregation destroys debugging context" tells the reader what they will get.

Readers skim headings to decide whether a post is worth their time. Labels like "Introduction" or "Our Solution" fit any post, so they tell the reader nothing about yours.

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

Read only the before list and you still have no idea what happened. Read only the after list and you already know the story: the dashboards hid a problem, a retry loop was expensive, a small change fixed it, and one question is still open.

A good test: someone who reads only your headings should be able to tell you what the post is about.

## Use numbers instead of adjectives

> Numbers over adjectives. "Significantly faster" means nothing. "p99 dropped from 340ms to 45ms" means something.

An adjective asks the reader to trust you. A number lets them check for themselves.

<!-- ::start:compare -->
<!-- ::start:before -->

The new scheduler significantly improves queue performance, delivering faster processing times and a more reliable experience for users. It's a substantial upgrade that should make a noticeable difference in day-to-day operations.

<!-- ::end:before -->
<!-- ::start:after -->

The job runner has a new scheduler. Median queue wait went from 8 seconds to under 200ms, and the p99 stopped spiking on Mondays.

<!-- ::end:after -->
<!-- ::end:compare -->

The before draft makes five claims with "significantly", "faster", "more reliable", "substantial" and "noticeable", and none of them can be checked. The after draft replaces all five with two measurements and ends up shorter.

When you write "faster" or "better", ask yourself: by how much, and measured how?

## Drop the habits that make text look generated

> Em dashes: use commas, periods, or parentheses instead. Smart quotes: use straight quotes only. "You'd" and "you'll" sound robotic.

Readers have learned to spot machine-written text, and once they do, they stop trusting the rest of it. A few small habits give it away before anyone reads what you are actually saying.

<!-- ::start:compare -->
<!-- ::start:before -->

The scheduler is fast — noticeably so — and you’ll see the difference immediately. If you’d prefer to keep the previous behavior, there’s a flag for that.

<!-- ::end:before -->
<!-- ::start:after -->

The scheduler is fast, and you will notice it on the first deploy. If you want the old behavior, there is a flag for it.

<!-- ::end:after -->
<!-- ::end:compare -->

Nothing in the before draft is grammatically wrong. It just has three giveaways: em dashes (—), curly apostrophes (’ instead of '), and contractions like "you'd" and "there's" that models use far more than people do. The after draft says the same thing without any of them.

Search your draft for these before you publish. It takes a minute.

## End on something new, not a summary

> Don't summarize the article back at the reader. Extend, land a takeaway, or provoke.

Your reader just finished the post. Repeating it back to them gives them nothing new.

<!-- ::start:compare -->
<!-- ::start:before -->

In conclusion, queue reliability is a nuanced topic that requires careful attention to both monitoring and retry semantics. We hope the lessons shared here prove valuable as you think about your own systems.

<!-- ::end:before -->
<!-- ::start:after -->

We still cannot explain why every dashboard stayed green for six hours. If your monitoring would have caught this, I want to know what you are running.

<!-- ::end:after -->
<!-- ::end:compare -->

The before ending sums up the post and hopes it was useful. The after ending admits what is still unexplained and asks readers for something specific, which gives them a reason to reply.

End with what you would say if someone asked "so what now?"

## Why hand the rules to an agent

All seven rules ask for the same thing: say something specific, even when something vague would be easier to write. Hedges, topic titles, background openings and adjectives all let you publish without committing to anything.

That is hard to keep up on your own, especially by the fifth draft. An agent with the guide loaded checks every rule on every paragraph, including the ones you would have skimmed past. Load it before you write, or give it a finished draft and ask for a review.

## Where the rules come from

The guide is adapted from Sentry's [blog-writing-guide](https://github.com/getsentry/skills/blob/main/skills/blog-writing-guide/SKILL.md), which they use for their engineering blog. Every rule quoted above comes from it.
