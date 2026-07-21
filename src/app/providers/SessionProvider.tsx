import { useSession } from '@/entities/session';
import { Spinner } from '@/shared/ui';
import React from 'react';

interface SessionProviderProps {
  children: React.ReactNode;
}

/**
 * Runs the boot-time session hydration (`GET /auth/me`) exactly once and
 * waits until it resolves (or fails with 401) before rendering the app.
 * This keeps route guards (`ProtectedRoute`) correct on first paint.
 */
export function SessionProvider({ children }: SessionProviderProps) {
  const { isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Loading…" />
      </div>
    );
  }

  return <>{children}</>;
}
