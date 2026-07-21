import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  /** When true, blocks close via X / backdrop / Escape (e.g. while a file is uploading). */
  disableClose?: boolean;
}

export function Modal({ open, onClose, title, children, footer, className, disableClose }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !disableClose) onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={disableClose ? undefined : onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          'relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl p-5 glass neo-border neo-shadow sm:max-w-xl sm:p-6 md:max-w-2xl lg:max-w-4xl lg:p-8',
          className,
        )}
      >
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-xl font-bold">{title}</h3>
            <button
              type="button"
              onClick={disableClose ? undefined : onClose}
              disabled={disableClose}
              aria-label="Close"
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-50"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="space-y-4">{children}</div>
        {footer && <div className="mt-4 flex gap-2">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
