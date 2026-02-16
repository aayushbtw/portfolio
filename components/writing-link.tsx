import Link from "next/link";
import type { Writing } from "@/lib/writings";
import { cn, formatDate } from "@/lib/utils";

function WritingLink({ item }: { item: Writing }) {
  return (
    <Link
      className={cn(
        "group items-center",
        "flex gap-2",
        "transition-all duration-300",
        "group-hover/list:opacity-40",
        "hover:opacity-100"
      )}
      href={`/writings/${item.slug}`}
    >
      <h4 className="subheading">{item.title}</h4>
      <div className={cn("flex grow", "border-b border-dashed")} />
      <time className="text-xs">{formatDate(item.date)}</time>
    </Link>
  );
}

export { WritingLink };
