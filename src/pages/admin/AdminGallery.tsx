import { useLanguage } from '@/app/providers';
import {
  useCreateGallery,
  useDeleteGallery,
  useGalleries,
  useUpdateGallery,
  type CreateGalleryDto,
} from '@/entities/gallery';
import { Button, Card, FileUpload, Input, Modal, Skeleton } from '@/shared/ui';
import { ConfirmDialog } from '@/widgets/confirm-dialog';
import { getImageUrl } from '@/shared/lib/utils';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

const empty: CreateGalleryDto = { title: '', images: [] };

export function AdminGallery() {
  const { t } = useLanguage();
  const { data, isLoading } = useGalleries();
  const create = useCreateGallery();
  const update = useUpdateGallery();
  const remove = useDeleteGallery();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateGalleryDto>(empty);
  const [titleError, setTitleError] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleDelete = () => {
    if (confirmId) remove.mutate(confirmId);
    setConfirmId(null);
  };

  const validate = () => {
    if (form.title.trim().length < 2) {
      setTitleError(t('Title must be at least 2 characters.'));
      return false;
    }
    if (form.images.length === 0) {
      setTitleError(t('Add at least one photo.'));
      return false;
    }
    setTitleError('');
    return true;
  };

  const openEdit = (g: { _id: string; title: string; images: string[] }) => {
    setEditingId(g._id);
    setForm({ title: g.title, images: g.images });
    setOpen(true);
  };

  const reset = () => {
    setOpen(false);
    setEditingId(null);
    setForm(empty);
    setTitleError('');
  };

  const submit = () => {
    if (!validate()) return;
    if (editingId) {
      update.mutate({ id: editingId, data: form });
    } else {
      create.mutate(form);
    }
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">{t('Gallery')}</h2>
        <Button
          onClick={() => {
            reset();
            setOpen(true);
          }}
        >
          + {t('Add Photo')}
        </Button>
      </div>

      {isLoading && [1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}

      {open && (
        <Modal
          open={open}
          onClose={reset}
          title={editingId ? t('Edit Photo') : t('Add Photo')}
          className="sm:max-w-3xl"
        >
          <Input
            placeholder={t('Title')}
            value={form.title}
            onChange={(e) => {
              setForm({ ...form, title: e.target.value });
              if (titleError) setTitleError('');
            }}
          />
          {titleError && <p className="text-sm text-red-500">{titleError}</p>}
          <FileUpload
            entityType="gallery"
            value={form.images[0] ?? ''}
            onChange={(key) =>
              setForm((f) => ({ ...f, images: key ? [key as string] : [] }))
            }
            accept="image/*"
            label={t('Add Photo')}
            t={t}
            onUploadStateChange={setImageUploading}
          />
          <div className="flex gap-2">
            <Button
              onClick={submit}
              disabled={create.isPending || update.isPending || imageUploading || form.title.trim().length < 2}
            >
              {imageUploading ? <Loader2 size={16} className="animate-spin" /> : t('Save')}
            </Button>
            <Button variant="ghost" onClick={reset}>
              {t('Cancel')}
            </Button>
          </div>
        </Modal>
      )}

      {/* Gallery display: image-first tiles */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {data?.map((g) => (
          <Card key={g._id} className="group relative overflow-hidden p-0">
            <div className="grid grid-cols-2 gap-0.5">
              {g.images.slice(0, 4).map((img, i) => (
                <div key={i} className={g.images.length === 1 ? 'col-span-2' : ''}>
                  <img
                    src={getImageUrl(img)}
                    alt={g.title}
                    className={g.images.length > 2 ? 'h-28 w-full object-cover' : 'h-40 w-full object-cover'}
                  />
                </div>
              ))}
            </div>
            {/* hover overlay with title + actions */}
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
              <p className="mb-2 line-clamp-1 text-sm font-semibold text-white">{g.title}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/40 bg-white/10 text-white hover:bg-white/20"
                  onClick={() => openEdit(g)}
                >
                  {t('Edit')}
                </Button>
                <Button size="sm" variant="danger" onClick={() => setConfirmId(g._id)}>
                  {t('Delete')}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {!isLoading && data?.length === 0 && <p className="text-muted-foreground">{t('No gallery yet.')}</p>}

      <ConfirmDialog
        open={confirmId !== null}
        onClose={() => setConfirmId(null)}
        title="Delete"
        message="Delete this gallery?"
        onConfirm={handleDelete}
        confirmDisabled={remove.isPending}
      />
    </div>
  );
}
