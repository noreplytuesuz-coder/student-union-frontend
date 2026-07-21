import React from 'react';
import { cn } from '@/shared/lib/utils';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-xl neo-border bg-[var(--bg-color)] px-4 py-2.5 text-base text-foreground',
        'placeholder:text-muted-foreground/60 transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-xl neo-border bg-[var(--bg-color)] px-4 py-2.5 text-base text-foreground',
        'placeholder:text-muted-foreground/60 transition-colors resize-y min-h-[120px]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          'w-full appearance-none rounded-xl neo-border bg-[var(--bg-color)] px-4 py-2.5 pr-10 text-base text-foreground',
          'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          'cursor-pointer',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  ),
);
Select.displayName = 'Select';
