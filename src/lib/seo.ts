import { config } from "@/lib/config";

interface BaseMetaOptions {
  description: string;
  path: string;
  title: string;
}

interface WebsiteMetaOptions extends BaseMetaOptions {
  type?: "website";
}

interface ArticleMetaOptions extends BaseMetaOptions {
  article: {
    author: string;
    publishedAt: string;
  };
  type: "article";
}

type PageMetaOptions = ArticleMetaOptions | WebsiteMetaOptions;

export function pageMeta(options: PageMetaOptions) {
  const { description, path, title } = options;
  const url = `${config.domain}${path}`;
  const type = options.type ?? "website";
  const ogImageText = type === "article" ? title : description;
  const ogImage = `${config.domain}/api/og?title=${encodeURIComponent(ogImageText)}`;

  const links = [{ rel: "canonical", href: url }];

  const meta = [
    { title },
    { name: "description", content: description },
    { property: "og:type", content: type },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:site_name", content: config.name },
    { property: "og:image", content: ogImage },
    { property: "og:image:alt", content: ogImageText },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: config.socials.twitter },
    { name: "twitter:creator", content: config.socials.twitter },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
    { name: "twitter:image:alt", content: ogImageText },
  ];

  const scripts: { type: string; children: string }[] = [];

  if (options.type === "article") {
    meta.push(
      { property: "article:author", content: options.article.author },
      {
        property: "article:published_time",
        content: options.article.publishedAt,
      }
    );
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        image: ogImage,
        author: {
          "@type": "Person",
          name: options.article.author,
        },
        datePublished: options.article.publishedAt,
      }),
    });
  }

  return { links, meta, scripts };
}
