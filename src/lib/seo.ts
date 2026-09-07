import { config } from "./config";

interface PageOptions {
  description: string;
  meta?: Record<string, string>[];
  title: string;
}

export function seo({ description, meta, title }: PageOptions) {
  const ogImage = `${config.siteUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;

  return {
    meta: [
      { title },
      { content: description, name: "description" },
      { content: "website", property: "og:type" },
      { content: title, property: "og:title" },
      { content: description, property: "og:description" },
      { content: ogImage, property: "og:image" },
      { content: title, property: "og:image:alt" },
      { content: title, name: "twitter:title" },
      { content: description, name: "twitter:description" },
      { content: ogImage, name: "twitter:image" },
      { content: title, name: "twitter:image:alt" },
      ...(meta ?? []),
    ],
  };
}
