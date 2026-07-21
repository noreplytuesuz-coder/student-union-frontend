import React from 'react';
import { cn } from '@/shared/lib/utils';

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-md bg-gray-300 dark:bg-white/10 overflow-hidden relative",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 dark:via-white/20 to-transparent" />
    </div>
  );
}
