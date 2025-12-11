import { IconArrowUpRight } from "@tabler/icons-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { projects } from "@/data/projects";
import { user } from "@/data/user";
import { cn, formatDate } from "@/lib/utils";

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
        <span className="text-xs">[ View All ]</span>
      </CardHeader>

      <CardContent>
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

function Writings() {
  const writings = [
    {
      name: "Hello World",
      date: "15-01-2024",
      url: "#",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardDescription className="flex items-center gap-x-sm">
          <span className="block h-0.5 w-md bg-brand" />
          Writings
        </CardDescription>
        <span className="text-xs">[ View All ]</span>
      </CardHeader>

      <CardContent>
        {writings.map((item) => (
          <Link
            className={cn(
              "flex items-center gap-sm",
              "transition-all duration-300 hover:ps-sm"
            )}
            href={item.url}
            key={item.name}
          >
            <h4 className="subheading font-medium text-[0.9rem]">
              {item.name}
            </h4>
            <div className="flex grow border-b border-dashed" />
            <p className="paragraph font-light text-xs">
              {formatDate(item.date)}
            </p>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
