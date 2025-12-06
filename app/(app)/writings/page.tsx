import type { Metadata } from "next";

const TITLE = "Writings";
const DESCRIPTION =
  "Notes, ideas, and occasional longer pieces on tech, programming, and whatever else I'm thinking about.";

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
