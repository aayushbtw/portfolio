import { IconArrowUpRight } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { List, ListItem, ListItemHover } from "~/components/ui/list";
import { seo } from "~/lib/seo";

const title = "Skills";
const description =
  "A collection of skills crafted for quality of life with your AI coding agent.";

const skills = [
  {
    title: "Git Commit",
    description: "Stage files and commit with a conventional commit message.",
    url: "https://skills.sh/aayushbtw/skills/git-commit",
  },
  {
    title: "Writing Guide",
    description: "Write, review, and improve articles and blog posts.",
    url: "https://skills.sh/aayushbtw/skills/writing-guide",
  },
];

export const Route = createFileRoute("/_app/skills")({
  head: () => seo({ title, description }),
  component: SkillsPage,
});

function SkillsPage() {
  return (
    <section>
      <h1 className="text-eyebrow">{title}</h1>
      <List>
        {skills.map((item) => (
          <ListItem key={item.title}>
            <a
              className="row-link"
              href={item.url}
              rel="noopener"
              target="_blank"
            >
              <div className="flex flex-col">
                <span className="text-fg-2 capitalize">{item.title}</span>
                <p>{item.description}</p>
              </div>

              <ListItemHover>
                <IconArrowUpRight />
              </ListItemHover>
            </a>
          </ListItem>
        ))}
      </List>
    </section>
  );
}
