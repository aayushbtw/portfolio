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
  return [{ href: `${config.domain}${options.path}`, rel: "canonical" }];
}

function pageMeta(options: PageOptions) {
  const { description, path, title } = options;
  const type = options.type ?? "website";
  const ogImageText = type === "article" ? title : description;
  const ogImage = `${config.domain}/api/og?title=${encodeURIComponent(ogImageText)}`;

  const meta = [
    { title },
    { content: description, name: "description" },
    { content: type, property: "og:type" },
    { content: title, property: "og:title" },
    { content: description, property: "og:description" },
    { content: `${config.domain}${path}`, property: "og:url" },
    { content: config.name, property: "og:site_name" },
    { content: ogImage, property: "og:image" },
    { content: ogImageText, property: "og:image:alt" },
    { content: "summary_large_image", name: "twitter:card" },
    { content: config.socials.twitter, name: "twitter:site" },
    { content: config.socials.twitter, name: "twitter:creator" },
    { content: title, name: "twitter:title" },
    { content: description, name: "twitter:description" },
    { content: ogImage, name: "twitter:image" },
    { content: ogImageText, name: "twitter:image:alt" },
  ];

  if (options.type === "article") {
    meta.push(
      { content: options.article.author, property: "article:author" },
      {
        content: options.article.publishedAt,
        property: "article:published_time",
      },
      {
        content: options.article.modifiedAt,
        property: "article:modified_time",
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
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        author: {
          "@type": "Person",
          name: options.article.author,
        },
        dateModified: options.article.modifiedAt,
        datePublished: options.article.publishedAt,
        description,
        headline: title,
        image: ogImage,
      }),
      type: "application/ld+json",
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
