/**
 * Shared API contract types.
 *
 * The Hono backend wraps every response in an envelope
 * `{ message?, code?, data }`. `client.ts` unwraps it so callers work
 * directly with `data`.
 */

export interface ApiEnvelope<T> {
  message?: string;
  code?: number;
  data: T;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface Paginated<T> {
  items: T[];
  pagination: Pagination;
}

/** Error shape thrown by the response interceptor. */
export interface ApiError extends Error {
  status?: number;
  code?: number;
}
