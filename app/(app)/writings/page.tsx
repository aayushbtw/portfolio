import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/base/ui/card";
import { WritingLink } from "@/components/writing-link";
import { writings } from "@/data/writings";
import { cn } from "@/lib/utils";

const TITLE = "Writings";
const DESCRIPTION =
  "Notes, ideas, and occasional longer pieces on tech, programming, and whatever else I'm thinking about.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
};

export default function WritingsPage() {
  return (
    <Card className="gap-y-md">
      <CardHeader>
        <CardTitle className="stagger-1">{TITLE}</CardTitle>
        <CardDescription className="stagger-2 paragraph!">
          {DESCRIPTION}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ul className={cn("group/list", "stagger-3")}>
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
