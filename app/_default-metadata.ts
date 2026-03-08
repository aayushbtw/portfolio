import type { Metadata } from "next";

export const name = "Aayush Agarwal";
const description =
  "I build things for the web. Crafting interfaces that feel natural to use with attention to clarity.";
export const url = "https://aayush.page";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(url),
  title: name,
  description,
  authors: [{ name, url }],
  keywords: [
    "Aayush Agarwal",
    "Fullstack engineer",
    "frontend engineer",
    "backend engineer",
  ],
  openGraph: {
    type: "website",
    siteName: name,
    title: name,
    description,
    locale: "en_US",
    url,
  },
  twitter: {
    card: "summary",
    title: name,
    description,
    creator: "@aayushbtw",
  },
  robots: { index: true, follow: true },
};
