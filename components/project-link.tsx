import { IconArrowUpRight } from "@tabler/icons-react";
import Link from "next/link";
import { LinkText } from "@/components/link-text";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

function ProjectLink({ item }: { item: Project }) {
  return (
    <Link
      className={cn(
        "group items-center",
        "flex gap-2",
        "transition-all duration-300",
        "group-hover/list:opacity-40",
        "hover:opacity-100"
      )}
      href={item.url}
      target="_blank"
    >
      <h4 className={cn("subheading", "w-[100px]")}>{item.name}</h4>

      <p className={cn("paragraph", "flex-1")}>{item.description}</p>

      <LinkText>
        <IconArrowUpRight className="size-3" />
      </LinkText>
    </Link>
  );
}

export { ProjectLink };
