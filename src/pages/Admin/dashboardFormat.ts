import type { CSSProperties } from "react";

// Shared styles and formatters for the admin overview and its charts.
export const CHART_BLUE = "#2a78d6";

export const glass: CSSProperties = {
  background: "rgba(255,255,255,0.4)",
  backdropFilter: "blur(20px) saturate(140%)",
  border: "1.5px solid rgba(255,255,255,0.44)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.05)",
};

export const headingStyle: CSSProperties = {
  color: "rgba(239,68,68,0.95)",
  textShadow:
    "-0.6px -0.6px 0 rgba(255,255,255,0.95), 0.6px -0.6px 0 rgba(255,255,255,0.95), -0.6px 0.6px 0 rgba(255,255,255,0.95), 0.6px 0.6px 0 rgba(255,255,255,0.95), 0 2px 8px rgba(239,68,68,0.18)",
  letterSpacing: "-0.5px",
};

export const bn = (value: number) => value.toLocaleString("bn-BD");

const dayFormat = new Intl.DateTimeFormat("bn-BD", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const fullDayFormat = new Intl.DateTimeFormat("bn-BD", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const monthFormat = new Intl.DateTimeFormat("bn-BD", {
  month: "short",
  year: "2-digit",
  timeZone: "UTC",
});
const fullMonthFormat = new Intl.DateTimeFormat("bn-BD", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export type TrendPoint = { date: string; count: number };
export type Bucket = "day" | "month";

// Short axis label and full tooltip label for a "YYYY-MM-DD" or "YYYY-MM" key.
export function formatBucket(key: string, bucket: Bucket) {
  const date = new Date(
    bucket === "month" ? `${key}-01T00:00:00Z` : `${key}T00:00:00Z`,
  );
  return bucket === "month"
    ? { short: monthFormat.format(date), full: fullMonthFormat.format(date) }
    : { short: dayFormat.format(date), full: fullDayFormat.format(date) };
}
