import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Loader2 } from 'lucide-react';
import { Modal, Button, Input } from '@/shared/ui';
import { useLanguage } from '@/app/providers';
import { useMutation } from '@tanstack/react-query';
import { useSessionStore, sessionApi } from '@/entities/session';

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
  /** Google user who has not set a password yet (first-time set, no old password). */
  isFirstSet?: boolean;
}

/**
 * Change-password dialog. Local users (and Google users who already have a
 * password) must supply their current password; a Google user on their first
 * set supplies only new + confirm. Loading / error / success states are all
 * handled here and reset whenever the modal is (re)opened.
 */
export function ChangePasswordModal({ open, onClose, isFirstSet = false }: ChangePasswordModalProps) {
  const { t } = useLanguage();
  const setUser = useSessionStore((s) => s.setUser);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const mutation = useMutation({
    mutationFn: () =>
      sessionApi.changePassword(isFirstSet ? { newPassword } : { oldPassword, newPassword }),
    onSuccess: (updated) => {
      if (updated) setUser(updated);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
  });

  // Reset form + mutation state every time the modal opens.
  useEffect(() => {
    if (open) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      mutation.reset();
    }
  }, [open]);

  // On success, show the confirmation briefly, then auto-close.
  useEffect(() => {
    if (mutation.isSuccess) {
      const id = setTimeout(onClose, 1200);
      return () => clearTimeout(id);
    }
  }, [mutation.isSuccess, onClose]);

  const mismatch = !!newPassword && !!confirmPassword && newPassword !== confirmPassword;
  const canSubmit = !!newPassword && newPassword === confirmPassword && !mutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    mutation.mutate();
  };

  const handleClose = () => {
    if (mutation.isPending) return;
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={t('Change Password')}
      disableClose={mutation.isPending}
    >
      {isFirstSet ? (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Lock size={16} />
          {t('Set a password to also sign in with email.')}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Lock size={16} />
          {t('Enter your current password, then choose a new one.')}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isFirstSet && (
          <div className="space-y-2">
            <label className="block font-heading text-sm font-bold">{t('Current Password')}</label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="pl-10"
                placeholder="••••••••"
                disabled={mutation.isPending}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="block font-heading text-sm font-bold">{t('New Password')}</label>
          <div className="relative">
            <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pl-10"
              placeholder="••••••••"
              disabled={mutation.isPending}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block font-heading text-sm font-bold">{t('Confirm New Password')}</label>
          <div className="relative">
            <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10"
              placeholder="••••••••"
              disabled={mutation.isPending}
            />
          </div>
          {mismatch && <p className="text-sm text-red-500">{t('Passwords do not match.')}</p>}
        </div>

        {mutation.isError && (
          <p className="text-sm text-red-500">
            {isFirstSet ? t('Could not set password.') : t('Current password is incorrect.')}
          </p>
        )}
        {mutation.isSuccess && <p className="text-sm text-green-600">{t('Password updated.')}</p>}

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={mutation.isPending}>
            {t('Cancel')}
          </Button>
          <Button type="submit" variant="primary" disabled={!canSubmit}>
            {mutation.isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {t('Updating...')}
              </>
            ) : (
              t('Update Password')
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
