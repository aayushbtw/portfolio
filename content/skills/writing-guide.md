---
title: Writing Guide
summary: Write, review, and improve articles and blog posts with clear structure, strong voice, and polished prose.
---

Every pair below is one passage written twice: once the way it usually comes out, and once after the skill has been over it. The subject never changes between the two sides, so the only thing left to compare is the writing.

## Voice

<!-- ::start:compare -->
<!-- ::start:before -->

The team evaluated several approaches to the retry problem. It could be argued that exponential backoff is generally considered a reasonable default in most situations, though it depends on the workload. Ultimately a decision was made to proceed with an implementation.

<!-- ::end:before -->
<!-- ::start:after -->

We tried three retry strategies and exponential backoff won. It is not close: constant-interval retries turned a 30 second blip into a 20 minute outage, because every worker woke up at the same moment. Back off, add jitter, move on.

<!-- ::end:after -->
<!-- ::end:compare -->

## Opening

<!-- ::start:compare -->
<!-- ::start:before -->

Background jobs are an important part of most production systems. In this blog post, we will explore some of the challenges we faced with our queue and share a few lessons learned along the way.

<!-- ::end:before -->
<!-- ::start:after -->

Our queue drained 40,000 jobs in four minutes and every one of them was the same job. A retry loop had been feeding itself for six hours, and the dashboards stayed green the whole time.

<!-- ::end:after -->
<!-- ::end:compare -->

## Corporate fluff

<!-- ::start:compare -->
<!-- ::start:before -->

We're thrilled to announce that our best-in-class job runner now leverages a robust new scheduler to seamlessly streamline your workflows and unlock significant performance gains.

<!-- ::end:before -->
<!-- ::start:after -->

The job runner has a new scheduler. Median queue wait went from 8 seconds to under 200ms, and the p99 stopped spiking on Mondays.

<!-- ::end:after -->
<!-- ::end:compare -->

## AI tells

<!-- ::start:compare -->
<!-- ::start:before -->

The scheduler is fast — really fast — and you’ll notice it right away. If you’d rather keep the old behaviour, there’s a flag for that.

<!-- ::end:before -->
<!-- ::start:after -->

The scheduler is fast, and you will notice it on the first deploy. If you want the old behaviour, there is a flag for it.

<!-- ::end:after -->
<!-- ::end:compare -->
