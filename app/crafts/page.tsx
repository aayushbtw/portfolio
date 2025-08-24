import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
  PanelDescription,
} from "@/components/panel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { CraftCard } from "@/components/crafts/card/card";
import { IconEye } from "@tabler/icons-react";

export default function CraftsPage() {
  const projects = [
    {
      icon: IconEye,
      name: "Card",
      description: "Monitor server stats via ssh",
      href: "https://github.com/aayushbtw/monit",
    },
  ];
  return (
    <Panel>
      <PanelHeader>
        <PanelTitle as="h1" className="font-medium text-[22px] mb-0">
          Crafts
        </PanelTitle>
        <PanelDescription>
          A small collection of handcrafted React components.
        </PanelDescription>
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
                    {/*<CardDescription>{project.description}</CardDescription>*/}
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
