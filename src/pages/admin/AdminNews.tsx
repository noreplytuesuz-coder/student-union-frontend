import { useLanguage } from '@/app/providers';
import {
  useCreateNews,
  useDeleteNews,
  useNews,
  useUpdateNews,
  type CreateNewsDto,
} from '@/entities/news';
import { Badge, Button, Card, FileUpload, Input, Modal, Skeleton, StatusBadge, Textarea } from '@/shared/ui';
import { ConfirmDialog } from '@/widgets/confirm-dialog';
import { Pencil, Loader2 } from 'lucide-react';
import { formatDateTime } from '@/shared/lib/utils';
import { cn } from '@/shared/lib/utils';
import { useState } from 'react';
import { X } from 'lucide-react';

const MAX_TAGS = 3;

const empty: CreateNewsDto = {
  title: '',
  subTitle: '',
  description: '',
  tags: [],
  date: new Date().toISOString(),
  image: '',
};

export function AdminNews() {
  const { t } = useLanguage();
  const { data, isLoading } = useNews();
  const create = useCreateNews();
  const update = useUpdateNews();
  const remove = useDeleteNews();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateNewsDto>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleDelete = () => {
    if (confirmId) remove.mutate(confirmId);
    setConfirmId(null);
  };

  const addTag = () => {
    const value = tagInput.trim().toLowerCase();
    if (!value || form.tags.includes(value) || form.tags.length >= MAX_TAGS) {
      setTagInput('');
      return;
    }
    setForm((f) => ({ ...f, tags: [...f.tags, value] }));
    setTagInput('');
  };
  const removeTag = (tag: string) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  };

  const openEdit = (n: NonNullable<typeof data>['news'][number]) => {
    setEditingId(n._id);
    setForm({
      title: n.title,
      subTitle: n.subTitle,
      description: n.description,
      tags: n.tags ?? [],
      date: n.date,
      image: n.image ?? '',
    });
    setTagInput('');
    setOpen(true);
  };
  const submit = () => {
    if (editingId) update.mutate({ id: editingId, data: form });
    else create.mutate(form);
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">{t('News')}</h2>
        <Button
          onClick={() => {
            setEditingId(null);
            setForm(empty);
            setTagInput('');
            setOpen(true);
          }}
        >
          + {t('Add News')}
        </Button>
      </div>

      {isLoading && [1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}

      {open && (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title={editingId ? t('Edit News') : t('Add News')}
          className="sm:max-w-3xl"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-4">
              <Input placeholder={t('Title')} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input placeholder={t('Subtitle')} value={form.subTitle} onChange={(e) => setForm({ ...form, subTitle: e.target.value })} />
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="rounded-full p-0.5 hover:bg-primary/20"
                    aria-label={`Remove ${tag}`}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <Input
              placeholder={t('Add a tag and press Enter')}
              value={tagInput}
              disabled={form.tags.length >= MAX_TAGS}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  addTag();
                } else if (e.key === 'Backspace' && !tagInput && form.tags.length) {
                  removeTag(form.tags[form.tags.length - 1]);
                }
              }}
            />
            <p className="text-xs text-muted-foreground">{t('Tags (Max 3)')}</p>
          </div>
          <FileUpload entityType="news" value={form.image ?? ''} onChange={(key) => setForm((f) => ({ ...f, image: key as string }))} accept="image/*" label={t('News Image')} t={t} onUploadStateChange={setImageUploading} />
          <Input type="datetime-local" value={form.date.slice(0, 16)} onChange={(e) => setForm({ ...form, date: new Date(e.target.value).toISOString() })} />
            </div>
            <div className="flex flex-col">
              <Textarea placeholder={t('Description')} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="h-64 flex-1 sm:h-full" />
              <p className="mt-1 text-xs text-muted-foreground">{t('One paragraph per line.')}</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={submit} disabled={create.isPending || update.isPending || imageUploading}>
              {imageUploading ? <Loader2 size={16} className="animate-spin" /> : editingId ? t('Save') : t('Create')}
            </Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              {t('Cancel')}
            </Button>
          </div>
        </Modal>
      )}

      <div className="space-y-3">
        {data?.news.map((n) => (
          <Card key={n._id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-heading font-semibold">{n.title}</p>
              <p className="text-sm text-muted-foreground">
                {n.tags?.join(', ')} · {formatDateTime(n.date)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={n.status ?? 'published'} />
              <Button size="sm" variant="outline" onClick={() => openEdit(n)}>
                {t('Edit')}
              </Button>
              <Button size="sm" variant="danger" onClick={() => setConfirmId(n._id)}>
                {t('Delete')}
              </Button>
            </div>
          </Card>
        ))}
        {!isLoading && data?.news.length === 0 && <p className="text-muted-foreground">{t('No news yet.')}</p>}
      </div>

      <ConfirmDialog
        open={confirmId !== null}
        onClose={() => setConfirmId(null)}
        title="Delete"
        message="Delete this news?"
        onConfirm={handleDelete}
        confirmDisabled={remove.isPending}
      />
    </div>
  );
}
