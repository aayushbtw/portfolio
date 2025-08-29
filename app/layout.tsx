import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { IBM_Plex_Mono as FontMono, Inter as FontSans } from "next/font/google";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const fontSans = FontSans({
  weight: ["400", "500", "600"],
  display: "swap",
  subsets: ["latin"],
  variable: "--sans",
});

const fontMono = FontMono({
  weight: ["400", "500", "600"],
  display: "swap",
  subsets: ["latin"],
  variable: "--mono",
});

export const metadata: Metadata = {
  title: "Aayush",
  description:
    "Building things that feel simple and useful, with attention to clarity and thoughtful interfaces while keeping it reliable and professional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "bg-background text-foreground font-sans leading-relaxed antialiased",
          fontSans.variable,
          fontMono.variable,
        )}
      >
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 pb-20 space-y-20">
          {children}
        </main>
      </body>
    </html>
  );
}
