import { useLanguage } from "@/app/providers";
import {
  useEventParticipations,
  useEvents,
  useConfirmParticipation,
  useRemoveParticipation,
  type Event,
  type EventParticipation,
  type ParticipationStatus,
} from "@/entities/event";
import { Avatar } from "@/shared/ui";
import { Badge, Button, Card, Input, Skeleton } from "@/shared/ui";
import { cn, formatDateTime } from "@/shared/lib/utils";
import { Check, Loader2, Search, Trash2, Users } from "lucide-react";
import { useState } from "react";

const FILTERS: { key: ParticipationStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "removed", label: "Removed" },
];

const statusBadge: Record<
  ParticipationStatus,
  "warning" | "success" | "danger"
> = {
  pending: "warning",
  confirmed: "success",
  removed: "danger",
};

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <Card className="min-w-[88px] px-4 py-2.5">
      <p
        className="font-display text-xl font-bold leading-none"
        style={{ color: tone }}
      >
        {value}
      </p>
      <p className="mt-1 font-sans text-[11px] text-muted-foreground">
        {label}
      </p>
    </Card>
  );
}

function ParticipantRow({
  eventId,
  part,
}: {
  eventId: string;
  part: EventParticipation;
}) {
  const { t } = useLanguage();
  const confirm = useConfirmParticipation();
  const remove = useRemoveParticipation();
  const user = part.user;

  return (
    <Card neo={false} className="flex items-center gap-4 p-4">
      <Avatar
        name={user.name}
        image={user.image}
        className="h-11 w-11 shrink-0 text-sm"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-heading font-semibold text-[15px]">
            {user.name}
          </p>
          <Badge variant={statusBadge[part.status]} className="capitalize">
            {part.status}
          </Badge>
        </div>
        <p className="truncate font-sans text-xs text-muted-foreground">
          {user.email}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-muted-foreground">
          <span>
            {t("Points")}: +{part.pointsAwarded}
          </span>
          <span>
            {t("Requested")}: {formatDateTime(part.requestedAt)}
          </span>
          {part.confirmedAt && (
            <span>
              {t("Confirmed")}: {formatDateTime(part.confirmedAt)}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {part.status === "pending" && (
          <Button
            size="sm"
            onClick={() => confirm.mutate({ eventId, userId: user._id })}
            disabled={confirm.isPending}
          >
            {confirm.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Check size={14} />
            )}
            {t("Confirm")}
          </Button>
        )}
        {part.status !== "removed" && (
          <Button
            size="sm"
            variant="danger"
            onClick={() => remove.mutate({ eventId, userId: user._id })}
            disabled={remove.isPending}
          >
            {remove.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
            {t("Remove")}
          </Button>
        )}
      </div>
    </Card>
  );
}

export function AdminRegistrations() {
  const { t } = useLanguage();
  const { data: events, isLoading: eventsLoading } = useEvents({ limit: 100 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<ParticipationStatus | "all">("pending");
  const [search, setSearch] = useState("");

  const allEvents = events?.events ?? [];
  const activeId =
    selectedId ??
    allEvents.find((e) => e.participations.length > 0)?._id ??
    null;
  const selected: Event | undefined = allEvents.find((e) => e._id === activeId);

  const { data: partsData, isLoading: partsLoading } =
    useEventParticipations(activeId);
  const parts = partsData?.participations ?? selected?.participations ?? [];

  const counts = partsData?.summary ?? {
    total: parts.length,
    pending: parts.filter((p) => p.status === "pending").length,
    confirmed: parts.filter((p) => p.status === "confirmed").length,
    removed: parts.filter((p) => p.status === "removed").length,
  };

  const visible = (parts as EventParticipation[])
    .filter((p) => (tab === "all" ? true : p.status === tab))
    .filter((p) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        p.user.name.toLowerCase().includes(q) ||
        p.user.email.toLowerCase().includes(q)
      );
    })
    .slice()
    .sort((a, b) => +new Date(b.requestedAt) - +new Date(a.requestedAt));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">
          {t("Event Registrations")}
        </h2>
        <p className="font-sans text-sm text-muted-foreground">
          {t("Manage and monitor event participants.")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* Event picker */}
        <Card className="flex h-fit flex-col p-3">
          <p className="mb-3 px-1 font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {t("Events")}
          </p>
          <div className="max-h-[64vh] space-y-2 overflow-y-auto pr-1">
            {eventsLoading ? (
              [1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[60px] w-full" />
              ))
            ) : allEvents.length === 0 ? (
              <p className="px-1 py-4 text-center font-sans text-sm text-muted-foreground">
                {t("No events found")}
              </p>
            ) : (
              allEvents.map((e) => {
                const pending = e.participations.filter(
                  (p) => p.status === "pending",
                ).length;
                const active = e.participations.filter(
                  (p) => p.status !== "removed",
                ).length;
                return (
                  <button
                    key={e._id}
                    onClick={() => {
                      setSelectedId(e._id);
                      setSearch("");
                      setTab("pending");
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-xl border p-3 text-left transition-colors",
                      e._id === activeId
                        ? "border-primary bg-primary/5 dark:bg-primary/10"
                        : "border-transparent hover:bg-gray-50 dark:hover:bg-white/5",
                    )}
                  >
                    <div className="min-w-0">
                      <p className="truncate font-heading font-semibold text-sm">
                        {e.title}
                      </p>
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {active}/{e.capacity} {t("Going")}
                      </p>
                    </div>
                    {pending > 0 && <Badge variant="warning">{pending}</Badge>}
                  </button>
                );
              })
            )}
          </div>
        </Card>

        {/* Registration queue */}
        <div className="space-y-5">
          {selected && (
            <Card className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <h3 className="font-heading font-bold text-lg">
                  {selected.title}
                </h3>
                <p className="font-mono text-xs text-muted-foreground">
                  {formatDateTime(selected.date)} · {selected.location}
                </p>
              </div>
              <div className="flex gap-2">
                <StatCard
                  label={t("Pending")}
                  value={counts.pending}
                  tone="#f59e0b"
                />
                <StatCard
                  label={t("Confirmed")}
                  value={counts.confirmed}
                  tone="#22c55e"
                />
                <StatCard
                  label={t("Total")}
                  value={counts.total}
                  tone="#6366f1"
                />
              </div>
            </Card>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setTab(f.key)}
                  className={cn(
                    "rounded-full px-3 py-1 font-mono text-xs font-bold capitalize transition-colors",
                    tab === f.key
                      ? "bg-primary text-white"
                      : "bg-gray-100 dark:bg-white/10 text-muted-foreground hover:bg-gray-200 dark:hover:bg-white/20",
                  )}
                >
                  {t(f.label)}
                  {f.key !== "all" && (
                    <span className="ml-1 opacity-70">
                      {counts[f.key as ParticipationStatus]}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="relative ml-auto w-full max-w-[240px]">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder={t("Search participant...")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {partsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[76px] w-full" />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
              <Users size={32} className="opacity-40" />
              <p className="font-sans text-sm">{t("No participants found")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {visible.map((p) => (
                <ParticipantRow key={p.user._id} eventId={activeId!} part={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
