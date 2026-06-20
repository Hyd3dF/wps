import { clsx, type ClassValue } from "clsx";
import { translate, type Locale } from "@/lib/i18n-shared";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1000000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "B";
  return (n / 1000000).toFixed(1) + "M";
}

export function timeAgo(iso: string, locale: Locale = "tr"): string {
  const date = new Date(iso);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return translate(locale, "time.justNow");
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return translate(locale, "time.minutes", { n: minutes });
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return translate(locale, "time.hours", { n: hours });
  const days = Math.floor(hours / 24);
  if (days < 30) return translate(locale, "time.days", { n: days });
  const months = Math.floor(days / 30);
  if (months < 12) return translate(locale, "time.months", { n: months });
  const years = Math.floor(months / 12);
  return translate(locale, "time.years", { n: years });
}

export function formatDate(iso: string, locale: Locale = "tr"): string {
  return new Date(iso).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "#6C63FF",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#8B85FF",
  "#06B6D4",
  "#EC4899",
  "#14B8A6",
];

export function colorFromString(s: string): string {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = s.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
