import { useRef, useState } from 'react';
import { ImageUp, Loader2, Pencil, Upload, X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { getImageUrl } from '@/shared/lib/utils';
import { useFileUpload, type EntityType } from '@/entities/upload';
import { Button } from './Button';

interface UploadItem {
  id: string;
  file: File;
  key?: string;
  progress: number; // 0=queued, 50=putting, 100=done
  error?: string;
  previewUrl?: string;
}

export interface FileUploadProps {
  entityType: EntityType;
  value?: string | string[] | null;
  onChange: (keys: string | string[]) => void;
  multiple?: boolean;
  accept?: string;
  label?: string;
  className?: string;
  /** i18n translate fn (defaults to identity). Keeps shared/ui free of app-layer imports. */
  t?: (key: string) => string;
  /** Notifies the parent when any upload starts/finishes so it can block submission. */
  onUploadStateChange?: (uploading: boolean) => void;
}

/**
 * Replaces the old "paste a URL" input. Picks a file locally, uploads it via
 * the presigned PUT flow, and hands the resulting MinIO `fileKey` back to the
 * parent form. Supports single + multiple; shows the current value(s) as a
 * preview (presigned GET URL) with hover-to-replace, plus upload progress.
 */
export function FileUpload({
  entityType,
  value,
  onChange,
  multiple = false,
  accept,
  label,
  className,
  t = (k) => k,
  onUploadStateChange,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<UploadItem[]>([]);
  const upload = useFileUpload(entityType);

  const emitKeys = (next: UploadItem[]) => {
    const keys = next.filter((i) => i.key).map((i) => i.key!) as string[];
    onChange(multiple ? keys : keys[0] ?? '');
  };

  const startUpload = async (file: File) => {
    const id = `${file.name}-${file.size}-${Date.now()}`;
    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;
    const item: UploadItem = { id, file, progress: 0, previewUrl };
    setItems((prev) => [...prev, item]);
    onUploadStateChange?.(true);

    try {
      const key = await upload.mutateAsync(file);
      setItems((prev) => {
        const next = prev.map((i) => (i.id === id ? { ...i, key, progress: 100 } : i));
        emitKeys(next);
        const stillUploading = next.some((i) => i.progress < 100 && !i.error);
        if (!stillUploading) onUploadStateChange?.(false);
        return next;
      });
    } catch (err) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, error: err instanceof Error ? err.message : 'Upload failed' } : i,
        ),
      );
      onUploadStateChange?.(false);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (multiple) {
      Array.from(files).forEach(startUpload);
    } else {
      // single mode: replace current selection (and clear any prior value)
      setItems((prev) => {
        prev.forEach((i) => i.previewUrl && URL.revokeObjectURL(i.previewUrl));
        return [];
      });
      startUpload(files[0]);
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      next.forEach((i) => undefined);
      emitKeys(next);
      return next;
    });
  };

  const openPicker = () => inputRef.current?.click();

  // ---- MULTIPLE MODE (gallery) ----
  if (multiple) {
    const values = Array.isArray(value) ? value : [];
    const previews = values.map((v, idx) => ({ id: `v-${idx}`, url: getImageUrl(v), raw: v }));
    const uploads = items.filter((i) => !previews.some((p) => p.id === i.id));

    return (
      <div className={cn('space-y-3', className)}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {previews.map((p) => (
            <div
              key={p.id}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border neo-border bg-gray-50 dark:bg-white/5"
            >
              <img src={p.url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={openPicker}
                className="absolute inset-0 flex items-center justify-center gap-1 bg-black/40 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Replace"
              >
                <Pencil size={16} />
                {t('Replace')}
              </button>
              <button
                type="button"
                onClick={() => onChange(values.filter((v) => v !== p.raw))}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
                aria-label="Remove"
              >
                <X size={15} />
              </button>
            </div>
          ))}
          {uploads.map((item) => (
            <div
              key={item.id}
              className="relative flex aspect-square flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border neo-border bg-[var(--bg-color)] p-2"
            >
              {item.previewUrl ? (
                <img src={item.previewUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <Upload size={18} className="text-muted-foreground" />
              )}
              {item.error ? (
                <p className="truncate text-center text-xs text-red-500">{item.error}</p>
              ) : item.progress === 100 ? (
                <p className="text-xs text-green-500">Uploaded</p>
              ) : (
                <Loader2 size={16} className="animate-spin text-muted-foreground" />
              )}
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
                aria-label="Remove"
              >
                <X size={15} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={openPicker}
            className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-gray-50 text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5 dark:bg-white/5"
          >
            <ImageUp size={28} />
            <span className="text-xs font-medium">{label ?? 'Add Photo'}</span>
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>
    );
  }

  // ---- SINGLE MODE (events / news / partners / documents) ----
  const currentValue = typeof value === 'string' ? value : '';
  const currentPreview = items.length > 0 ? items[items.length - 1] : null;
  const showExisting = !currentPreview && currentValue;

  return (
    <div className={cn('space-y-3', className)}>
      {showExisting ? (
        <button
          type="button"
          onClick={openPicker}
          className="group relative block w-full cursor-pointer overflow-hidden rounded-xl neo-border"
        >
          <img src={getImageUrl(currentValue)} alt="" className="h-48 w-full object-cover" />
          <span className="absolute inset-0 flex items-center justify-center gap-1 bg-black/40 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
            <Pencil size={16} />
            {t('Replace')}
          </span>
        </button>
      ) : currentPreview?.previewUrl ? (
        <button
          type="button"
          onClick={openPicker}
          className="group relative block w-full cursor-pointer overflow-hidden rounded-xl neo-border"
        >
          <img src={currentPreview.previewUrl} alt="" className="h-48 w-full object-cover" />
          <span className="absolute inset-0 flex items-center justify-center gap-1 bg-black/40 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
            <Pencil size={16} />
            {t('Replace')}
          </span>
        </button>
      ) : currentPreview ? (
        <div className="flex items-center gap-3 rounded-xl border neo-border bg-[var(--bg-color)] p-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/10">
            <Loader2 size={18} className="animate-spin text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            {currentPreview.error ? (
              <p className="truncate text-xs text-red-500">{currentPreview.error}</p>
            ) : (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 size={12} className="animate-spin" />
                Uploading…
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => removeItem(currentPreview.id)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-gray-100 dark:hover:bg-white/10"
            aria-label="Remove"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-gray-50 px-4 py-6 text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5 dark:bg-white/5"
        >
          <ImageUp size={24} />
          <span className="text-sm font-medium">{label ?? 'Upload file'}</span>
          {accept && <span className="text-xs opacity-70">{accept}</span>}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}
