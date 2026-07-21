import { Spinner } from '@/shared/ui';
import { selectIsAdmin, useSessionStore } from '@/entities/session';
import type { UserRole } from '@/entities/session';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  /** Minimum role required. `user` = admin, `member` = student. */
  requiredRole?: UserRole;
  children?: React.ReactNode;
}

export function ProtectedRoute({ requiredRole = 'user', children }: ProtectedRouteProps) {
  const isInitialized = useSessionStore((s) => s.isInitialized);
  const user = useSessionStore((s) => s.user);
  const isAdmin = useSessionStore(selectIsAdmin);

  // Wait for the boot-time session hydration to resolve before deciding.
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Loading…" />
      </div>
    );
  }

  if (requiredRole === 'user' && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === 'member' && !user) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
