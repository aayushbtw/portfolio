import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";

const TITLE = "Writings";
const DESCRIPTION =
  "Notes, ideas, and occasional longer pieces on tech, programming, and whatever else I'm thinking about.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
};

export default function WritingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{TITLE}</CardTitle>
        <CardDescription className="paragraph!">{DESCRIPTION}</CardDescription>
      </CardHeader>

      <CardContent className="mt-sm">WIP</CardContent>
    </Card>
  );
}
