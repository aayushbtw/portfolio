import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelContent,
  PanelEyebrow,
  PanelDescription,
} from "@/components/panel";
import { projects } from "@/data/projects";
import { user } from "@/data/user";

export default function HomePage() {
  return (
    <>
      <UserPanel />
      <ProjectsPanel />
    </>
  );
}

function UserPanel() {
  return (
    <Panel>
      <PanelHeader>
        <PanelEyebrow>{user.designation}</PanelEyebrow>
        <PanelTitle as="h1" className="mb-3">
          Hello, I'm {user.name}
        </PanelTitle>
        <PanelDescription>{user.about}</PanelDescription>
        <ul className="flex gap-4 items-center text-muted-foreground">
          {user.social.map((item) => (
            <li key={item.name}>
              <a
                href={item.url}
                target="_blank"
                className="bg-card-primary hover:bg-card-secondary hover:scale-105 font-medium text-sm border border-border/60 rounded-xl px-3 h-9 inline-flex items-center justify-center"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </PanelHeader>
    </Panel>
  );
}

function ProjectsPanel() {
  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>Projects</PanelTitle>
      </PanelHeader>

      <PanelContent>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((project) => (
            <li key={project.name}>
              <Card className="hover:bg-card-secondary">
                <a
                  href={project.href}
                  target="_blank"
                  className="h-64 flex flex-col"
                >
                  <CardContent>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:128px_96px] bg-center" />
                    <div className="shadow-xl relative z-10 size-14 rounded-xl border bg-[linear-gradient(135deg,var(--color-card-primary)_0%,var(--color-card-secondary)_100%)] flex items-center justify-center">
                      <project.icon className="size-8 text-foreground/80" />
                    </div>
                  </CardContent>

                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                </a>
              </Card>
            </li>
          ))}
        </ul>
      </PanelContent>
    </Panel>
  );
}
