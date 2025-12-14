import Link from "next/link";
import type { Writing } from "@/data/writings";
import { cn, formatDate } from "@/lib/utils";

function WritingLink({ item }: { item: Writing }) {
  return (
    <Link
      className={cn(
        "group items-center",
        "flex gap-2",
        "transition-all duration-300",
        "hover:pl-xs"
      )}
      href={item.url}
      key={item.name}
    >
      <h4 className={cn("subheading", "text-[0.9rem]")}>{item.name}</h4>

      <div
        className={cn(
          "flex grow border-b border-dashed",
          "transition-all duration-300",
          "group-hover:border-fg-3"
        )}
      />

      <time
        className={cn(
          "paragraph",
          "text-xs",
          "transition-all duration-300",
          "text-fg-3 group-hover:text-fg-2"
        )}
      >
        {formatDate(item.date)}
      </time>
    </Link>
  );
}

export { WritingLink };
