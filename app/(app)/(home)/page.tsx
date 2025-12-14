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
          <CardTitle className="stagger-1">{user.name}</CardTitle>
          <CardDescription className="stagger-2">
            {user.designation}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="stagger-3">{user.about}</p>
          <p className="stagger-4">
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
      <CardHeader className="stagger-5 flex items-center justify-between">
        <CardDescription className="flex items-center gap-x-sm">
          <span className="block h-0.5 w-md bg-brand" />
          Projects
        </CardDescription>
        <Link className="group" href="/projects">
          <LinkText>View All</LinkText>
        </Link>
      </CardHeader>

      <CardContent>
        <ul className="stagger-6">
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
      <CardHeader className="stagger-7 flex items-center justify-between">
        <CardDescription className="flex items-center gap-x-sm">
          <span className="block h-0.5 w-md bg-brand" />
          Writings
        </CardDescription>
        <Link className="group" href="/writings">
          <LinkText>View All</LinkText>
        </Link>
      </CardHeader>

      <CardContent>
        <ul className="stagger-8">
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
