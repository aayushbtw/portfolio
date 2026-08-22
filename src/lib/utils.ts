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
