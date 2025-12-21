import type { Metadata } from "next";
import { Hanken_Grotesk as FontSans } from "next/font/google";
import "@/base/globals.css";
import { Navbar } from "@/base/navbar";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
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
    <html className={cn(fontSans.variable, "antialiased")} lang="en">
      <body>
        <header>
          <Navbar links={links} />
        </header>
        <main>{children}</main>
        <div className="hidden flex-1 justify-end md:flex" />
      </body>
    </html>
  );
}
