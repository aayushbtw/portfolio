import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
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
    <Card className="gap-y-md">
      <CardHeader>
        <CardTitle>{TITLE}</CardTitle>
        <CardDescription className="paragraph!">{DESCRIPTION}</CardDescription>
      </CardHeader>

      <CardContent>
        <ul>
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
