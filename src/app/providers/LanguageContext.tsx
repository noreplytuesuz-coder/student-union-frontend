import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/app/i18n';

/**
 * Backwards-compatible language hook, now backed by i18next (react-i18next)
 * instead of React Context. `useLanguage()` keeps the same shape
 * (`{ t, language, setLanguage }`) so existing call sites keep working.
 */
export function useLanguage() {
  const { t } = useTranslation();
  return {
    t,
    language: i18n.language,
    setLanguage: (lng: string) => i18n.changeLanguage(lng),
  };
}

/**
 * No-op wrapper kept for backwards compatibility with App.tsx. i18next is
 * initialised in `@/app/i18n` (imported once in main.tsx), so there is no
 * provider tree to wrap. It simply renders its children.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
