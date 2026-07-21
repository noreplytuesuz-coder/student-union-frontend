import React from 'react';
import { cn } from '@/shared/lib/utils';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'info';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-black/5 text-foreground dark:bg-white/10',
  primary: 'bg-primary/15 text-primary',
  success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  warning: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  info: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
  danger: 'bg-red-500/15 text-red-600 dark:text-red-400',
  neutral: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}

const STATUS_MAP: Record<string, { variant: BadgeVariant; dot: string }> = {
  published: { variant: 'success', dot: 'bg-emerald-500' },
  draft: { variant: 'neutral', dot: 'bg-gray-400' },
  upcoming: { variant: 'info', dot: 'bg-sky-500' },
  ongoing: { variant: 'success', dot: 'bg-emerald-500' },
  completed: { variant: 'primary', dot: 'bg-primary' },
  cancelled: { variant: 'danger', dot: 'bg-red-500' },
  active: { variant: 'success', dot: 'bg-emerald-500' },
  inactive: { variant: 'neutral', dot: 'bg-gray-400' },
};

export function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase();
  const cfg = STATUS_MAP[key] ?? { variant: 'neutral' as BadgeVariant };
  return (
    <Badge variant={cfg.variant} className="px-3 py-1 capitalize">
      {status}
    </Badge>
  );
}
