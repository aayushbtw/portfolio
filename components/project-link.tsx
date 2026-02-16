import { IconArrowUpRight } from "@tabler/icons-react";
import Link from "next/link";
import { AnimatedLinkText } from "@/base/ui/animated-link-text";
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
      <div className="flex-1">
        <h4 className="subheading">{item.name}</h4>
        <p>{item.description}</p>
      </div>

      <AnimatedLinkText>
        <IconArrowUpRight className="size-3" />
      </AnimatedLinkText>
    </Link>
  );
}

export { ProjectLink };
