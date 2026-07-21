import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'dark' | 'light' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  /** Live OS preference so 'system' follows OS changes. */
  systemTheme: ResolvedTheme;
  resolvedTheme: ResolvedTheme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  setSystemTheme: (theme: ResolvedTheme) => void;
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function resolve(theme: Theme, systemTheme: ResolvedTheme): ResolvedTheme {
  return theme === 'system' ? systemTheme : theme;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      systemTheme: getSystemTheme(),
      resolvedTheme: getSystemTheme(),
      isDark: getSystemTheme() === 'dark',
      setSystemTheme: (systemTheme) => {
        const resolvedTheme = resolve(get().theme, systemTheme);
        set({ systemTheme, resolvedTheme, isDark: resolvedTheme === 'dark' });
      },
      setTheme: (theme) => {
        const resolvedTheme = resolve(theme, get().systemTheme);
        set({ theme, resolvedTheme, isDark: resolvedTheme === 'dark' });
      },
    }),
    {
      name: 'studentunion-theme',
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
);

/** Apply the resolved theme to <html> and keep it in sync on every change. */
function applyTheme(resolved: ResolvedTheme) {
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(resolved);
}

// Keep the <html> class in sync with the store without a React re-render cycle
// tied to a specific component. Safe to set up once at module load.
useThemeStore.subscribe((state) => applyTheme(state.resolvedTheme));

// Reactive system preference so 'system' follows OS changes live.
if (typeof window !== 'undefined') {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = () => useThemeStore.getState().setSystemTheme(
    media.matches ? 'dark' : 'light',
  );
  media.addEventListener('change', handler);
}
