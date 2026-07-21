import { useLanguage } from '@/app/providers';
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
  type CreateUserDto,
  type UpdateUserDto,
  type User,
  type UserRole,
} from '@/entities/user';
import { useFileUpload } from '@/entities/upload';
import { Avatar } from '@/shared/ui';
import { Button, Card, Dropdown, Input, Modal, Skeleton, StatusBadge } from '@/shared/ui';
import { ConfirmDialog } from '@/widgets/confirm-dialog';
import { ImageUp, Loader2, X } from 'lucide-react';
import { useRef, useState } from 'react';

const empty: CreateUserDto = {
  name: '',
  email: '',
  password: '',
  role: 'member',
  major: '',
  points: 0,
  isVerified: false,
};

export function AdminMembers() {
  const { t } = useLanguage();
  const { data, isLoading } = useUsers();
  const create = useCreateUser();
  const update = useUpdateUser();
  const remove = useDeleteUser();
  const uploadPhoto = useFileUpload('users');
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateUserDto>(empty);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleDelete = () => {
    if (confirmId) remove.mutate(confirmId);
    setConfirmId(null);
  };

  const reset = () => {
    setOpen(false);
    setEditingId(null);
    setForm(empty);
  };

  const openEdit = (u: User) => {
    setEditingId(u._id);
    setForm({
      name: u.name,
      email: u.email,
      password: '',
      role: u.role,
      major: u.major ?? '',
      points: u.points,
      isVerified: u.isVerified,
      image: u.image,
    });
    setOpen(true);
  };

  const handlePhotoChange = async (file: File) => {
    const fileKey = await uploadPhoto.mutateAsync(file);
    setForm((f) => ({ ...f, image: fileKey }));
  };

  const submit = () => {
    if (editingId) {
      const payload: UpdateUserDto = { ...form };
      delete (payload as Partial<CreateUserDto>).password;
      update.mutate({ id: editingId, data: payload });
    } else {
      create.mutate(form);
    }
    reset();
  };

  const uploading = uploadPhoto.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">{t('Members')}</h2>
        <Button
          onClick={() => {
            reset();
            setOpen(true);
          }}
        >
          + {t('Add Member')}
        </Button>
      </div>

      {isLoading && [1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}

      {open && (
        <Modal open={open} onClose={reset} title={editingId ? t('Edit Member') : t('Add Member')}>
          <div className="mb-6 flex items-center gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                disabled={uploading}
                className="group relative block h-20 w-20 rounded-full overflow-hidden neo-border neo-shadow cursor-pointer disabled:cursor-not-allowed"
                aria-label={t('Change avatar')}
              >
                <Avatar name={form.name || '?'} image={form.image} className="h-full w-full" fallbackClassName="text-2xl" />
                <span
                  className={`absolute inset-0 flex items-center justify-center bg-black/40 text-white transition-opacity ${
                    uploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {uploading ? <Loader2 size={26} className="animate-spin" /> : <ImageUp size={26} />}
                </span>
              </button>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePhotoChange(file);
                  e.target.value = '';
                }}
              />
              {form.image && !uploading && (
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, image: undefined }))}
                  className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white neo-border"
                  aria-label={t('Remove avatar')}
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <div>
              <p className="font-heading font-bold">{t('Avatar')}</p>
              <p className="font-sans text-sm text-muted-foreground">{t('Upload a profile photo for this member.')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input placeholder={t('Full Name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input type="email" placeholder={t('Email Address')} disabled={!!editingId} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input type="password" placeholder={editingId ? t('Leave blank to keep') : t('Password')} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Input placeholder={t('Major')} value={form.major ?? ''} onChange={(e) => setForm({ ...form, major: e.target.value })} />
            <Dropdown value={form.role} onChange={(v) => setForm({ ...form, role: v as UserRole })} options={[{ label: t('Member'), value: 'member' }, { label: t('Admin'), value: 'user' }]} />
            <Input type="number" placeholder={t('Points')} value={form.points} onChange={(e) => setForm({ ...form, points: Number(e.target.value) })} />
          </div>
          <label className="mt-4 flex items-center gap-2">
            <input type="checkbox" checked={form.isVerified} onChange={(e) => setForm({ ...form, isVerified: e.target.checked })} />
            {t('Verified')}
          </label>
          <div className="mt-4 flex gap-2">
            <Button onClick={submit} disabled={create.isPending || update.isPending}>
              {editingId ? t('Save') : t('Create')}
            </Button>
            <Button variant="ghost" onClick={reset}>
              {t('Cancel')}
            </Button>
          </div>
        </Modal>
      )}

      <div className="space-y-3">
        {data?.map((u) => (
          <Card key={u._id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Avatar name={u.name} image={u.image} className="h-10 w-10 shrink-0" fallbackClassName="text-sm" />
              <div>
                <p className="font-heading font-semibold">
                  {u.name} <span className="text-sm font-normal text-muted-foreground">· {u.email}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {u.major ?? '—'} · {t('Points')}: {u.points}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={u.role === 'user' ? 'admin' : 'member'} />
              {u.isVerified && <StatusBadge status="active" />}
              <Button size="sm" variant="outline" onClick={() => openEdit(u)}>
                {t('Edit')}
              </Button>
              <Button size="sm" variant="danger" onClick={() => setConfirmId(u._id)}>
                {t('Delete')}
              </Button>
            </div>
          </Card>
        ))}
        {!isLoading && data?.length === 0 && <p className="text-muted-foreground">{t('No members yet.')}</p>}
      </div>

      <ConfirmDialog
        open={confirmId !== null}
        onClose={() => setConfirmId(null)}
        title="Delete"
        message="Delete this member?"
        onConfirm={handleDelete}
        confirmDisabled={remove.isPending}
      />
    </div>
  );
}

