// The page sells a skill rather than reprinting it: the text itself is on
// GitHub and skills.sh, and a visitor deciding whether to install one wants to
// see what it does to their work, not read its rules. The prose lives here
// rather than in the skills submodule, which is written for agents.
//
// `mono` is for a demo made of lines rather than sentences.
interface SkillDemo {
  after: string;
  before: string;
  mono?: boolean;
}

const skillDemos: Record<string, SkillDemo> = {
  "git-commit": {
    after:
      "fix(api): handle null response from payment gateway\nrefactor(db): extract query builder into a module\nperf(search): add index on users.email",
    before: "update code\nfixed some stuff\nwip",
    mono: true,
  },
  "writing-guide": {
    after:
      "Our dev server took 16 seconds to answer its first request. One import was the whole problem: pulling a single icon from the package entry dragged in all 6093 of them, and dev serves modules unbundled, so nothing is tree-shaken away. Per-icon imports cut it to 4 seconds. A barrel import costs nothing in a production build and everything in development.",
    before:
      "We're excited to announce some robust improvements to our development experience. It's worth noting that our tooling was basically leveraging a suboptimal module resolution strategy, which significantly impacted cold start times. By seamlessly migrating to a best-in-class icon solution, we were able to streamline the workflow and unlock substantial gains for developers.",
  },
};

export { type SkillDemo, skillDemos };
