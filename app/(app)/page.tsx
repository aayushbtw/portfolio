import Image from "next/image";
import {
  IconMapPin,
  IconBrandX,
  IconCode,
  IconPrompt,
  IconArrowUpRight,
  IconBrandLinkedin,
  IconPoint,
} from "@tabler/icons-react";
import { SeparatorPattern } from "@/components/separator";
import { Badge } from "@/components/badge";
import {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelContent,
  PanelEyebrow,
  PanelDescription,
} from "@/components/panel";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { user } from "@/data/user";
import { overview } from "@/data/overview";
import { social } from "@/data/social";
import { SeparatorLabel } from "@/components/separator";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <>
      <SeparatorPattern className="line-after" />
      <UserPanel />

      {/* <SeparatorPattern /> */}
      <ExperiencePanel />
      {/* <SeparatorPattern /> */}
      <ProjectsPanel />
    </>
  );
}

function UserPanel() {
  return (
    <Panel>
      <PanelHeader>
        <PanelEyebrow>{user.designation}</PanelEyebrow>
        <PanelTitle as="h1">{user.name}</PanelTitle>
        <SeparatorLabel>text-base/7 text-muted-foreground</SeparatorLabel>
        <PanelDescription>{user.about}</PanelDescription>
        {/* {social.map((item) => (
          <a key={item.name} href={item.href} target="_blank">
            <div className="flex p-4 items-center gap-4 group">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <item.Icon className="size-10" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg leading-snug font-medium link">
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground">{item.handle}</p>
              </div>
              <IconArrowUpRight className="size-4 text-muted-foreground" />
            </div>
          </a>
        ))} */}
      </PanelHeader>

      <SeparatorPattern />
    </Panel>
  );
}

function ExperiencePanel() {
  return (
    <Panel>
      <PanelHeader>
        <PanelEyebrow>Experience</PanelEyebrow>
        <PanelTitle>Where I’ve Worked</PanelTitle>
        <SeparatorLabel>text-base/7 text-muted-foreground</SeparatorLabel>
        <PanelDescription>
          A timeline of roles, teams, and projects that shaped how I think and
          build.
        </PanelDescription>
      </PanelHeader>
      <PanelContent className="p-2 line-after">
        {experience.map((work) => (
          <div
            key={work.company}
            className="outline outline-border rounded-xl overflow-hidden flex"
          >
            <div className="w-10 bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)] bg-[length:6px_6px] [--pattern-foreground:theme(colors.white)]/10 border-r"></div>

            <div className="flex flex-col text-base/7 text-muted-foreground w-full">
              <div className="flex font-mono font-semibold text-sm tracking-widest text-foreground/40 uppercase p-4 border-b">
                {work.company} / {work.title}
                <span className="ml-auto">
                  {work.duration.from} - {work.duration.to} / {work.type}
                </span>
              </div>

              <ul className="text-base/7 text-muted-foreground p-4">
                {work.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <ul className="gap-2 flex p-4 pt-0">
                {work.tech.map((item) => (
                  <Badge asChild key={item}>
                    <li>{item}</li>
                  </Badge>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </PanelContent>
      <SeparatorPattern />
    </Panel>
  );
}

function ProjectsPanel() {
  return (
    <Panel>
      <PanelHeader>
        <PanelEyebrow>Projects</PanelEyebrow>
        <PanelTitle>Things I’ve Built</PanelTitle>
        <SeparatorLabel>text-base/7 text-muted-foreground</SeparatorLabel>
        <PanelDescription>
          A selection of tools, experiments, and ideas I’ve designed, developed,
          or contributed to.
        </PanelDescription>
      </PanelHeader>
      <PanelContent className="p-0">
        {/* Grid Lines (overlay layer) */}
        <div className="pointer-events-none absolute inset-0 z-10 grid grid-cols-2 gap-5">
          <div className="border-r border"></div>
          <div className="border-l border"></div>
        </div>

        {/* Project Cards */}
        <ul className="grid grid-cols-2 gap-5">
          {projects.map((project, index) => (
            <a
              key={project.name}
              href={project.href}
              target="_blank"
              className={cn(
                "grid p-2",
                index % 2 === 0 ? "line-before line-after" : "",
              )}
            >
              <div className="h-48 border rounded-xl w-full flex flex-col justify-center px-10">
                <div className="max-w-sm">
                  <h6 className="font-mono">{project.name}</h6>
                  <p className="text-sm font-sans text-muted-foreground">
                    {project.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </ul>
      </PanelContent>
      <SeparatorPattern />
    </Panel>
  );
}
