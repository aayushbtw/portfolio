import { IconArrowUpRight } from "@tabler/icons-react";
import Link from "next/link";
import { projects } from "@/data/projects";
import { user } from "@/data/user";
import { cn, formatDate } from "@/lib/utils";

const writings = [
  {
    name: "Hello World",
    date: "15-01-2024",
    url: "#",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="flex flex-col gap-y-sm">
        <header>
          <h1 className="heading text-lg">{user.name}</h1>
          <h2 className="subheading">{user.designation}</h2>
        </header>

        <div className="flex flex-col gap-y-xs">
          <p className="paragraph">{user.about}</p>
          <p className="paragraph">
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
        </div>
      </section>

      <section className="flex flex-col gap-y-sm">
        <div className="flex items-center justify-between">
          <h2 className="subheading flex items-center gap-x-sm">
            <span className="block h-0.5 w-3 bg-brand" />
            Projects
          </h2>
          <span className="text-xs">View All</span>
        </div>

        <div className="space-y-xs">
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
              <IconArrowUpRight className="size-3 text-fg-2" />
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-y-sm">
        <div className="flex items-center justify-between">
          <h2 className="subheading flex items-center gap-x-sm">
            <span className="block h-0.5 w-3 bg-brand" />
            Writings
          </h2>
          <span className="text-xs">View All</span>
        </div>

        <div className="space-y-xs">
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
        </div>
      </section>
    </>
  );
}
