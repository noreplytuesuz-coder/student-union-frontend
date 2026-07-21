import { useLanguage } from '@/app/providers';
import { Button, Modal } from '@/shared/ui';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  /** Localization key for the dialog title. */
  title: string;
  /** Localization key for the confirmation message body. */
  message: string;
  /** Localization key for the confirm button. Defaults to "Delete". */
  confirmLabel?: string;
  /** Localization key for the cancel button. Defaults to "Cancel". */
  cancelLabel?: string;
  onConfirm: () => void;
  /** Forwarded to the confirm button so a pending mutation can disable it. */
  confirmDisabled?: boolean;
}

/**
 * Reusable confirmation dialog for destructive actions (e.g. delete),
 * replacing native `window.confirm` for a consistent, styled UX.
 */
export function ConfirmDialog({
  open,
  onClose,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  confirmDisabled,
}: ConfirmDialogProps) {
  const { t } = useLanguage();
  return (
    <Modal
      title={t(title)}
      open={open}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={confirmDisabled}>
            {t(cancelLabel ?? 'Cancel')}
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={confirmDisabled}>
            {t(confirmLabel ?? 'Delete')}
          </Button>
        </div>
      }
    >
      <p className="text-muted-foreground">{t(message)}</p>
    </Modal>
  );
}
