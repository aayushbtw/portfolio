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
      <body className="mx-auto flex w-full max-w-280 flex-col px-sm py-xl antialiased md:flex-row md:py-20">
        <div className="flex flex-1 justify-start">
          <Navbar />
        </div>
        <main className="mt-md flex flex-3 flex-col gap-xl md:mt-0">
          {children}
        </main>
        <div className="hidden flex-1 justify-end md:flex" />
      </body>
    </html>
  );
}
