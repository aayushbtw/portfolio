import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  const targetDate = new Date(date.includes("T") ? date : `${date}T00:00:00`);

  return targetDate.toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
