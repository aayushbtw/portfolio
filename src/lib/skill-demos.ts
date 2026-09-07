// The page sells a skill rather than reprinting it: the text itself is on
// GitHub and skills.sh, and a visitor deciding whether to install one wants to
// see what it does to their work, not read its rules. The prose lives here
// rather than in the skills submodule, which is written for agents.
//
// Both panels must say the same thing. If the subject changes between them the
// reader cannot tell craft from content, and the pair proves nothing.
//
// `mono` is for a demo made of lines rather than sentences.
interface SkillDemo {
  after: string;
  before: string;
  heading: string;
  mono?: boolean;
  note: string;
}

const skillDemos: Record<string, SkillDemo> = {
  "git-commit": {
    after:
      "fix(api): handle null response from payment gateway\nrefactor(db): extract query builder into a module\nperf(search): add index on users.email",
    before: "update code\nfixed some stuff\nwip",
    heading: "What it does to a commit message",
    mono: true,
    note: "The same three commits. Type and scope in front, so the log reads as a list of changes rather than a list of days.",
  },
  "writing-guide": {
    after:
      "I replaced five parts of my terminal last year and three were worth keeping. Ghostty renders fast enough that I stopped noticing the terminal was there. Starship costs about 40ms on every prompt and I keep it anyway. The other two are gone.",
    before:
      "We're excited to share some thoughts on our development environment. It's worth noting that choosing the right terminal setup can significantly improve your workflow. In this blog post, we will explore some best-in-class tools that help streamline your daily tasks and empower you to be more productive.",
    heading: "What it does to an opening",
    note: "The same post, opened twice. Nine filler phrases gone, and what is left carries a number and takes a position.",
  },
};

export { type SkillDemo, skillDemos };
