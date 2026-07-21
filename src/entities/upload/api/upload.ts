import { apiClient } from '@/shared/api/client';

export type EntityType = 'events' | 'news' | 'partners' | 'documents' | 'gallery' | 'students' | 'users' | 'projects';

export interface PresignResult {
  uploadUrl: string; // presigned PUT URL (MinIO)
  fileKey: string; // store this in the entity field
  publicUrl: string; // legacy public URL (unused when bucket is private)
}

/**
 * Ask the backend for a presigned PUT url for a single file. The returned
 * `fileKey` is what we persist on the entity (not a full URL).
 */
export async function presignFile(
  entityType: EntityType,
  file: File,
): Promise<PresignResult> {
  const { data } = await apiClient.post<PresignResult>('/upload/presign', {
    entityType,
    fileName: file.name,
    contentType: file.type || 'application/octet-stream',
    contentSize: file.size,
  });
  return data;
}

/**
 * PUT the raw file bytes straight to the presigned MinIO URL, then tell the
 * backend the upload is finished so it flips the registry flag to "attached".
 */
export async function uploadToPresignedUrl(uploadUrl: string, file: File): Promise<void> {
  await apiClient.put(uploadUrl, file, {
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    // The presigned url already carries its own auth — don't send cookies here.
    withCredentials: false,
  });
}

export async function confirmUpload(fileKey: string, entityType: EntityType): Promise<void> {
  await apiClient.post('/upload/confirm', { fileKey, entityType });
}
