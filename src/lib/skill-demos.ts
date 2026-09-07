// The page sells a skill rather than reprinting it: the text is on GitHub and
// skills.sh, and a visitor deciding whether to install one wants to see what it
// does to their work. This file is the whole of what the site says about a
// skill, so it stays readable without the skills repo checked out.
//
// Two rules for an example, both learned the hard way:
//
// One, `label` names a section of the skill, not an arbitrary slice of text.
// A reader should be able to point at the rule that fired.
//
// Two, both sides say the same thing. If the subject changes between them the
// reader cannot tell craft from content, and the pair proves nothing. The
// `before` is written first and on purpose; the `after` is what the skill
// actually produces from it, not a nicer sentence invented alongside.
interface SkillExample {
  after: string;
  before: string;
  // The feature being demonstrated. Matches a heading in the skill itself.
  label: string;
  // For an example made of lines rather than sentences.
  mono?: boolean;
}

interface SkillDemo {
  // Topics the skill covers, rendered into the sentence above the examples.
  covers: string[];
  examples: SkillExample[];
}

const skillDemos: Record<string, SkillDemo> = {
  "git-commit": {
    covers: [
      "conventional commits",
      "scopes",
      "imperative subjects",
      "atomic commits",
      "breaking changes",
    ],
    examples: [
      {
        after: "fix(queue): stop retries re-enqueuing themselves",
        before: "fixed the thing",
        label: "Format",
      },
      {
        after:
          "fix(queue): stop retries re-enqueuing themselves\nfeat(queue): add jitter to the backoff window\ndocs(queue): document the retry window\nchore(deps): bump bullmq to v5",
        before:
          "update queue stuff\n\n- fix retry loop\n- add jitter\n- readme\n- bump deps",
        label: "Splitting commits",
        mono: true,
      },
      {
        after: "feat(api)!: return 409 instead of 200 on conflict",
        before: "changed the api response",
        label: "Breaking changes",
      },
    ],
  },
  "writing-guide": {
    covers: [
      "voice",
      "titles",
      "openings",
      "endings",
      "corporate fluff",
      "filler",
      "AI tells",
    ],
    examples: [
      {
        after:
          "We tried three retry strategies and exponential backoff won. It is not close: constant-interval retries turned a 30 second blip into a 20 minute outage, because every worker woke up at the same moment. Back off, add jitter, move on.",
        before:
          "The team evaluated several approaches to the retry problem. It could be argued that exponential backoff is generally considered a reasonable default in most situations, though it depends on the workload. Ultimately a decision was made to proceed with an implementation.",
        label: "Voice",
      },
      {
        after:
          "Our queue drained 40,000 jobs in four minutes and every one of them was the same job. A retry loop had been feeding itself for six hours, and the dashboards stayed green the whole time.",
        before:
          "Background jobs are an important part of most production systems. In this blog post, we will explore some of the challenges we faced with our queue and share a few lessons learned along the way.",
        label: "Opening",
      },
      {
        after:
          "The job runner has a new scheduler. Median queue wait went from 8 seconds to under 200ms, and the p99 stopped spiking on Mondays.",
        before:
          "We're thrilled to announce that our best-in-class job runner now leverages a robust new scheduler to seamlessly streamline your workflows and unlock significant performance gains.",
        label: "Corporate fluff",
      },
      {
        after:
          "The scheduler is fast, and you will notice it on the first deploy. If you want the old behaviour, there is a flag for it.",
        before:
          "The scheduler is fast — really fast — and you’ll notice it right away. If you’d rather keep the old behaviour, there’s a flag for that.",
        label: "AI tells",
      },
    ],
  },
};

export { type SkillDemo, type SkillExample, skillDemos };
