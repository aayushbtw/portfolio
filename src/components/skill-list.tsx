import {
  List,
  ListItemLeader,
  ListItemLink,
  ListItemMeta,
  ListItemTitle,
} from "~/components/ui/list";

interface SkillListItem {
  category: string;
  slug: string;
  title: string;
}

function SkillList({ skills }: { skills: SkillListItem[] }) {
  return (
    <List>
      {skills.map((skill) => (
        <ListItemLink
          className="gap-sm rounded-full"
          key={skill.slug}
          params={{ slug: skill.slug }}
          to="/skills/$slug"
        >
          <ListItemTitle className="truncate">{skill.title}</ListItemTitle>
          <ListItemLeader />
          <ListItemMeta>{skill.category}</ListItemMeta>
        </ListItemLink>
      ))}
    </List>
  );
}

export { SkillList, type SkillListItem };
