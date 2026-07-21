import { useLanguage } from '@/app/providers/LanguageContext';
import { sessionApi } from '@/entities/session';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';
const SCRIP_URL = 'https://accounts.google.com/gsi/client';

function loadGsiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById('google-gsi')) return resolve();
    const s = document.createElement('script');
    s.id = 'google-gsi';
    s.src = SCRIP_URL;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load Google script'));
    document.head.appendChild(s);
  });
}

export function GoogleButton({ mode }: { mode: 'signin' | 'signup' }) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const googleMutation = useMutation({
    mutationFn: (idToken: string) => sessionApi.googleSignIn({ idToken }),
    onSuccess: (user) => {
      navigate(user.role === 'user' ? '/admin' : '/');
    },
  });

  const handleClick = async () => {
    if (!GOOGLE_CLIENT_ID) {
      console.error('VITE_GOOGLE_CLIENT_ID is not set');
      return;
    }
    try {
      await loadGsiScript();
      const accounts = (window as any).google?.accounts?.id;
      if (!accounts) throw new Error('Google Identity Services unavailable');

      accounts.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (resp: { credential?: string }) => {
          if (resp.credential) googleMutation.mutate(resp.credential);
        },
      });
      // One Tap / account-picker; the callback above receives the ID token.
      accounts.prompt();
    } catch (err) {
      console.error('Google sign-in failed:', err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={googleMutation.isPending}
      className="flex w-full items-center justify-center gap-3 rounded-full neo-border bg-[var(--bg-color)] px-4 py-3 font-heading text-sm font-bold text-foreground transition-colors hover:bg-black/5 dark:hover:bg-white/5"
    >
      {googleMutation.isPending ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.4-.1-2.7-.4-3.5z" />
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5 16.3 4.5 9.5 8.9 6.3 14.7z" />
          <path fill="#4CAF50" d="M24 43.5c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 34.6 26.7 35.5 24 35.5c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.5 39.6 16.2 43.5 24 43.5z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.6l6.3 5.2C41.4 36 43.5 30.5 43.5 24c0-1.4-.1-2.7-.4-3.5z" />
        </svg>
      )}
      <span>{mode === 'signup' ? t('Continue with Google') : t('Continue with Google')}</span>
    </button>
  );
}
