import { useLanguage } from '@/app/providers';
import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Users, ArrowLeft } from 'lucide-react';
import { Button, Card, Skeleton, Badge } from '@/shared/ui';
import { formatDate, getImageUrl } from '@/shared/lib/utils';
import { useEvent, type Event, type EventStatus } from '@/entities/event';
import { useSessionStore, selectIsVerified, selectUser } from '@/entities/session';
import { ParticipateButtons } from '@/features/event-participation';

function statusBadgeVariant(
  status: EventStatus
): 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'neutral' {
  switch (status) {
    case 'upcoming':
      return 'primary';
    case 'ongoing':
      return 'success';
    case 'completed':
      return 'neutral';
    case 'cancelled':
      return 'danger';
    default:
      return 'default';
  }
}

function getCurrentUserStatus(
  event: Event,
  user: { _id: string; email: string } | null
): 'pending' | 'confirmed' | 'removed' | null {
  if (!user) return null;
  const match = event.participations.find((p) => {
    if (typeof p.user === 'string') return p.user === user._id || p.user === user.email;
    return p.user.email === user.email;
  });
  return match ? match.status : null;
}

export function EventDetails() {
  const { t } = useLanguage();
  const { id } = useParams();
  const { data: event, isLoading, isError } = useEvent(id);
  const user = useSessionStore(selectUser);
  const isVerified = useSessionStore(selectIsVerified);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full py-12">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 sm:h-96 w-full rounded-xl" />
        <div className="flex flex-col gap-6">
          <Skeleton className="h-10 w-2/3" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="font-display text-4xl mb-4">{t('Event Not Found')}</h1>
        <Link to="/events">
          <Button variant="secondary">{t('Back to Events')}</Button>
        </Link>
      </div>
    );
  }

  const img = getImageUrl(event.image) ?? 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop';
  const currentStatus = getCurrentUserStatus(event, user);
  const canParticipate = event.status !== 'completed' && event.status !== 'cancelled';

  return (
    <div className="flex flex-col gap-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full py-12">
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit"
      >
        <ArrowLeft size={20} />
        <span className="font-heading font-bold text-sm">{t('Back to Events')}</span>
      </Link>

      <Card className="p-0 overflow-hidden relative border-none">
        <div className="relative h-64 sm:h-96 w-full">
          <img loading="lazy" src={img} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/40 text-white text-xs font-bold font-mono rounded-full mb-4">
              {event.type}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2 leading-tight">
              {event.title}
            </h1>
          </div>
        </div>

        <div className="p-6 sm:p-10 bg-[var(--bg-color)] neo-border border-t-0 rounded-b-xl flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary neo-border">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">{t('When')}</p>
                <p className="font-medium">{formatDate(event.date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary neo-border">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">{t('Where')}</p>
                <p className="font-medium">{event.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-500 neo-border">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">{t('Capacity')}</p>
                <p className="font-medium">
                  {event.participations.length}/{event.capacity} Going
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={statusBadgeVariant(event.status)}>
              {t(event.status.charAt(0).toUpperCase() + event.status.slice(1))}
            </Badge>
          </div>

          <div className="prose dark:prose-invert max-w-none font-sans">
            <h3 className="font-display text-2xl font-bold mb-4">{t('About this Event')}</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">{event.description}</p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mt-4">
            <h3 className="font-heading text-lg font-bold mb-4">{t('Registration Request')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('Direct registration is closed for this event. You can submit a request to join the waitlist, and the organizers will contact you if a spot opens up.')}
            </p>

            {user ? (
              <>
                {!isVerified && (
                  <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl neo-border mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-sans text-sm font-medium">
                      {t('Submit the Join Us form to get verified and unlock membership.')}
                    </span>
                    <Link
                      to="/join"
                      className="shrink-0 rounded-xl neo-border bg-gradient-hero px-4 py-2.5 font-heading text-sm font-semibold text-white neo-shadow"
                    >
                      {t('Join Us')}
                    </Link>
                  </div>
                )}
                <ParticipateButtons eventId={event._id} status={currentStatus} canParticipate={canParticipate} />
              </>
            ) : (
              <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl neo-border inline-flex items-center gap-4">
                <span className="font-sans text-sm font-medium">
                  {t('Please sign in to send a registration request.')}
                </span>
                <Link to="/login">
                  <Button variant="secondary" size="sm">
                    {t('Sign In')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
