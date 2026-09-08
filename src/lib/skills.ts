// Every skill the site shows, and everything it says about one. The skills
// themselves live in their own repo and on skills.sh; this page argues for
// them rather than reprinting them, so there is nothing here to keep in sync
// with a SKILL.md and no reason to vendor one.
//
// A skill absent from this list is absent from the site. git-commit ships in
// the repo and is left out here on purpose: a conventional commit demonstrates
// itself and does not need a page arguing for it.
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

interface Skill {
  // Topics the skill covers, rendered into the sentence above the examples.
  covers: string[];
  examples: SkillExample[];
  // Matches the directory in the skills repo; it is the install argument.
  slug: string;
  // One human sentence. The skill's own frontmatter runs long and is addressed
  // to an agent, so it is not reused here.
  summary: string;
  title: string;
}

const skills: Skill[] = [
  {
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
    slug: "writing-guide",
    summary:
      "Write, review, and improve articles and blog posts with clear structure, strong voice, and polished prose.",
    title: "Writing Guide",
  },
];

function getSkill(slug: string) {
  return skills.find((skill) => skill.slug === slug);
}

export { getSkill, type Skill, type SkillExample, skills };
