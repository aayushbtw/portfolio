import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { user } from "@/data/user";

const fontSans = FontSans({
  subsets: ["latin"],
  display: "swap",
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
    <html className={fontSans.className} lang="en">
      <body>
        <Navbar />
        <main className="flex flex-3 flex-col gap-xl">{children}</main>
        <div className="flex flex-1 justify-end" />
      </body>
    </html>
  );
}
