import { useState } from "react";
import { useLanguage } from "@/app/providers";
import { useContacts, useContact, useDeleteContact, contactKeys } from "@/entities/contact";
import { useQueryClient } from "@tanstack/react-query";
import { Badge, Button, Card, Modal, Skeleton } from "@/shared/ui";
import { Avatar } from "@/shared/ui";
import { formatDateTime } from "@/shared/lib/utils";
import type { ContactListParams } from "@/entities/contact";

type FilterKey = "all" | "unread" | "read";

const FILTERS: { key: FilterKey; param?: ContactListParams["read"] }[] = [
  { key: "all", param: undefined },
  { key: "unread", param: "false" },
  { key: "read", param: "true" },
];

export function AdminContacts() {
  const { t } = useLanguage();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const activeParam = FILTERS.find((f) => f.key === filter)!.param;
  const { data, isLoading } = useContacts({ read: activeParam });
  const remove = useDeleteContact();
  const messages = data?.messages ?? [];

  const unreadCount = data?.messages.filter((m) => !m.read).length ?? 0;
  const isFiltering =
    (filter === "unread" && unreadCount === 0) ||
    (filter === "read" && messages.length === 0);
  const showEmpty = !isLoading && messages.length === 0 && !isFiltering;

  const openDetail = (id: string) => {
    setSelectedId(id);
    // GET /contact/:id marks the message as read on the backend.
    qc.invalidateQueries({ queryKey: contactKeys.detail(id) });
  };

  const closeDetail = () => {
    setSelectedId(null);
    qc.invalidateQueries({ queryKey: contactKeys.all });
  };

  const handleDelete = () => {
    if (!confirmDeleteId) return;
    remove.mutate(confirmDeleteId, {
      onSuccess: () => {
        setConfirmDeleteId(null);
        if (selectedId === confirmDeleteId) closeDetail();
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1">{t("Contacts")}</h1>
          <p className="text-muted-foreground text-sm">{t("Manage and respond to messages from the contact form.")}</p>
        </div>
        <Badge variant="warning" className="px-3 py-1">
          {unreadCount} {t("Unread")}
        </Badge>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const count =
            f.key === "unread"
              ? data?.messages.filter((m) => !m.read).length ?? 0
              : f.key === "read"
                ? data?.messages.filter((m) => m.read).length ?? 0
                : data?.messages.length ?? 0;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full font-heading text-sm font-bold transition-all neo-border ${
                filter === f.key ? "bg-gradient-hero text-white neo-shadow" : "glass hover:bg-gray-100 dark:hover:bg-white/10"
              }`}
            >
              {t(f.key === "all" ? "All" : f.key === "unread" ? "Unread" : "Read")}
              <span className={`ml-1.5 text-xs ${filter === f.key ? "opacity-90" : "text-muted-foreground"}`}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : showEmpty ? (
        <Card className="p-10 text-center">
          <p className="text-muted-foreground">{t("No messages yet.")}</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {messages.map((c) => (
            <Card
              key={c._id}
              role="button"
              tabIndex={0}
              onClick={() => openDetail(c._id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openDetail(c._id);
                }
              }}
              className={`flex items-center gap-4 p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-white/5 ${
                c.read ? "" : "border-l-4 border-l-amber-500"
              }`}
            >
              <Avatar name={`${c.firstName} ${c.lastName}`} className="neo-border h-10 w-10 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-heading font-semibold truncate">
                    {c.firstName} {c.lastName}
                  </p>
                  {!c.read && <span className="size-2 rounded-full bg-amber-500 flex-shrink-0" aria-label={t("Unread")} />}
                </div>
                <p className="text-sm text-muted-foreground truncate">{c.email}</p>
                <p className="text-sm font-medium truncate">{c.subject}</p>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <Badge variant={c.read ? "neutral" : "warning"}>{c.read ? t("Read") : t("Unread")}</Badge>
                <span className="font-mono text-xs text-muted-foreground">{formatDateTime(c.createdAt)}</span>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDeleteId(c._id);
                  }}
                >
                  {t("Delete")}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detail view */}
      <ContactDetailModal id={selectedId} onClose={closeDetail} onDelete={(id) => setConfirmDeleteId(id)} />

      {/* Delete confirm */}
      <Modal
        title={t("Delete")}
        open={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>{t("Cancel")}</Button>
            <Button variant="danger" onClick={handleDelete}>{t("Delete")}</Button>
          </div>
        }
      >
        <p className="text-muted-foreground">{t("Delete this message?")}</p>
      </Modal>
    </div>
  );
}

function ContactDetailModal({ id, onClose, onDelete }: { id: string | null; onClose: () => void; onDelete: (id: string) => void }) {
  const { t } = useLanguage();
  const { data: contact, isLoading } = useContact(id ?? undefined);
  const open = id !== null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("View message")}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>{t("Close")}</Button>
          <Button variant="danger" onClick={() => id && onDelete(id)}>{t("Delete")}</Button>
        </div>
      }
    >
      {isLoading && !contact ? (
        <div className="space-y-3">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : contact ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar name={`${contact.firstName} ${contact.lastName}`} className="neo-border h-12 w-12 flex-shrink-0" />
            <div>
              <p className="font-heading font-bold text-lg">
                {contact.firstName} {contact.lastName}
              </p>
              <a
                href={`mailto:${contact.email}`}
                className="text-sm text-primary hover:underline break-all"
              >
                {contact.email}
              </a>
            </div>
            <div className="ml-auto">
              <Badge variant={contact.read ? "neutral" : "warning"}>
                {contact.read ? t("Read") : t("Unread")}
              </Badge>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">
              {t("Subject")}
            </h4>
            <p className="font-medium">{contact.subject}</p>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">
              {t("Message")}
            </h4>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{contact.message}</p>
          </div>

          <p className="font-mono text-xs text-muted-foreground">
            {formatDateTime(contact.createdAt)}
          </p>
        </div>
      ) : null}
    </Modal>
  );
}
