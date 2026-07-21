import { useMutation } from '@tanstack/react-query';
import {
  confirmUpload,
  presignFile,
  uploadToPresignedUrl,
  type EntityType,
} from './api/upload';

/**
 * Full presigned-upload flow for a single file:
 *   1. POST /upload/presign  -> { uploadUrl, fileKey }
 *   2. PUT bytes to uploadUrl (MinIO)
 *   3. POST /upload/confirm  -> mark registry "attached"
 *
 * onSuccess returns the `fileKey` to persist on the entity.
 */
export function useFileUpload(entityType: EntityType) {
  return useMutation<string, Error, File>({
    mutationFn: async (file: File) => {
      const { uploadUrl, fileKey } = await presignFile(entityType, file);
      await uploadToPresignedUrl(uploadUrl, file);
      await confirmUpload(fileKey, entityType);
      return fileKey;
    },
  });
}
