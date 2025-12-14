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
        <CardTitle>{TITLE}</CardTitle>
        <CardDescription className="paragraph!">{DESCRIPTION}</CardDescription>
      </CardHeader>

      <CardContent>
        <ul>
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
