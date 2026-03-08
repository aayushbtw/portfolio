import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { config } from "./config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  const targetDate = new Date(date.includes("T") ? date : `${date}T00:00:00`);

  return targetDate.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function generateMetadata({
  title = config.name,
  description = config.description,
  url = "/",
}: {
  title?: string;
  description?: string;
  url?: string;
}) {
  return {
    metadataBase: new URL(config.url),
    title,
    description,
    authors: [{ name: config.name, url: config.url }],
    keywords: [
      "Aayush Agarwal",
      "Fullstack engineer",
      "frontend engineer",
      "backend engineer",
    ],
    openGraph: {
      type: "website",
      siteName: config.name,
      title,
      description,
      locale: "en_US",
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@aayushbtw",
    },
    robots: { index: true, follow: true },
    alternates: { canonical: url },
  };
}
