import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ApiError } from '@/shared/api';
import { useSessionStore } from './model/authStore';
import type { SessionUser, SignInDto, SignUpDto } from './model/types';
import { sessionApi } from './api/auth';

export const sessionKeys = {
  me: ['session', 'me'] as const,
};

/**
 * Boot-time session hydration. Runs once on app start; a 401 is treated as
 * "guest" rather than an error, so the interceptor's thrown error is
 * swallowed here.
 */
export function useSession() {
  const setUser = useSessionStore((s) => s.setUser);
  const setInitialized = useSessionStore((s) => s.setInitialized);

  return useQuery({
    queryKey: sessionKeys.me,
    queryFn: async () => {
      try {
        const user = await sessionApi.me();
        setUser(user);
        return user;
      } catch (error) {
        const status = (error as ApiError)?.status;
        if (status === 401) {
          setUser(null);
          return null;
        }
        throw error;
      } finally {
        setInitialized(true);
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useSignIn() {
  const queryClient = useQueryClient();
  const setUser = useSessionStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: SignInDto) => sessionApi.signIn(data),
    onSuccess: (user: SessionUser) => {
      setUser(user);
      queryClient.setQueryData(sessionKeys.me, user);
    },
  });
}

export function useSignUp() {
  const queryClient = useQueryClient();
  const setUser = useSessionStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: SignUpDto) => sessionApi.signUp(data),
    onSuccess: (user: SessionUser) => {
      setUser(user);
      queryClient.setQueryData(sessionKeys.me, user);
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  const logout = useSessionStore((s) => s.logout);

  return useMutation({
    mutationFn: () => sessionApi.signOut(),
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
    onError: () => {
      // Even if the server call fails, clear local session.
      logout();
      queryClient.clear();
    },
  });
}
