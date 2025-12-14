import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { ProjectLink } from "@/components/project-link";
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
    <Card className="gap-y-md">
      <CardHeader>
        <CardTitle className="stagger-1">{TITLE}</CardTitle>
        <CardDescription className="stagger-2 paragraph!">
          {DESCRIPTION}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ul className={cn("group/list", "stagger-3")}>
          {projects.map((item) => (
            <li key={item.name}>
              <ProjectLink item={item} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
