import {
  JetBrains_Mono as FontMono,
  Hanken_Grotesk as FontSans,
} from "next/font/google";
import "./global.css";
import { cn, generateMetadata } from "@/lib/utils";

export const metadata = generateMetadata({});

const fontSans = FontSans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const fontMono = FontMono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={cn(fontSans.variable, fontMono.variable)} lang="en">
      <body
        className={cn(
          "font-normal font-sans text-base text-fg-3 antialiased",
          "bg-bg-1 selection:bg-brand/20"
        )}
      >
        {children}
      </body>
    </html>
  );
}
