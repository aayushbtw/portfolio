import {
  IconMapPin,
  IconBrandX,
  IconCode,
  IconPrompt,
  IconArrowUpRight,
  IconBrandLinkedin,
  IconPoint,
} from "@tabler/icons-react";

import { Separator } from "@/components/separator";
import { Badge } from "@/components/badge";
import {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelContent,
} from "@/components/panel";

import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { user } from "@/data/user";
import { overview } from "@/data/overview";
import { social } from "@/data/social";

export default function HomePage() {
  return (
    <>
      <Separator />
      <UserPanel />
      <Separator />
      <OverviewPanel />
      <Separator />
      <SocialPanel />
      <Separator />
      <ExperiencePanel />
      <Separator />
      <ProjectsPanel />
    </>
  );
}

function UserPanel() {
  return (
    <Panel>
      <PanelContent className="p-4 space-y-2">
        <h1 className="flex items-center text-3xl font-semibold">
          {user.name}
        </h1>
        <p className="font-mono text-sm text-balance text-muted-foreground select-none">
          {user.designation}
        </p>
      </PanelContent>
    </Panel>
  );
}

function OverviewPanel() {
  return (
    <Panel>
      <h2 className="sr-only">Overview</h2>
      <PanelContent className="p-4 space-y-2">
        {overview.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 font-mono text-sm"
          >
            <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <item.Icon className="size-4" />
            </div>
            <p className="text-balance">{item.description}</p>
          </div>
        ))}
      </PanelContent>
    </Panel>
  );
}

function SocialPanel() {
  return (
    <Panel>
      <h2 className="sr-only">Social</h2>
      <PanelContent className="divide-y divide-x divide-edge grid grid-cols-2">
        {social.map((item) => (
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
        ))}
      </PanelContent>
    </Panel>
  );
}

function ExperiencePanel() {
  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>Experience</PanelTitle>
      </PanelHeader>
      <PanelContent className="px-4">
        {experience.map((work) => (
          <div className="line-after py-4" key={work.company}>
            <h3 className="text-lg leading-snug font-medium mb-2">
              {work.company}
            </h3>

            <div className="before:absolute before:bg-border before:h-full before:left-3 before:w-px relative">
              {/*  */}
              <div className="relative z-1 mb-1 flex items-center gap-3 bg-background">
                <div className="flex items-center gap-4 font-mono text-sm">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <IconCode className="size-4" />
                  </div>
                </div>
                <div>
                  <p className="text-balance">{work.title}</p>
                </div>
              </div>
              {/*  */}
              <div className="pl-9 text-muted-foreground">
                <p className="text-sm space-x-2">
                  <span>{work.type}</span>
                  <span className="text-border">|</span>
                  <span>
                    {work.duration.from} - {work.duration.to}
                  </span>
                </p>
                <div className="py-2 prose prose-invert prose-sm prose-zinc text-foreground font-mono max-w-none">
                  <ul>
                    {work.responsibilities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {/*  */}
              <div className="relative z-1 mb-1 flex items-center gap-3 bg-background rounded-lg border p-2">
                <ul className="gap-2 flex">
                  {work.tech.map((item) => (
                    <Badge asChild key={item}>
                      <li>{item}</li>
                    </Badge>
                  ))}
                </ul>
              </div>
              {/*  */}
            </div>
          </div>
        ))}
      </PanelContent>
    </Panel>
  );
}

function ProjectsPanel() {
  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>Projects</PanelTitle>
      </PanelHeader>
      <PanelContent className="divide-y divide-edge">
        {projects.map((project) => (
          <a href={project.href} target="_blank" key={project.name}>
            <div className="hover:bg-muted/40 group">
              <div className="flex items-center border-b border-edge">
                <div className="px-4">
                  <IconPrompt className="size-8" />
                </div>
                <div className="flex-1 pl-4 py-4 border-l">
                  <h3 className="text-lg leading-snug font-medium link">
                    {project.name}
                  </h3>
                </div>
                <IconArrowUpRight className="mr-4 size-4 text-muted-foreground" />
              </div>

              <div className="p-4 space-y-2">
                <div className="prose prose-invert prose-sm prose-zinc text-foreground font-mono max-w-none">
                  <p>{project.description}</p>
                </div>

                <ul className="flex gap-2">
                  {project.tech.map((item) => (
                    <Badge asChild key={item}>
                      <li>{item}</li>
                    </Badge>
                  ))}
                </ul>
              </div>
            </div>
          </a>
        ))}
      </PanelContent>
    </Panel>
  );
}
