import { useLanguage } from '@/app/providers';
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Users,
  CalendarDays,
  FileClock,
  Mailbox,
  Newspaper,
  FolderKanban,
  Trash2,
  CheckCircle2,
  Server,
} from 'lucide-react';
import { Card, Skeleton, Badge, Button, Spinner } from '@/shared/ui';
import { useDashboard, useCleanDashboard, DashboardSubmission } from '@/entities/dashboard';
import { formatDateTime } from '@/shared/lib/utils';

const managementLinks = [
  { to: '/admin/events', label: 'Events', icon: CalendarDays },
  { to: '/admin/news', label: 'News', icon: Newspaper },
  { to: '/admin/members', label: 'Members', icon: Users },
  { to: '/admin/submissions', label: 'Submissions', icon: FileClock },
  { to: '/admin/contacts', label: 'Contacts', icon: Mailbox },
  { to: '/admin/documents', label: 'Documents', icon: FolderKanban },
  { to: '/admin/gallery', label: 'Gallery', icon: FolderKanban },
  { to: '/admin/partners', label: 'Partners', icon: Users },
];

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <Card className="p-6 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
        <Icon size={24} />
      </div>
      <div>
        <p className="font-display text-3xl font-bold">{value}</p>
        <p className="text-muted-foreground text-sm font-sans">{label}</p>
      </div>
    </Card>
  );
}

function statusVariant(status: DashboardSubmission['status']) {
  switch (status) {
    case 'accepted':
      return 'success' as const;
    case 'rejected':
      return 'danger' as const;
    default:
      return 'warning' as const;
  }
}

export function AdminDashboard() {
  const { t } = useLanguage();
  const { data, isLoading, isError } = useDashboard();
  const cleanMutation = useCleanDashboard();

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-12">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-40 w-full rounded-xl mt-8" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-12">
        <Card className="p-8 text-center text-muted-foreground">
          {t("Failed to load dashboard. Please try again.")}
        </Card>
      </div>
    );
  }

  const { stats, system, recentSubmissions } = data;

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-12 flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="font-display text-4xl sm:text-5xl font-bold">{t("Dashboard")}</h1>
        <Button
          variant="secondary"
          onClick={() => cleanMutation.mutate()}
          disabled={cleanMutation.isPending}
          className="gap-2"
        >
          {cleanMutation.isPending ? (
            <Spinner className="h-4 w-4" />
          ) : (
            <Trash2 size={18} />
          )}
          {t("Clean unassigned files")}
        </Button>
      </div>

      {cleanMutation.isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-sans text-sm"
        >
          <CheckCircle2 size={18} />
          {t("Unassigned files cleaned successfully.")}
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label={t("Students")} value={stats.students.total} icon={Users} />
        <StatCard label={t("Active Events")} value={stats.events.active} icon={CalendarDays} />
        <StatCard label={t("Pending Submissions")} value={stats.submissions.pending} icon={FileClock} />
        <StatCard label={t("Unread Messages")} value={stats.contacts.unread} icon={Mailbox} />
        <StatCard label={t("News")} value={stats.news.total} icon={Newspaper} />
        <StatCard label={t("Projects")} value={stats.projects.total} icon={FolderKanban} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* System Status */}
        <Card className="p-6 flex flex-col gap-4 lg:col-span-1">
          <div className="flex items-center gap-2">
            <Server size={20} className="text-primary" />
            <h2 className="font-heading text-xl font-bold">{t("System Status")}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={system.status === 'healthy' ? 'success' : 'danger'}>
              {system.status === 'healthy' ? t("Healthy") : t("Unhealthy")}
            </Badge>
            <span className="text-sm text-muted-foreground font-sans">
              {t("Database")}: {system.database}
            </span>
          </div>
          <div className="font-sans text-sm text-muted-foreground flex flex-col gap-1">
            <span>
              {t("Uptime")}: {Math.floor(system.uptime / 60)}m {system.uptime % 60}s
            </span>
            <span>
              {t("Memory")}: {system.memory.used} / {system.memory.total} {system.memory.unit}
            </span>
            <span>
              {t("Last updated")}: {formatDateTime(system.timestamp)}
            </span>
          </div>
        </Card>

        {/* Recent Submissions */}
        <Card className="p-6 flex flex-col gap-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold">{t("Recent Submissions")}</h2>
            <Link to="/admin/submissions" className="text-sm text-primary font-bold hover:underline">
              {t("View all")}
            </Link>
          </div>
          {recentSubmissions.length === 0 ? (
            <p className="text-muted-foreground font-sans text-sm">{t("No recent submissions.")}</p>
          ) : (
            <ul className="flex flex-col divide-y divide-gray-200 dark:divide-white/10">
              {recentSubmissions.map((sub) => (
                <li key={sub._id} className="flex items-center justify-between py-3 gap-4">
                  <div className="min-w-0">
                    <p className="font-sans font-semibold truncate">
                      {sub.firstName} {sub.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground font-sans truncate">{sub.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <Badge variant={statusVariant(sub.status)}>{sub.status}</Badge>
                    <span className="text-xs text-muted-foreground font-sans">
                      {formatDateTime(sub.createdAt)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Management Links */}
      <Card className="p-6">
        <h2 className="font-heading text-xl font-bold mb-4">{t("Manage")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {managementLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 rounded-xl neo-border px-4 py-3 font-heading font-semibold hover:bg-primary/10 transition-colors"
            >
              <Icon size={18} className="text-primary" />
              {t(label)}
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
