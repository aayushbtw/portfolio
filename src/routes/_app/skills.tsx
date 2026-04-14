import { IconArrowUpRight } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { List, ListItem, ListItemHover } from "@/components/ui/list";
import { config } from "@/lib/config";
import { seo } from "@/lib/seo";

const title = "Skills";
const description =
  "A collection of skills crafted for quality of life with your AI coding agent.";

export const Route = createFileRoute("/_app/skills")({
  loader: () => [
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
  ],
  head: () => ({
    ...seo({ title, description, path: "/skills" }),
  }),
  component: SkillsPage,
});

function SkillsPage() {
  const skills = Route.useLoaderData();

  return (
    <section>
      <h1 className="text-fg-3 text-xs uppercase tracking-widest">{title}</h1>
      <List className="mt-2">
        {skills.map((item) => (
          <ListItem key={item.title}>
            <a
              className="flex items-center gap-4"
              href={`${item.url}?utm_source=${config.domain}`}
              rel="noopener"
              target="_blank"
            >
              <div className="flex flex-col">
                <h6 className="text-fg-2 capitalize">{item.title}</h6>
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
