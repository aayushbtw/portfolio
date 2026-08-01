import { IconArrowRight } from "@tabler/icons-react";
import { Link, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { allSkills } from "content-collections";
import { List, ListItem, ListItemHover } from "~/components/ui/list";

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
              <span className="text-fg-2">{skill.title}</span>
              <p>{skill.summary}</p>
            </div>

            <ListItemHover>
              <IconArrowRight aria-hidden="true" />
            </ListItemHover>
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

    const MDXContent = skill.mdx;

    return {
      ...skill,
      mdx: await renderServerComponent(<MDXContent />),
    };
  });

function getSkillList() {
  return skillListFn();
}

function getSkillBySlug(slug: string) {
  return skillBySlugFn({ data: slug });
}

export { getSkillBySlug, getSkillList };
