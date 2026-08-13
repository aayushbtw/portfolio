import * as stylex from "@stylexjs/stylex";
import { IconArrowRight } from "@tabler/icons-react";
import { Link, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { Box } from "~/components/primitives/box";
import { Icon } from "~/components/primitives/icon";
import { Text } from "~/components/primitives/text";
import {
  List,
  ListItem,
  ListItemHover,
  listStyles,
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
            {...stylex.props(listStyles.link)}
            params={{ slug: skill.slug }}
            to="/skills/$slug"
          >
            <Box display="flex" flexDirection="column" shrink>
              <Text as="span" variant="row-title">
                {skill.title}
              </Text>
              <Text variant="row">{skill.summary}</Text>
            </Box>

            <ListItemHover>
              <Icon as={IconArrowRight} color="fg-3" size="md" />
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
