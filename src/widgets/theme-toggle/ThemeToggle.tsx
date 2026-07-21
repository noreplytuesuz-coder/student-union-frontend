import { useTheme } from '@/app/providers/ThemeProvider';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { isDark, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={`flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 transition-colors ${className}`}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
