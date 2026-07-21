import { useLanguage } from '@/app/providers';
import {
  useCreatePartner,
  useDeletePartner,
  usePartners,
  useUpdatePartner,
  type CreatePartnerDto,
} from '@/entities/partner';
import { Button, Card, FileUpload, Input, Modal, Skeleton } from '@/shared/ui';
import { ConfirmDialog } from '@/widgets/confirm-dialog';
import { getImageUrl } from '@/shared/lib/utils';
import { Pencil, Loader2 } from 'lucide-react';
import { useState } from 'react';

const empty: CreatePartnerDto = { name: '', logo: '' };

export function AdminPartners() {
  const { t } = useLanguage();
  const { data, isLoading } = usePartners();
  const create = useCreatePartner();
  const update = useUpdatePartner();
  const remove = useDeletePartner();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreatePartnerDto>(empty);
  const [imageUploading, setImageUploading] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleDelete = () => {
    if (confirmId) remove.mutate(confirmId);
    setConfirmId(null);
  };

  const openEdit = (p: { _id: string; name: string; logo: string }) => {
    setEditingId(p._id);
    setForm({ name: p.name, logo: p.logo });
    setOpen(true);
  };

  const reset = () => {
    setOpen(false);
    setEditingId(null);
    setForm(empty);
  };

  const submit = () => {
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
        <h2 className="font-display text-2xl font-bold">{t('Partners')}</h2>
        <Button
          onClick={() => {
            reset();
            setOpen(true);
          }}
        >
          + {t('Add Partner')}
        </Button>
      </div>

      {isLoading && [1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}

      {open && (
        <Modal open={open} onClose={reset} title={editingId ? t('Edit Partner') : t('Add Partner')}>
          <Input
            placeholder={t('Name')}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <FileUpload entityType="partners" value={form.logo ?? ''} onChange={(key) => setForm((f) => ({ ...f, logo: key as string }))} accept="image/*" label={t('Logo')} t={t} onUploadStateChange={setImageUploading} />
          <div className="flex gap-2">
            <Button onClick={submit} disabled={create.isPending || update.isPending || imageUploading}>
              {imageUploading ? <Loader2 size={16} className="animate-spin" /> : t('Save')}
            </Button>
            <Button variant="ghost" onClick={reset}>
              {t('Cancel')}
            </Button>
          </div>
        </Modal>
      )}

      <div className="space-y-3">
        {data?.map((p) => (
          <Card key={p._id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {p.logo && (
                <img
                  src={getImageUrl(p.logo)}
                  alt={p.name}
                  className="h-10 w-10 rounded object-contain"
                />
              )}
              <p className="font-heading font-semibold">{p.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => openEdit(p)}>
                {t('Edit')}
              </Button>
              <Button size="sm" variant="danger" onClick={() => setConfirmId(p._id)}>
                {t('Delete')}
              </Button>
            </div>
          </Card>
        ))}
        {!isLoading && data?.length === 0 && <p className="text-muted-foreground">{t('No partners yet.')}</p>}
      </div>

      <ConfirmDialog
        open={confirmId !== null}
        onClose={() => setConfirmId(null)}
        title="Delete"
        message="Delete this partner?"
        onConfirm={handleDelete}
        confirmDisabled={remove.isPending}
      />
    </div>
  );
}
