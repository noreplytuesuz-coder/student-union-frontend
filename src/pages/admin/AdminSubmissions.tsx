import { useLanguage } from '@/app/providers';
import {
  useAcceptSubmission,
  useDeleteSubmission,
  useRejectSubmission,
  useSubmissions,
  type Submission,
  type SubmissionStatus,
} from '@/entities/submission';
import { Badge, Button, Card, Skeleton, Avatar } from '@/shared/ui';
import { ConfirmDialog } from '@/widgets/confirm-dialog';
import { formatDateTime, getImageUrl } from '@/shared/lib/utils';
import { useState } from 'react';

const FILTERS: { key: SubmissionStatus | 'all'; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'rejected', label: 'Rejected' },
];

const statusBadge: Record<SubmissionStatus, 'warning' | 'success' | 'danger'> = {
  pending: 'warning',
  accepted: 'success',
  rejected: 'danger',
};

function StatCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <Card className="flex-1 px-4 py-3">
      <p className="font-display text-2xl font-bold" style={{ color: tone }}>
        {value}
      </p>
      <p className="font-sans text-xs text-muted-foreground">{label}</p>
    </Card>
  );
}

export function AdminSubmissions() {
  const { t } = useLanguage();
  const { data, isLoading } = useSubmissions();
  const accept = useAcceptSubmission();
  const reject = useRejectSubmission();
  const remove = useDeleteSubmission();
  const [tab, setTab] = useState<SubmissionStatus | 'all'>('pending');
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleDelete = () => {
    if (confirmId) remove.mutate(confirmId);
    setConfirmId(null);
  };

  const all = data?.submissions ?? [];
  const counts = {
    pending: all.filter((s) => s.status === 'pending').length,
    accepted: all.filter((s) => s.status === 'accepted').length,
    rejected: all.filter((s) => s.status === 'rejected').length,
  };
  const visible = tab === 'all' ? all : all.filter((s) => s.status === tab);
  const sorted = [...visible].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">{t('Submissions')}</h2>
      </div>

      {/* Summary */}
      <div className="flex gap-3">
        <StatCard label={t('Pending')} value={counts.pending} tone="#d97706" />
        <StatCard label={t('Accepted')} value={counts.accepted} tone="#059669" />
        <StatCard label={t('Rejected')} value={counts.rejected} tone="#dc2626" />
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab('all')}
          className={`rounded-full px-4 py-1.5 font-heading text-sm font-semibold transition-colors neo-border ${
            tab === 'all' ? 'bg-primary text-white' : 'text-foreground hover:bg-gray-100 dark:hover:bg-white/10'
          }`}
        >
          {t('All')}
        </button>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setTab(f.key)}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 font-heading text-sm font-semibold transition-colors neo-border ${
              tab === f.key ? 'bg-primary text-white' : 'text-foreground hover:bg-gray-100 dark:hover:bg-white/10'
            }`}
          >
            {t(f.label)}
            <span className="rounded-full bg-black/10 px-1.5 text-xs dark:bg-white/20">{counts[f.key]}</span>
          </button>
        ))}
      </div>

      {isLoading && [1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full" />)}

      <div className="space-y-3">
        {sorted.map((s: Submission) => (
          <Card key={s._id} className="space-y-4 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar
                  name={s.name}
                  image={s.image ? getImageUrl(s.image) : undefined}
                  className="neo-border h-11 w-11 shrink-0"
                />
                <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-heading text-lg font-bold">{s.name}</p>
                  {!s.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" title={t('New')} />}
                </div>
                <a
                  href={`mailto:${s.email}`}
                  className="block truncate font-sans text-sm text-muted-foreground hover:text-primary"
                >
                  {s.email}
                </a>
              </div>
              </div>
              <Badge variant={statusBadge[s.status]} className="shrink-0 capitalize">
                {t(s.status)}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">{s.department}</Badge>
              {s.interests
                .split(',')
                .map((i) => i.trim())
                .filter(Boolean)
                .map((i) => (
                  <span
                    key={i}
                    className="rounded-full border border-black/10 bg-black/5 px-2.5 py-0.5 text-xs text-foreground dark:border-white/15 dark:bg-white/10"
                  >
                    {i}
                  </span>
                ))}
              <span className="ml-auto font-sans text-xs text-muted-foreground">
                {formatDateTime(s.createdAt)}
              </span>
            </div>

            <div className="rounded-xl bg-black/[0.03] p-3 dark:bg-white/5">
              <p className="mb-1 font-heading text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {t('Motivation')}
              </p>
              <p className="whitespace-pre-line font-sans text-sm leading-relaxed">{s.whyJoin}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {s.status === 'pending' && (
                <>
                  <Button size="sm" variant="primary" disabled={accept.isPending} onClick={() => accept.mutate(s._id)}>
                    {t('Accept')}
                  </Button>
                  <Button size="sm" variant="danger" disabled={reject.isPending} onClick={() => reject.mutate(s._id)}>
                    {t('Reject')}
                  </Button>
                </>
              )}
              {s.status !== 'pending' && (
                <span className="self-center font-sans text-xs text-muted-foreground">
                  {s.status === 'accepted' ? t('Accepted') : t('Rejected')}
                  {s.reviewedAt ? ` · ${formatDateTime(s.reviewedAt)}` : ''}
                </span>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="ml-auto"
                onClick={() => setConfirmId(s._id)}
              >
                {t('Delete')}
              </Button>
            </div>
          </Card>
        ))}
        {!isLoading && sorted.length === 0 && (
          <p className="text-muted-foreground">{t('No submissions yet.')}</p>
        )}
      </div>

      <ConfirmDialog
        open={confirmId !== null}
        onClose={() => setConfirmId(null)}
        title="Delete"
        message="Delete this submission?"
        onConfirm={handleDelete}
        confirmDisabled={remove.isPending}
      />
    </div>
  );
}
