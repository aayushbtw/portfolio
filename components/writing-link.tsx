import Link from "next/link";
import type { Writing } from "@/data/writings";
import { formatDate } from "@/lib/utils";

function WritingLink({ item }: { item: Writing }) {
  return (
    <Link className="group flex items-center" href={item.url} key={item.name}>
      <h4 className="subheading font-medium text-[0.9rem]">{item.name}</h4>

      <p className="paragraph text-xs opacity-75 transition-opacity duration-300 group-hover:opacity-100">
        {formatDate(item.date)}
      </p>
    </Link>
  );
}

export { WritingLink };
