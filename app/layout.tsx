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
      <body className="mx-auto flex w-full max-w-280 flex-col px-4 py-xl antialiased md:flex-row md:py-20">
        <div className="mb-sm flex flex-1 justify-start md:mb-0">
          <Navbar />
        </div>
        <main className="flex flex-3 flex-col gap-xl">{children}</main>
        <div className="hidden flex-1 justify-end md:flex" />
      </body>
    </html>
  );
}
