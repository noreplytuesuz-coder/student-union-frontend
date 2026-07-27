import { useLanguage } from "@/app/providers/LanguageContext";
import { useGoogleAuth } from "@/features/auth/hooks/useGoogleAuth";
import { Loader2 } from "lucide-react";

export function GoogleButton({ mode }: { mode: "signin" | "signup" }) {
  const { t } = useLanguage();
  const { isLoading, triggerAuth } = useGoogleAuth();

  const handleClick = () => {
    triggerAuth();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={`
        relative flex w-full items-center justify-center gap-3 rounded-full
        neo-border bg-[var(--bg-color)] px-4 py-3 font-heading text-sm font-bold
        text-foreground transition-all duration-300
        hover:bg-black/5 dark:hover:bg-white/5
        ${isLoading ? "animate-pulse ring-2 ring-blue-400/50 ring-offset-2" : ""}
      `}
    >
      {isLoading ? (
        <>
          <div className="relative h-5 w-5">
            <Loader2 size={18} className="absolute inset-0 animate-spin text-blue-500" />
            <svg className="absolute inset-0 h-5 w-5 -rotate-90 transform" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-blue-200 dark:text-blue-800"
              />
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="62.83"
                strokeDashoffset="15.7"
                className="text-blue-500 transition-all duration-500 ease-in-out"
              />
            </svg>
          </div>
          <span>{t("Signing in…")}</span>
        </>
      ) : (
        <>
          <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.4-.1-2.7-.4-3.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5 16.3 4.5 9.5 8.9 6.3 14.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 43.5c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 34.6 26.7 35.5 24 35.5c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.5 39.6 16.2 43.5 24 43.5z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.6l6.3 5.2C41.4 36 43.5 30.5 43.5 24c0-1.4-.1-2.7-.4-3.5z"
            />
          </svg>
          <span>{mode === "signup" ? t("Continue with Google") : t("Continue with Google")}</span>
        </>
      )}
    </button>
  );
}
