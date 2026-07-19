import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const compact = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 2,
});
const exact = new Intl.NumberFormat("en");

export function formatCompact(value: number) {
  return compact.format(value);
}

export function formatNumber(value: number) {
  return exact.format(value);
}

export function formatDate(date: string) {
  const targetDate = new Date(date.includes("T") ? date : `${date}T00:00:00`);

  return targetDate.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
