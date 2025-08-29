import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
  PanelDescription,
} from "@/components/panel";
import { IconEye } from "@tabler/icons-react";
import Link from "next/link";

export default function CraftsPage() {
  const items = [
    {
      icon: IconEye,
      name: "Card",
      url: "/crafts/card",
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
          {items.map((item) => (
            <li key={item.name}>
              <Card className="hover:bg-card-secondary">
                <Link href={item.url} className="h-64 flex flex-col">
                  <CardContent>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:128px_96px] bg-center" />
                    <div className="shadow-xl relative z-10 size-14 rounded-xl border bg-[linear-gradient(135deg,var(--color-card-primary)_0%,var(--color-card-secondary)_100%)] flex items-center justify-center">
                      <item.icon className="size-8 text-foreground/80" />
                    </div>
                  </CardContent>

                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                  </CardHeader>
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      </PanelContent>
    </Panel>
  );
}
