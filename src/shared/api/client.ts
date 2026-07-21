import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/shared/config/env';
import type { ApiEnvelope } from './types';

/**
 * Shared HTTP client.
 *
 * Auth model: the backend authenticates via **HTTP-only cookies**
 * (`access` / `refresh`), not a Bearer token. We therefore send
 * credentials with every request and never read/attach a token from
 * localStorage. No auth state is persisted client-side — whether a user
 * is logged in is determined purely by the server.
 *
 * The client transparently recovers from an expired access token using
 * the standard flow: a 401 (on any non-auth endpoint) triggers a
 * single-flight `POST /auth/refresh`; on success the original request is
 * retried once. If refresh also fails, there is no valid session and the
 * request is rejected — the router/UI then prompts the user to sign in or
 * sign up. The client never decides navigation or session state itself.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dedicated instance for the refresh call so its own 401 can't recurse
// into this interceptor.
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Single-flight refresh gate (mirrors the pattern used in other projects).
let isRefreshing = false;
let refreshPromise: Promise<void> = Promise.resolve();

async function refreshToken(): Promise<void> {
  await refreshClient.post('/auth/refresh');
}

async function triggerRefresh(): Promise<void> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = refreshToken().finally(() => {
      isRefreshing = false;
    });
  }
  return refreshPromise;
}

/**
 * Response interceptor: unwrap the backend envelope
 * `{ message?, code?, data }` and return `data` directly, so callers
 * receive the typed payload. Non-2xx responses are normalized into a
 * typed `ApiError` thrown to TanStack Query — except a recoverable 401,
 * which is handled by refreshing the session and retrying once.
 */
apiClient.interceptors.response.use(
  (response) => {
    const body = response.data as ApiEnvelope<unknown>;
    // If the backend returns the envelope shape, surface `data`.
    if (body && typeof body === 'object' && 'data' in body) {
      response.data = (body as ApiEnvelope<unknown>).data;
    }
    return response;
  },
  async (error: AxiosError<ApiEnvelope<unknown>>) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retried?: boolean })
      | undefined;

    // Standard token-refresh recovery: a 401 on an endpoint we haven't
    // already retried triggers a single-flight /auth/refresh. On success the
    // original request is retried once. If refresh also fails, there is no
    // valid session — reject and let the router prompt sign in / sign up.
    //
    // Only endpoints that EXCHANGE credentials are exempt: a 401 from
    // /auth/sign-in (bad credentials), /auth/sign-up, /auth/google and
    // /auth/change-password (wrong old password) is the real answer — do NOT
    // try to "fix" it by refreshing. Notably, /auth/me is NOT exempt: a 401
    // there means the access token simply expired, and a valid refresh
    // cookie should silently re-authenticate the returning user.
    // The refresh call itself uses a separate client with no interceptor,
    // so it can't recurse here.
    const url = originalRequest?.url ?? '';
    const isAuthRoute =
      url.startsWith('/auth/sign-in') ||
      url.startsWith('/auth/sign-up') ||
      url.startsWith('/auth/google') ||
      url.startsWith('/auth/change-password');
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retried &&
      !isAuthRoute
    ) {
      try {
        await triggerRefresh();
        originalRequest._retried = true;
        return apiClient(originalRequest);
      } catch {
        const envelope = error.response?.data;
        const apiError = Object.assign(new Error(envelope?.message ?? 'Session expired'), {
          status: 401,
          code: envelope?.code,
        });
        return Promise.reject(apiError);
      }
    }

    const envelope = error.response?.data;
    const message = envelope?.message ?? error.message ?? 'Something went wrong';
    const apiError = Object.assign(new Error(message), {
      status: error.response?.status,
      code: envelope?.code,
    });
    return Promise.reject(apiError);
  },
);

export type { InternalAxiosRequestConfig };
