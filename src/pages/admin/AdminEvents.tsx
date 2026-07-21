import { useLanguage } from '@/app/providers';
import {
  useCreateEvent,
  useDeleteEvent,
  useEvents,
  useUpdateEvent,
  type CreateEventDto,
  type Event,
  type EventStatus,
  type EventType,
} from '@/entities/event';
import { Badge, Button, Card, Dropdown, FileUpload, Input, Modal, Select, Skeleton, Textarea } from '@/shared/ui';
import { ConfirmDialog } from '@/widgets/confirm-dialog';
import { formatDateTime } from '@/shared/lib/utils';
import { Pencil, Loader2 } from 'lucide-react';
import { useState } from 'react';

const EVENT_TYPES: EventType[] = [
  'workshop',
  'seminar',
  'competition',
  'cultural',
  'sports',
  'volunteer',
  'other',
];
const EVENT_STATUSES: EventStatus[] = ['upcoming', 'ongoing', 'completed', 'cancelled'];

const emptyForm: CreateEventDto = {
  title: '',
  description: '',
  type: 'workshop',
  date: new Date().toISOString(),
  location: '',
  capacity: 50,
  status: 'upcoming',
  image: '',
};

export function AdminEvents() {
  const { t } = useLanguage();
  const { data, isLoading } = useEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<CreateEventDto>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  };
  const openEdit = (ev: Event) => {
    setEditingId(ev._id);
    setForm({
      title: ev.title,
      description: ev.description,
      type: ev.type,
      date: ev.date,
      location: ev.location,
      capacity: ev.capacity,
      status: ev.status,
      image: ev.image ?? '',
    });
    setFormOpen(true);
  };
  const submit = () => {
    if (editingId) {
      updateEvent.mutate({ id: editingId, data: form });
    } else {
      createEvent.mutate(form);
    }
    setFormOpen(false);
  };
  const onDelete = (id: string) => setConfirmId(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">{t('Events')}</h2>
        <Button onClick={openCreate}>+ {t('Add Event')}</Button>
      </div>

      {isLoading && (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      )}

      {formOpen && (
        <Modal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          title={editingId ? t('Edit Event') : t('Add Event')}
          className="sm:max-w-3xl"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Left column: compact fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  placeholder={t('Title')}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <Input
                  placeholder={t('Location')}
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
                <Dropdown
                  value={form.type}
                  onChange={(v) => setForm({ ...form, type: v as EventType })}
                  options={EVENT_TYPES.map((tp) => ({ label: tp, value: tp }))}
                />
                <Dropdown
                  value={form.status}
                  onChange={(v) => setForm({ ...form, status: v as EventStatus })}
                  options={EVENT_STATUSES.map((st) => ({ label: st, value: st }))}
                />
                <Input
                  type="datetime-local"
                  value={form.date.slice(0, 16)}
                  onChange={(e) => setForm({ ...form, date: new Date(e.target.value).toISOString() })}
                />
                <Input
                  type="number"
                  placeholder={t('Capacity')}
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                />
              </div>
              <FileUpload
                entityType="events"
                value={form.image ?? ''}
                onChange={(key) => setForm((f) => ({ ...f, image: key as string }))}
                accept="image/*"
                label={t('Event Image')}
                t={t}
                onUploadStateChange={setImageUploading}
              />
            </div>
            {/* Right column: tall description */}
            <div className="flex flex-col">
              <Textarea
                placeholder={t('Description')}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="h-64 flex-1 sm:h-full"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              onClick={submit}
              disabled={createEvent.isPending || updateEvent.isPending || imageUploading}
            >
              {imageUploading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : editingId ? (
                t('Save')
              ) : (
                t('Create')
              )}
            </Button>
            <Button variant="ghost" onClick={() => setFormOpen(false)}>
              {t('Cancel')}
            </Button>
          </div>
        </Modal>
      )}

      <div className="space-y-3">
        {data?.events.map((ev) => (
          <Card key={ev._id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-heading font-semibold">{ev.title}</p>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(ev.date)} · {ev.location}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="primary">{ev.status}</Badge>
              <Button size="sm" variant="outline" onClick={() => openEdit(ev)}>
                {t('Edit')}
              </Button>
              <Button size="sm" variant="danger" onClick={() => onDelete(ev._id)}>
                {t('Delete')}
              </Button>
            </div>
          </Card>
        ))}
        {!isLoading && data?.events.length === 0 && (
          <p className="text-muted-foreground">{t('No events yet.')}</p>
        )}
      </div>

      <ConfirmDialog
        open={confirmId !== null}
        onClose={() => setConfirmId(null)}
        title="Delete"
        message="Delete this event?"
        onConfirm={() => {
          if (confirmId) deleteEvent.mutate(confirmId);
          setConfirmId(null);
        }}
        confirmDisabled={deleteEvent.isPending}
      />
    </div>
  );
}
