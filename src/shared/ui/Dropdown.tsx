import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/lib/utils';

export interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface DropdownProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options?: DropdownOption[];
  children?: React.ReactNode;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}

/**
 * Fully custom select replacement - no OS-rendered popup, so option styling
 * is 100% under our control (theme bg/text, hover, radius). The panel is
 * portaled to <body> so it escapes modal/overflow clipping.
 */
export function Dropdown({
  value,
  defaultValue,
  onChange,
  options = [],
  children,
  placeholder = 'Select…',
  className,
  disabled,
  id,
}: DropdownProps) {
  const [internal, setInternal] = useState(defaultValue ?? '');
  const current = value !== undefined ? value : internal;
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 0,
  });
  const triggerRef = useRef<HTMLButtonElement>(null);

  const items: DropdownOption[] = options.length
    ? options
    : (Array.isArray(children) ? children : [children])
        .filter(Boolean)
        .map((node) => {
          const el = node as React.ReactElement<{ value?: string; children?: React.ReactNode }>;
          return {
            value: el.props?.value ?? '',
            label:
              typeof el.props?.children === 'string'
                ? el.props.children
                : (el.props?.value ?? ''),
          };
        });

  const selected = items.find((o) => o.value === current)?.label;

  const position = () => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setCoords({ top: r.bottom + 6, left: r.left, width: r.width });
  };

  const toggle = () => {
    if (disabled) return;
    if (!open) position();
    setOpen((o) => !o);
  };

  const choose = (v: string) => {
    if (value === undefined) setInternal(v);
    onChange?.(v);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onScroll = () => position();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-xl neo-border bg-[var(--bg-color)] px-4 py-2.5 text-base text-foreground',
          'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          'cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      >
        <span className={cn('truncate', !selected && 'text-muted-foreground/60')}>
          {selected ?? placeholder}
        </span>
        <svg
          className={cn(
            'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
            open && 'rotate-180',
          )}
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
      </button>

      {open &&
        createPortal(
          <div
            className="fixed z-[100] max-h-[60vh] overflow-y-auto rounded-xl neo-border bg-[var(--bg-color)] py-1 shadow-lg"
            style={{ top: coords.top, left: coords.left, width: coords.width, position: 'fixed' }}
            role="listbox"
          >
            {items.map((opt) => {
              const active = opt.value === current;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={active}
                  disabled={opt.disabled}
                  onClick={() => choose(opt.value)}
                  className={cn(
                    'flex w-full items-center justify-between px-4 py-2.5 text-left text-base transition-colors',
                    'hover:bg-primary/10',
                    active ? 'font-medium text-primary' : 'text-foreground',
                    opt.disabled && 'cursor-not-allowed opacity-40',
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {active && (
                    <svg
                      className="h-4 w-4 shrink-0 text-primary"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m20 6-11 11-5-5" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}
