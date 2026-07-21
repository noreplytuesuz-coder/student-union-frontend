import { useLanguage } from '@/app/providers';
import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  Award,
  BadgeCheck,
  ShieldCheck,
  User as UserIcon,
  GraduationCap,
} from 'lucide-react';
import { Card, Badge, Avatar, Button } from '@/shared/ui';
import { Link, useNavigate } from 'react-router-dom';
import { useSessionStore, selectIsAdmin } from '@/entities/session';
import { useUpdateUser } from '@/entities/user';
import { useFileUpload } from '@/entities/upload';
import { useMyRegistrations } from '@/entities/event';
import { ChangePasswordModal } from '@/features/auth';
import { ImageUp, Loader2, X, Clock, CircleCheck, CircleX, KeyRound } from 'lucide-react';
import { formatDate } from '@/shared/lib/utils';

const STATUS_META: Record<
  string,
  { label: string; wrap: string; text: string; Icon: typeof CircleCheck }
> = {
  confirmed: {
    label: 'Approved',
    wrap: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    text: 'text-green-500',
    Icon: CircleCheck,
  },
  pending: {
    label: 'Pending',
    wrap: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    text: 'text-yellow-500',
    Icon: Clock,
  },
  removed: {
    label: 'Denied',
    wrap: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    text: 'text-red-500',
    Icon: CircleX,
  },
};

const roleConfig = (role: 'user' | 'member') => {
  return role === 'user'
    ? { label: 'Administrator', icon: <ShieldCheck size={14} />, className: 'bg-primary/10 text-primary border-primary/20' }
    : { label: 'Member', icon: <BadgeCheck size={14} />, className: 'bg-secondary/10 text-secondary border-secondary/20' };
};

export function Profile() {
  const { t } = useLanguage();
  const user = useSessionStore((s) => s.user);
  const isAdmin = useSessionStore(selectIsAdmin);
  const setUser = useSessionStore((s) => s.setUser);
  const updateUser = useUpdateUser();
  const uploadPhoto = useFileUpload('users');
  const photoInputRef = useRef<HTMLInputElement>(null);
  const { data: registrations, isLoading: regLoading } = useMyRegistrations();
  const navigate = useNavigate();

  const [pwModalOpen, setPwModalOpen] = useState(false);

  // Google users who have NOT set a password yet get a one-time first-set:
  // no old-password field required. Once they set one, password login works
  // alongside Google, and they fall back to the normal old-password flow.
  const isGoogleUser = user?.provider === 'google';
  const needsPasswordSet = isGoogleUser && !user?.hasPassword;

  const handlePhotoChange = async (file: File) => {
    if (!user) return;
    const fileKey = await uploadPhoto.mutateAsync(file);
    const updated = await updateUser.mutateAsync({ id: user._id, data: { image: fileKey } });
    setUser(updated);
  };

  const handlePhotoRemove = async () => {
    if (!user) return;
    const updated = await updateUser.mutateAsync({ id: user._id, data: { image: '' } });
    setUser(updated);
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <UserIcon size={48} className="text-muted-foreground mb-4" />
        <h1 className="font-display text-3xl font-bold mb-2">{t('Not Signed In')}</h1>
        <p className="text-muted-foreground font-sans max-w-md">
          {t('Please sign in to view your profile.')}
        </p>
      </div>
    );
  }

  const rc = roleConfig(user.role);

  // Verification state: a member is "unverified" until they submit the
  // Join Us form, "pending" while that request awaits review, and "verified"
  // once an admin accepts it.
  const status: 'unverified' | 'pending' | 'verified' =
    user.verificationStatus ?? (user.isVerified ? 'verified' : 'unverified');

  const stats = [
    {
      label: t('Points'),
      value: user.points,
      icon: <Award size={18} className="text-secondary" />,
    },
    {
      label: t('Role'),
      value: t(rc.label),
      icon: rc.icon,
    },
    {
      label: t('Status'),
      value: t(status === 'verified' ? 'Verified' : status === 'pending' ? 'Pending' : 'Unverified'),
      icon: <BadgeCheck size={18} className={status === 'verified' ? 'text-primary' : 'text-muted-foreground'} />,
    },
  ];

  return (
    <div className="flex flex-col gap-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full pt-12 pb-24">
      <section className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="relative mb-6"
        >
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="group relative block w-24 h-24 rounded-full overflow-hidden neo-border neo-shadow cursor-pointer"
            aria-label={t('Change profile photo')}
          >
            <Avatar name={user.name} image={user.image} className="h-full w-full" fallbackClassName="text-3xl" />
            <span
              className={`absolute inset-0 flex items-center justify-center bg-black/40 text-white transition-opacity ${
                uploadPhoto.isPending ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
            >
              {uploadPhoto.isPending ? (
                <Loader2 size={28} className="animate-spin" />
              ) : (
                <ImageUp size={28} />
              )}
            </span>
          </button>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handlePhotoChange(file);
              e.target.value = '';
            }}
          />
          {user.image && !uploadPhoto.isPending && (
            <button
              type="button"
              onClick={handlePhotoRemove}
              disabled={updateUser.isPending}
              className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white neo-border"
              aria-label={t('Remove photo')}
            >
              <X size={15} />
            </button>
          )}
        </motion.div>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <h1 className="font-display text-4xl sm:text-5xl font-black">{user.name}</h1>
        </div>

        <div className="flex items-center gap-2 mt-3 text-muted-foreground font-mono text-sm">
          <Mail size={16} />
          <span>{user.email}</span>
        </div>

        {user.major && (
          <div className="flex items-center gap-2 mt-2 text-muted-foreground font-mono text-sm">
            <GraduationCap size={16} />
            <span>{user.major}</span>
          </div>
        )}
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-6 flex items-center gap-4" neo={false}>
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center neo-border">
                {stat.icon}
              </div>
              <div>
                <p className="font-display font-bold text-2xl">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-mono uppercase">{stat.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </section>

      {status === 'unverified' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Card className="flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-sans text-sm text-muted-foreground">
              {t('Submit the Join Us form to get verified and unlock membership.')}
            </p>
            <Link
              to="/join"
              className="shrink-0 rounded-xl neo-border bg-gradient-hero px-4 py-2.5 font-heading text-sm font-semibold text-white neo-shadow"
            >
              {t('Join Us')}
            </Link>
          </Card>
        </motion.div>
      )}

      <section className="glass rounded-2xl overflow-hidden neo-border neo-shadow p-6 sm:p-8">
        <h2 className="font-display text-2xl font-bold mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
          {t('My Registrations')}
        </h2>

        {regLoading ? (
          <p className="text-sm text-muted-foreground">{t('Loading...')}</p>
        ) : !registrations || registrations.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('No registrations yet.')}</p>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {registrations.map((reg) => {
              const meta = STATUS_META[reg.status] ?? STATUS_META.pending;
              const Icon = meta.Icon;
              return (
                <Link
                  key={reg.event._id}
                  to={`/events/${reg.event._id}`}
                  className="block p-4 rounded-xl border neo-border bg-gray-50 dark:bg-white/5 flex flex-col gap-3 transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold font-heading leading-tight">{reg.event.title}</h3>
                  </div>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                      <Clock size={12} />
                      {formatDate(reg.event.date)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold font-mono uppercase flex items-center gap-1 neo-border ${meta.wrap}`}
                    >
                      <Icon size={20} className={meta.text} />
                      {t(meta.label)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="glass rounded-2xl overflow-hidden neo-border neo-shadow p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold">{t('Change Password')}</h2>
            {isGoogleUser && (
              <p className="mt-1 text-sm text-muted-foreground">
                {needsPasswordSet
                  ? t('Set a password to also sign in with email.')
                  : t('You can also sign in with your password.')}
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPwModalOpen(true)}
            className="shrink-0"
          >
            <KeyRound size={16} />
            {needsPasswordSet ? t('Set Password') : t('Change')}
          </Button>
        </div>
      </section>

      <ChangePasswordModal
        open={pwModalOpen}
        onClose={() => setPwModalOpen(false)}
        isFirstSet={needsPasswordSet}
      />
    </div>
  );
}
