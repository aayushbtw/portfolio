import type { Metadata } from "next";
import { Hanken_Grotesk as FontSans } from "next/font/google";
import "./global.css";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Aayush Agarwal",
  description:
    "I build things for the web. Crafting interfaces that feel natural to use with attention to clarity.",
};

const links = [
  { name: "Home", url: "/" },
  { name: "Projects", url: "/projects" },
  { name: "Writings", url: "/writings" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={fontSans.className} lang="en">
      <body
        className={cn(
          fontSans.variable,
          "font-normal text-base text-fg-3 antialiased",
          "min-h-screen px-6 pt-page-t pb-6 md:px-10",
          "bg-bg-1 selection:bg-brand/20",
          "mx-auto w-full max-w-6xl"
          // "flex flex-col gap-7 md:grid md:grid-cols-[100px_minmax(0,1fr)] lg:grid-cols-[200px_minmax(0,1fr)_200px]"
        )}
      >
        <div className="flex flex-col gap-y-6 md:grid md:grid-cols-[auto_1fr] md:items-baseline md:gap-x-6 lg:grid-cols-[1fr_var(--spacing-content-width)_1fr]">
          <Navbar links={links} />

          <main
            className={cn(
              "prose min-w-0 max-w-full",
              "prose-headings:heading",
              "prose-p:paragraph",
              "prose-a:link",
              "prose-ul:lists"
              // "prose-ul:prose-p:m-0 prose-ul:list-none prose-li:px-0 prose-ul:px-0 prose-ul:prose-a:font-normal prose-ul:prose-headings:font-normal prose-ul:prose-a:no-underline"
            )}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
