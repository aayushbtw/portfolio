import { config } from "@/lib/config";

interface BaseOptions {
  description: string;
  path: string;
  title: string;
}

interface WebsiteOptions extends BaseOptions {
  type?: "website";
}

interface ArticleOptions extends BaseOptions {
  article: {
    author: string;
    publishedAt: string;
    modifiedAt: string;
  };
  type: "article";
}

type PageOptions = (ArticleOptions | WebsiteOptions) & {
  extra?: {
    links?: Record<string, string>[];
    meta?: Record<string, string>[];
    scripts?: { type: string; children: string }[];
  };
};

function pageLinks(options: Pick<BaseOptions, "path">) {
  return [{ rel: "canonical", href: `${config.domain}${options.path}` }];
}

function pageMeta(options: PageOptions) {
  const { description, path, title } = options;
  const type = options.type ?? "website";
  const ogImageText = type === "article" ? title : description;
  const ogImage = `${config.domain}/api/og?title=${encodeURIComponent(ogImageText)}`;

  const meta = [
    { title },
    { name: "description", content: description },
    { property: "og:type", content: type },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: `${config.domain}${path}` },
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

  if (options.type === "article") {
    meta.push(
      { property: "article:author", content: options.article.author },
      {
        property: "article:published_time",
        content: options.article.publishedAt,
      },
      {
        property: "article:modified_time",
        content: options.article.modifiedAt,
      }
    );
  }

  return meta;
}

function pageScripts(options: PageOptions) {
  const scripts: { type: string; children: string }[] = [];

  if (options.type === "article") {
    const { description, title } = options;
    const ogImage = `${config.domain}/api/og?title=${encodeURIComponent(title)}`;

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
        dateModified: options.article.modifiedAt,
      }),
    });
  }

  return scripts;
}

export function seo(options: PageOptions) {
  const { extra } = options;
  return {
    links: [...pageLinks(options), ...(extra?.links ?? [])],
    meta: [...pageMeta(options), ...(extra?.meta ?? [])],
    scripts: [...pageScripts(options), ...(extra?.scripts ?? [])],
  };
}
