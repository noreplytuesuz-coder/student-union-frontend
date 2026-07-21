import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind class names with conditional logic. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const DATETIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

/** Format an ISO date string (or Date) into a short human-readable form. */
export function formatDate(value: string | Date | undefined): string {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '—';
  return DATE_FORMATTER.format(date);
}

/** Format an ISO date string (or Date) including the time. */
export function formatDateTime(value: string | Date | undefined): string {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '—';
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
