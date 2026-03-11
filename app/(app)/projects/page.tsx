import { ListProjects } from "@/components/list-projects";
import { generateMetadata } from "@/lib/utils";
import { content } from "./_content";

export const metadata = generateMetadata({
  title: content.title,
  description: content.description,
  url: content.url,
});

export default function ProjectsPage() {
  return (
    <>
      <h1 data-title>Projects</h1>
      <ListProjects />
    </>
  );
}
