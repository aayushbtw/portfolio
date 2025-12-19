import type { Metadata } from "next";
import { Hanken_Grotesk as FontSans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { user } from "@/data/user";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: user.name,
  description: user.about,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={cn(fontSans.variable, "antialiased")} lang="en">
      <body
        className={cn(
          "bg-bg-1 text-[15px] text-fg-3 leading-[1.65] selection:bg-brand/10",
          // Layout
          "mx-auto flex w-full max-w-260 flex-col px-sm py-xl md:flex-row md:py-7xl"
        )}
      >
        <div className="flex flex-1 justify-start">
          <Navbar />
        </div>
        <main className="mt-md flex flex-4 flex-col gap-xl md:mt-0">
          {children}
        </main>
        <div className="hidden flex-1 justify-end md:flex" />
      </body>
    </html>
  );
}
