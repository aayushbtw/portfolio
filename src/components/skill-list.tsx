import { Link } from "@tanstack/react-router";
import {
  List,
  ListItem,
  ListItemDescription,
  ListItemTitle,
} from "~/components/ui/list";

interface SkillListItem {
  slug: string;
  summary: string;
  title: string;
}

function SkillList({ skills }: { skills: SkillListItem[] }) {
  return (
    <List>
      {skills.map((skill) => (
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

export { SkillList, type SkillListItem };
