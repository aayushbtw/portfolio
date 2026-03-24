"use client";

import { IconArrowUpRight, IconStarFilled } from "@tabler/icons-react";
import Link from "next/link";
import useSWR from "swr";
import { config } from "@/lib/config";
import { fetcher, octo, type PinnedRepo } from "@/lib/octo";

function ListProjects() {
  const { data, error, isLoading } = useSWR(
    octo.pinned,
    fetcher<PinnedRepo[]>,
    { revalidateOnFocus: false, dedupingInterval: 86_400_000 }
  );

  if (isLoading) {
    return <ListProjectsFallback />;
  }

  if (error || !data) {
    return <ListProjectsError />;
  }

  return (
    <ul className="group">
      {data.map((item) => (
        <li
          className="m-0! border-border border-t first:border-t-0"
          key={item.repo}
        >
          <Link
            className="flex items-center gap-4 py-2.5 text-sm transition-opacity hover:opacity-100! group-hover:opacity-40"
            href={`${item.url}?utm_source=${config.domain}`}
            rel="noopener"
            target="_blank"
          >
            <span className="w-22">{item.repo}</span>
            <span className="max-w-130 flex-1 overflow-hidden text-fg-3">
              {item.description}
            </span>
            <span className="ml-auto inline-flex items-center gap-1 text-fg-3/50 tabular-nums [&_svg]:size-2.5">
              <IconStarFilled />
              {item.stars}
            </span>
            <IconArrowUpRight className="size-4 text-fg-3/50" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ListProjectsFallback() {
  return (
    <ul>
      {["a", "b", "c", "d", "e"].map((id) => (
        <li className="m-0! border-border border-t first:border-t-0" key={id}>
          <div className="flex items-center gap-4 py-2.5">
            <span className="h-5 w-22 animate-pulse rounded bg-bg-2" />
            <span className="h-5 flex-1 animate-pulse rounded bg-bg-2" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function ListProjectsError() {
  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-xs">
        <ListProjectsFallback />
      </div>
      <p className="absolute inset-0 flex items-center justify-center text-fg-3 text-sm">
        Failed to load projects.
      </p>
    </div>
  );
}

export { ListProjects };
