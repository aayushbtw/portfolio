import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";

const links = [
  { name: "Home", url: "/" },
  { name: "Projects", url: "/projects" },
  { name: "Writings", url: "/writings" },
];

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-2 pb-8 sm:px-6 sm:pt-page-t lg:grid lg:grid-cols-[1fr_minmax(0,740px)_1fr] lg:gap-8">
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
  );
}
