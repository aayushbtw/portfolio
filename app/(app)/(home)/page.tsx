import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { LinkText } from "@/components/link-text";
import { ProjectLink } from "@/components/project-link";
import { WritingLink } from "@/components/writing-link";
import { projects } from "@/data/projects";
import { user } from "@/data/user";
import { writings } from "@/data/writings";

export default function HomePage() {
  return (
    <>
      <About />
      <Projects />
      <Writings />
    </>
  );
}

function About() {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>{user.designation}</CardDescription>
        </CardHeader>

        <CardContent>
          <p>{user.about}</p>
          <p>
            I'm currently a full-stack engineer at{" "}
            <Link
              className="link"
              href="https://www.netision.com/"
              target="_blank"
            >
              Netision
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

function Projects() {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardDescription className="flex items-center gap-x-sm">
          <span className="block h-0.5 w-md bg-brand" />
          Projects
        </CardDescription>
        <Link className="group" href="/projects">
          <LinkText>View All</LinkText>
        </Link>
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

function Writings() {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardDescription className="flex items-center gap-x-sm">
          <span className="block h-0.5 w-md bg-brand" />
          Writings
        </CardDescription>
        <Link className="group" href="/writings">
          <LinkText>View All</LinkText>
        </Link>
      </CardHeader>

      <CardContent>
        <ul>
          {writings.map((item) => (
            <li key={item.name}>
              <WritingLink item={item} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
