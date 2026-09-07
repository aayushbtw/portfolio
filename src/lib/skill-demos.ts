// The page sells a skill rather than reprinting it: the text is on GitHub and
// skills.sh, and a visitor deciding whether to install one wants to see what it
// does to their work. This file is the whole of what the site says about a
// skill, so it stays readable without the skills repo checked out.
//
// Both sides of an example must say the same thing. If the subject changes
// between them the reader cannot tell craft from content, and the pair proves
// nothing.
interface SkillExample {
  after: string;
  before: string;
  // Names what is being rewritten: a title, an opening, a subject line.
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
      "atomic commits",
      "splitting a diff",
    ],
    examples: [
      {
        after: "fix(api): handle null response from payment gateway",
        before: "update code",
        label: "Subject",
      },
      {
        after:
          "feat(auth): add refresh token rotation\ntest(auth): cover expired refresh tokens\ndocs(auth): document the rotation window",
        before: "wip\nmore wip\nfinal fixes",
        label: "A day's log",
        mono: true,
      },
    ],
  },
  "writing-guide": {
    covers: [
      "voice",
      "structure",
      "titles",
      "openings",
      "banned language",
      "AI tells",
    ],
    examples: [
      {
        after:
          "Your JavaScript bundle has 47% dead code. Here's how to find it",
        before: "Performance improvements in v4.2",
        label: "Title",
      },
      {
        after:
          "Our cache hit rate dropped to 12% on a Tuesday morning and nobody noticed for six hours. The invalidation strategy we had trusted for three years had a race condition in it.",
        before:
          "Caching is an important part of any modern web application. In this article, we will explore some best practices for cache invalidation and share some exciting improvements we've made.",
        label: "Opening",
      },
      {
        after: "We rewrote the cache. p99 dropped from 340ms to 45ms.",
        before:
          "We're excited to announce that we've leveraged a best-in-class caching layer to seamlessly streamline performance.",
        label: "Sentence",
      },
    ],
  },
};

export { type SkillDemo, type SkillExample, skillDemos };
