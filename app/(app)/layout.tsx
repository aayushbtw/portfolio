import { Hanken_Grotesk as FontSans } from "next/font/google";
import "./global.css";
import { Navbar } from "@/components/navbar";
import { cn, generateMetadata } from "@/lib/utils";

export const metadata = generateMetadata({});

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
          "bg-bg-1 selection:bg-brand/20",
          "mx-auto max-w-7xl px-4 pt-2 pb-8 sm:px-6 sm:pt-page-t"
        )}
      >
        <div className="lg:grid lg:grid-cols-[1fr_minmax(0,740px)_1fr] lg:gap-8">
          <Navbar links={links} />

          <main
            className={cn(
              "prose min-w-0 max-w-full",
              "prose-headings:heading",
              "prose-p:paragraph",
              "prose-a:link",
              "prose-ul:lists",
              "prose-pre:codeblock prose-figure:bg-bg-2"
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
