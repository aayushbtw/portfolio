import fs from "node:fs";
import path from "node:path";

export type Writing = {
  slug: string;
  title: string;
  date: string;
  description: string;
};

const contentDir = path.join(process.cwd(), "content");

export function getWritings(): Writing[] {
  const slugs = fs
    .readdirSync(contentDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const writings: Writing[] = [];

  for (const slug of slugs) {
    const mdxPath = path.join(contentDir, slug, "content.mdx");
    if (!fs.existsSync(mdxPath)) {
      continue;
    }

    const content = fs.readFileSync(mdxPath, "utf-8");
    const metadataMatch = content.match(
      /export const metadata = \{([^}]+)\}/s
    );

    if (!metadataMatch) {
      continue;
    }

    const titleMatch = metadataMatch[1].match(/title:\s*"([^"]+)"/);
    const dateMatch = metadataMatch[1].match(/date:\s*"([^"]+)"/);
    const descriptionMatch = metadataMatch[1].match(
      /description:\s*"([^"]+)"/
    );

    writings.push({
      slug,
      title: titleMatch?.[1] ?? slug,
      date: dateMatch?.[1] ?? "",
      description: descriptionMatch?.[1] ?? "",
    });
  }

  return writings.sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split("-").map(Number);
    const [dayB, monthB, yearB] = b.date.split("-").map(Number);
    return (
      new Date(yearB, monthB - 1, dayB).getTime() -
      new Date(yearA, monthA - 1, dayA).getTime()
    );
  });
}
