import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cn, formatDate } from "@/lib/utils";
import { getWritings } from "@/lib/writings";

type Params = { slug: string };

export function generateStaticParams() {
  return getWritings().map((w) => ({ slug: w.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const writing = getWritings().find((w) => w.slug === slug);
  if (!writing) {
    return {};
  }
  return {
    title: writing.title,
    description: writing.description,
  };
}

export default async function WritingPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const writing = getWritings().find((w) => w.slug === slug);

  if (!writing) {
    notFound();
  }

  const { default: Content } = await import(`@/content/${slug}/content.mdx`);

  return (
    <article className="flex flex-col gap-y-2">
      {/* <header className="mb-8">
        <h1 className="heading stagger-1">{writing.title}</h1>
        <time className="stagger-2 text-fg-3 text-xs">
          {formatDate(writing.date)}
        </time>
      </header>
      <div className="prose prose-gray stagger-3 max-w-none text-fg-3">
        <Content />
      </div> */}

      <header className="flex flex-col">
        <time className="stagger-1 text-fg-3 text-sm">
          {formatDate(writing.date)}
        </time>
        <h1 className="stagger-2 font-medium text-2xl text-fg-1">
          {writing.title}
        </h1>
        <p className="stagger-3 text-fg-3">{writing.description}</p>
      </header>

      <div
        className={cn(
          "stagger-4 prose",
          "prose-headings:mb-1 prose-headings:font-medium prose-headings:text-base prose-headings:text-fg-1",
          "prose-p:mt-1"
        )}
      >
        <Content />
      </div>
    </article>
  );
}
