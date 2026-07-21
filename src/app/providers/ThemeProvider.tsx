import type React from 'react';
import { useEffect } from 'react';
import { useThemeStore, type Theme } from '@/entities/theme/model/themeStore';

export type { Theme };

/**
 * Backwards-compatible theme hook. Backed by a zustand store
 * (`entities/theme/model/themeStore`), so consumers keep working unchanged.
 *
 * Note: the store module itself applies the `light`/`dark` class to <html>
 * and tracks live OS preference via `matchMedia`. This provider additionally
 * applies on mount to guarantee correct styling on the very first paint.
 */
export function useTheme() {
  const theme = useThemeStore((s) => s.theme);
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);
  const isDark = useThemeStore((s) => s.isDark);
  const setTheme = useThemeStore((s) => s.setTheme);

  return { theme, resolvedTheme, isDark, setTheme };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  return <>{children}</>;
}
