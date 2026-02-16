import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/base/ui/card";
import { List } from "@/components/list";
import { WritingLink } from "@/components/writing-link";
import { writings } from "@/data/writings";

const TITLE = "Writings";
const DESCRIPTION =
  "Notes, ideas, and occasional longer pieces on tech, programming, and whatever else I'm thinking about.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
};

export default function WritingsPage() {
  return (
    <Card className="gap-y-4">
      <CardHeader>
        <CardTitle className="stagger-1">{TITLE}</CardTitle>
        <CardDescription className="stagger-2 text-fg-3">
          {DESCRIPTION}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <List className="stagger-3">
          {writings.map((item) => (
            <li key={item.name}>
              <WritingLink item={item} />
            </li>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
