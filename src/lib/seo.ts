interface PageOptions {
  description: string;
  domain: string;
  meta?: Record<string, string>[];
  title: string;
}

export function seo({ description, domain, meta, title }: PageOptions) {
  const ogImage = `${domain}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: ogImage },
      { property: "og:image:alt", content: title },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
      { name: "twitter:image:alt", content: title },
      ...(meta ?? []),
    ],
  };
}
