import { useLanguage } from '@/app/providers/LanguageContext';
import { Button } from '@/shared/ui';
import { useParticipateEvent, useWithdrawEvent } from '@/entities/event';
import { useSessionStore, selectIsVerified } from '@/entities/session';
import { CheckCircle, Hourglass, Lock, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ParticipateButtonsProps {
  eventId: string;
  /** Participation status of the current user for this event, if known. */
  status?: 'pending' | 'confirmed' | 'removed' | null;
  /** Whether the event still accepts participants. */
  canParticipate?: boolean;
}

/**
 * Member-facing participation controls for a single event. Renders the
 * appropriate actionable state based on the user's current participation.
 *
 * Only verified members may register (matches the backend gate). Unverified
 * but signed-in users see a prompt to complete their membership instead.
 */
export function ParticipateButtons({
  eventId,
  status,
  canParticipate = true,
}: ParticipateButtonsProps) {
  const { t } = useLanguage();
  const participate = useParticipateEvent();
  const withdraw = useWithdrawEvent();
  const isVerified = useSessionStore(selectIsVerified);

  if (status === 'confirmed') {
    return (
      <Button variant="primary" disabled className="w-full">
        <CheckCircle size={18} className="mr-2" />
        {t('Participating')}
      </Button>
    );
  }

  if (status === 'pending') {
    return (
      <div className="flex w-full gap-2">
        <Button variant="outline" disabled className="flex-1">
          <Hourglass size={18} className="mr-2" />
          {t('Pending')}
        </Button>
        <Button
          variant="ghost"
          disabled={withdraw.isPending}
          onClick={() => withdraw.mutate(eventId)}
          className="flex-1"
        >
          <XCircle size={18} className="mr-2" />
          {t('Withdraw')}
        </Button>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <Link to="/join" className="block w-full">
        <Button variant="primary" className="w-full">
          <Lock size={18} className="mr-2" />
          {t('Complete membership to join')}
        </Button>
      </Link>
    );
  }

  return (
    <Button
      variant="primary"
      className="w-full"
      disabled={!canParticipate || participate.isPending}
      onClick={() => participate.mutate(eventId)}
    >
      {participate.isPending ? t('Joining...') : t('Participate')}
    </Button>
  );
}
