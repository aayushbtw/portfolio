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
        "hover:pl-xs"
      )}
      href={item.url}
      target="_blank"
    >
      <h4 className={cn("subheading", "text-[0.9rem]", "w-[100px] shrink-0")}>
        {item.name}
      </h4>

      <p
        className={cn(
          "paragraph",
          "flex-1 text-[0.9rem]",
          "transition-all duration-300",
          "text-fg-3 group-hover:text-fg-2"
        )}
      >
        {item.description}
      </p>
      <LinkText>
        <IconArrowUpRight className="size-3" />
      </LinkText>
    </Link>
  );
}

export { ProjectLink };
