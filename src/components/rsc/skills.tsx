import { Link, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import {
  List,
  ListItem,
  ListItemDescription,
  ListItemTitle,
} from "~/components/ui/list";
import { allSkills } from "~/lib/content";
import { renderMarkdown } from "~/lib/markdown";

function sortedSkills() {
  return allSkills.toSorted((a, b) => a.title.localeCompare(b.title));
}

function SkillList() {
  return (
    <List>
      {sortedSkills().map((skill) => (
        <ListItem key={skill.slug}>
          <Link
            className="row-link"
            params={{ slug: skill.slug }}
            to="/skills/$slug"
          >
            <div className="flex min-w-0 flex-col">
              <ListItemTitle>{skill.title}</ListItemTitle>
              <ListItemDescription>{skill.summary}</ListItemDescription>
            </div>
          </Link>
        </ListItem>
      ))}
    </List>
  );
}

const skillListFn = createServerFn({ method: "GET" }).handler(() =>
  renderServerComponent(<SkillList />)
);

const skillBySlugFn = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const skill = allSkills.find((s) => s.slug === slug);
    if (!skill) {
      throw notFound();
    }

    const { document, ...meta } = skill;

    return {
      ...meta,
      body: await renderServerComponent(renderMarkdown(document)),
    };
  });

function getSkillList() {
  return skillListFn();
}

function getSkillBySlug(slug: string) {
  return skillBySlugFn({ data: slug });
}

export { getSkillBySlug, getSkillList };
