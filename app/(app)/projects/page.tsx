import type { Metadata } from "next";

const TITLE = "Projects";
const DESCRIPTION =
  "Work I've built or contributed to. Mostly things that were interesting to me at the time.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
};

export default function Page() {
  return (
    <section className="flex flex-col gap-y-sm">
      <header>
        <h1 className="heading text-lg">{TITLE}</h1>
        <h2 className="subheading">{DESCRIPTION}</h2>
      </header>

      <p className="paragraph">WIP</p>
    </section>
  );
}
