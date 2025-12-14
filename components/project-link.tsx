import { IconArrowRight, IconArrowUpRight } from "@tabler/icons-react";
import Link from "next/link";
import { LinkText } from "@/components/link-text";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

function ProjectLink({ item }: { item: Project }) {
  return (
    <Link
      className="group grid grid-cols-[auto_100px_1fr_auto] items-center gap-4"
      href={item.url}
      target="_blank"
    >
      <IconArrowRight
        className={cn(
          "size-3.5 transition-all duration-300",
          "transition-all duration-300",
          "-translate-x-2 opacity-0",
          "group-hover:translate-x-0 group-hover:opacity-100"
        )}
      />
      <h4 className={cn("subheading", "font-medium text-[0.9rem]")}>
        {item.name}
      </h4>
      <p
        className={cn(
          "paragraph",
          "text-[0.9rem]",
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
