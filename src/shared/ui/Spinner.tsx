import { cn } from '@/shared/lib/utils';

interface SpinnerProps {
  className?: string;
  label?: string;
}

/** Indeterminate loading spinner. */
export function Spinner({ className, label }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={cn('inline-flex items-center gap-2 text-muted-foreground', className)}
    >
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      {label ? <span>{label}</span> : null}
    </span>
  );
}
