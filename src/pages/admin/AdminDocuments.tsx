import { useLanguage } from '@/app/providers';
import {
  useCreateDocument,
  useDeleteDocument,
  useDocuments,
  type CreateDocumentDto,
} from '@/entities/document';
import { Button, Card, FileUpload, Input, Modal, Skeleton, Textarea } from '@/shared/ui';
import { ConfirmDialog } from '@/widgets/confirm-dialog';
import { formatDate } from '@/shared/lib/utils';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

const empty: CreateDocumentDto = { title: '', description: '', file: '' };

export function AdminDocuments() {
  const { t } = useLanguage();
  const { data, isLoading } = useDocuments();
  const create = useCreateDocument();
  const remove = useDeleteDocument();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateDocumentDto>(empty);
  const [fileUploading, setFileUploading] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleDelete = () => {
    if (confirmId) remove.mutate(confirmId);
    setConfirmId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">{t('Documents')}</h2>
        <Button
          onClick={() => {
            setForm(empty);
            setOpen(true);
          }}
        >
          + {t('Add Document')}
        </Button>
      </div>

      {isLoading && [1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}

      {open && (
        <Modal open={open} onClose={() => setOpen(false)} title={t('Add Document')}>
          <Input placeholder={t('Title')} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea placeholder={t('Description')} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <FileUpload entityType="documents" value={form.file ?? ''} onChange={(key) => setForm((f) => ({ ...f, file: key as string }))} accept="application/pdf,image/*" label={t('File')} t={t} onUploadStateChange={setFileUploading} />
          <div className="flex gap-2">
            <Button onClick={() => { create.mutate(form); setOpen(false); }} disabled={create.isPending || fileUploading}>
              {fileUploading ? <Loader2 size={16} className="animate-spin" /> : `+ ${t('Add Document')}`}
            </Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              {t('Cancel')}
            </Button>
          </div>
        </Modal>
      )}

      <div className="space-y-3">
        {data?.map((d) => (
          <Card key={d._id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-heading font-semibold">{d.title}</p>
              <p className="text-sm text-muted-foreground">{formatDate(d.createdAt)}</p>
            </div>
            <div className="flex items-center gap-2">
              <a href={d.file} target="_blank" rel="noreferrer">
                <Button size="sm" variant="ghost">
                  {t('Open')}
                </Button>
              </a>
              <Button size="sm" variant="danger" onClick={() => setConfirmId(d._id)}>
                {t('Delete')}
              </Button>
            </div>
          </Card>
        ))}
        {!isLoading && data?.length === 0 && <p className="text-muted-foreground">{t('No documents yet.')}</p>}
      </div>

      <ConfirmDialog
        open={confirmId !== null}
        onClose={() => setConfirmId(null)}
        title="Delete"
        message="Delete this document?"
        onConfirm={handleDelete}
        confirmDisabled={remove.isPending}
      />
    </div>
  );
}
