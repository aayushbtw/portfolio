import { IconArrowUpRight } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { projects } from "@/data/projects";
import { cn } from "@/lib/utils";

const TITLE = "Projects";
const DESCRIPTION =
  "Work I've built or contributed to. Mostly things that were interesting to me at the time.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
};

export default function ProjectsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{TITLE}</CardTitle>
        <CardDescription className="paragraph!">{DESCRIPTION}</CardDescription>
      </CardHeader>

      <CardContent className="mt-sm">
        {projects.map((item) => (
          <Link
            className={cn(
              "grid grid-cols-[100px_1fr_auto] items-center gap-4",
              "transition-all duration-300 hover:ps-sm"
            )}
            href={item.url}
            key={item.name}
            target="_blank"
          >
            <h4 className="subheading font-medium text-[0.9rem]">
              {item.name}
            </h4>
            <p className="paragraph text-[0.9rem]">{item.description}</p>
            <span className="paragraph inline-flex items-center">
              [<IconArrowUpRight className="size-3 text-fg-2" />]
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
