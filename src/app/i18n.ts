import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'ru', 'uz'],
    // Allow region variants (e.g. en-US) to fall back to the base language.
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    debug: false,
    // Return the key (not null) for missing translations — null breaks rendering.
    returnNull: false,
    interpolation: {
      // React already escapes; disabling avoids double-escaping.
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      // Persist the choice in localStorage to match prior behaviour (key: app-language).
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'app-language',
      caches: ['localStorage'],
    },
    react: {
      // Avoid needing a <Suspense> boundary around every consumer; components
      // re-render automatically once the JSON for the active language loads.
      useSuspense: false,
    },
  });

export { i18n };
export default i18n;
