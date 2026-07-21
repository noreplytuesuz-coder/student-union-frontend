import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { languageOptions } from '@/widgets/language-switcher/model/consts';
import { cn } from '@/shared/lib/utils';

const flags: Record<string, React.ReactNode> = {
  en: (
    <svg viewBox="0 0 50 30" className="h-3.5 w-5 shrink-0 rounded-xs border border-gray-200/50 object-cover shadow-xs" xmlns="http://www.w3.org/2000/svg">
      <rect width="50" height="30" fill="#012169" />
      <path d="M0 0 L50 30 M50 0 L0 30" stroke="#fff" strokeWidth="6" />
      <path d="M0 0 L50 30 M50 0 L0 30" stroke="#C8102E" strokeWidth="2" />
      <path d="M25 0 V30 M0 15 H50" stroke="#fff" strokeWidth="10" />
      <path d="M25 0 V30 M0 15 H50" stroke="#C8102E" strokeWidth="6" />
    </svg>
  ),
  ru: (
    <svg viewBox="0 0 30 20" className="h-3.5 w-5 shrink-0 rounded-xs border border-gray-200/50 object-cover shadow-xs" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="20" fill="#fff" />
      <rect y="6.67" width="30" height="6.67" fill="#0039A6" />
      <rect y="13.33" width="30" height="6.67" fill="#D52B1E" />
    </svg>
  ),
  uz: (
    <svg viewBox="0 0 500 250" className="h-3.5 w-5 shrink-0 rounded-xs border border-gray-200/50 object-cover shadow-xs" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="83.3" fill="#0099B5" />
      <rect y="83.3" width="500" height="5" fill="#D52B1E" />
      <rect y="88.3" width="500" height="73.4" fill="#FFFFFF" />
      <rect y="161.7" width="500" height="5" fill="#D52B1E" />
      <rect y="166.7" width="500" height="83.3" fill="#1EB53A" />
      <circle cx="70" cy="41.6" r="22" fill="#FFFFFF" />
      <circle cx="76" cy="41.6" r="22" fill="#0099B5" />
    </svg>
  ),
};

// i18n.language can carry a region suffix (e.g. "en-US"); match on base code.
function baseLng(lng: string) {
  return lng.split('-')[0];
}

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const active = baseLng(i18n.language);
  const current = languageOptions.find((o) => o.value === active);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Select language"
        className="flex items-center rounded-full neo-border p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
      >
        {flags[current?.value || 'en']}
        <ChevronDown className={cn('h-4 w-4 ml-1.5 text-muted transition-transform duration-200', open && 'rotate-180')} />
      </button>

      <div
        className={cn(
          'absolute right-0 top-full z-50 mt-2 w-40 origin-top-right overflow-hidden rounded-2xl neo-border bg-[var(--bg-color)] shadow-lg transition-all duration-200 ease-out',
          open ? 'scale-100 opacity-100 translate-y-0' : 'pointer-events-none scale-95 opacity-0 -translate-y-2',
        )}
      >
        {languageOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              i18n.changeLanguage(opt.value);
              setOpen(false);
            }}
            className={cn(
              'flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors duration-150',
              opt.value === active
                ? 'bg-primary/10 font-medium text-foreground'
                : 'text-muted hover:bg-black/5 dark:hover:bg-white/5',
            )}
          >
            {flags[opt.value]}
            <span className="flex-1 text-left">{opt.label}</span>
            {opt.value === active && <Check className="h-3.5 w-3.5 text-primary" />}
          </button>
        ))}
      </div>
    </div>
  );
}
