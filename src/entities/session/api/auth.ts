import { apiClient } from '@/shared/api';
import type { SessionUser, SignInDto, SignUpDto } from '../model/types';

/**
 * Session API. Auth is cookie-based (HTTP-only `access`/`refresh`), so no
 * token is attached or returned — the interceptor in `shared/api/client`
 * unwraps the envelope and returns `data` directly.
 */
export const sessionApi = {
  signIn: (data: SignInDto) =>
    apiClient.post<SessionUser>('/auth/sign-in', data).then((r) => r.data),

  signUp: (data: SignUpDto) =>
    apiClient.post<SessionUser>('/auth/sign-up', data).then((r) => r.data),

  signOut: () => apiClient.post<null>('/auth/sign-out').then((r) => r.data),

  refresh: () => apiClient.post<null>('/auth/refresh').then((r) => r.data),

  changePassword: (data: { oldPassword?: string; newPassword: string }) =>
    apiClient.patch<SessionUser>('/auth/change-password', data).then((r) => r.data),

  /**
   * Google sign-in/up. Sends the raw Google ID token; the backend verifies
   * it and sets our OWN auth cookies (no Google OAuth session is kept).
   */
  googleSignIn: (data: { idToken: string; name?: string; image?: string }) =>
    apiClient.post<SessionUser>('/auth/google', data).then((r) => r.data),

  /** Returns the current user from the `access` cookie, or null if unauthenticated. */
  me: () => apiClient.get<SessionUser>('/auth/me').then((r) => r.data),
};
