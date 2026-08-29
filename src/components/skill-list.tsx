import {
  List,
  ListItemDescription,
  ListItemLink,
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
        <ListItemLink
          key={skill.slug}
          params={{ slug: skill.slug }}
          to="/skills/$slug"
        >
          <div className="flex min-w-0 flex-col">
            <ListItemTitle>{skill.title}</ListItemTitle>
            <ListItemDescription>{skill.summary}</ListItemDescription>
          </div>
        </ListItemLink>
      ))}
    </List>
  );
}

export { SkillList, type SkillListItem };
