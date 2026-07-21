/**
 * Centralized, typed access to environment variables.
 *
 * The frontend talks to the backend directly (cross-origin, CORS-enabled on
 * the backend) at its real origin. Override with VITE_API_BASE_URL when
 * deploying or pointing at a different backend.
 */
export const API_BASE_URL: string = import.meta.env.VITE_FRONTEND ?? "http://localhost:8080";

export const IS_DEV: boolean = import.meta.env.DEV;

/** When true, the mock adapter in `shared/api/mock` is installed. */
export const USE_MOCKS: boolean = import.meta.env.VITE_USE_MOCKS === "true" || false;
