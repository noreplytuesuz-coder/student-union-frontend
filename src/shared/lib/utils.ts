import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names with conditional logic. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const DATETIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** Format an ISO date string (or Date) into a short human-readable form. */
export function formatDate(value: string | Date | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return DATE_FORMATTER.format(date);
}

/** Format an ISO date string (or Date) including the time. */
export function formatDateTime(value: string | Date | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return DATETIME_FORMATTER.format(date);
}

/**
 * Resolve an entity image/file field into a renderable URL.
 *
 * The backend stores either an absolute public URL (MinIO publicUrl) or a
 * user-provided external URL, so the value is already renderable. This
 * helper exists as the single place to apply that resolution policy and a
 * graceful fallback.
 */
export function getImageUrl(value?: string | null): string | undefined {
  if (!value) return undefined;
  return value;
}

/**
 * Formats a number into a readable short string (e.g., 500 -> "500", 1500 -> "1.5k", 2500000 -> "2.5M").
 *
 * @param value The number to format
 * @param decimals Number of decimal places to allow (default: 1)
 */
export function formatCompactNumber(value: number, decimals: number = 1): string {
  if (isNaN(value) || value === null) return "0";

  const absoluteValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  // 0 - 999: Return standard string
  if (absoluteValue < 1000) {
    return `${value}`;
  }

  // 1,000 - 999,999: Format as 'k'
  if (absoluteValue < 1_000_000) {
    const formatted = (absoluteValue / 1000).toFixed(decimals);
    // Remove unnecessary trailing '.0' (e.g., "1.0k" -> "1k", "1.5k" stays "1.5k")
    const cleanNumber = parseFloat(formatted);
    return `${sign}${cleanNumber}k`;
  }

  // 1,000,000+: Format as 'M'
  const formatted = (absoluteValue / 1_000_000).toFixed(decimals);
  const cleanNumber = parseFloat(formatted);
  return `${sign}${cleanNumber}M`;
}
