import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Tailwind v4 declares the theme in CSS, which tailwind-merge cannot read: it
 * groups a class by guessing from the name. Every other scale on this site
 * reuses a stock name and is grouped for free, but the spacing scale is
 * lettered where Tailwind's is numeric, so it has to be named here or `p-xs`
 * and `p-md` both survive a merge. Add a step in app.css, add it here.
 */
const twMerge = extendTailwindMerge({
  extend: { theme: { spacing: ["xs", "sm", "md", "lg", "xl", "2xl"] } },
});

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

/**
 * Dates are parsed *and* formatted in UTC, so the server and the browser agree
 * whatever timezone either sits in. Parsing a bare "2026-03-27" as local time
 * is what makes a post drift a day either way.
 */
export function toUtcDate(date: string) {
  return new Date(date.includes("T") ? date : `${date}T00:00:00Z`);
}

const longDate = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});

const numericDate = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "2-digit",
  timeZone: "UTC",
});

const shortDate = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

/** "March 27, 2026" */
export function formatDate(date: string) {
  return longDate.format(toUtcDate(date));
}

/** "03/27" */
export function formatNumericDate(date: string) {
  return numericDate.format(toUtcDate(date));
}

/** "Mar 27" */
export function formatShortDate(date: string) {
  return shortDate.format(toUtcDate(date));
}
