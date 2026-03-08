import { Hanken_Grotesk as FontSans } from "next/font/google";
import { defaultMetadata } from "@/app/_default-metadata";
import "./global.css";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";

export const metadata = { ...defaultMetadata };

const fontSans = FontSans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

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
          // "min-h-screen px-6 pt-page-t pb-6 md:px-10",
          "bg-bg-1 selection:bg-brand/20",
          // "mx-auto w-full max-w-7xl",
          "mx-auto max-w-7xl px-4 pt-2 pb-8 sm:px-6 sm:pt-page-t"
          // "flex flex-col gap-7 md:grid md:grid-cols-[100px_minmax(0,1fr)] lg:grid-cols-[200px_minmax(0,1fr)_200px]"
        )}
      >
        <div className="lg:grid lg:grid-cols-[1fr_minmax(0,2.5fr)_1fr] lg:gap-8">
          <Navbar links={links} />

          <main
            className={cn(
              "prose min-w-0 max-w-full",
              "prose-headings:heading",
              "prose-p:paragraph",
              "prose-a:link",
              "prose-ul:lists",
              "prose-pre:codeblock prose-figure:bg-bg-2"
              // "prose-ul:prose-p:m-0 prose-ul:list-none prose-li:px-0 prose-ul:px-0 prose-ul:prose-a:font-normal prose-ul:prose-headings:font-normal prose-ul:prose-a:no-underline"
            )}
          >
            {children}
          </main>

          <div />
        </div>
      </body>
    </html>
  );
}
