import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const [day, month, year] = dateString.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  const d = String(date.getDate()).padStart(2, "0");
  const m = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const y = String(date.getFullYear()).slice(-2);

  return `${d} ${m} ${y}`;
}
