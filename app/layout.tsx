import type { Metadata } from "next";
import { IBM_Plex_Mono as FontMono, Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { user } from "@/data/user";

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
  title: user.name,
  description: user.about,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(fontSans.variable, fontMono.variable)}>
        <Navbar />
        <main className="flex flex-3 flex-col gap-lg">{children}</main>
        <div className="flex flex-1 justify-end" />
      </body>
    </html>
  );
}
