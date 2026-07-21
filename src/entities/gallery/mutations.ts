import { useMutation, useQueryClient } from '@tanstack/react-query';
import { galleryApi } from './api/gallery';
import { galleryKeys } from './queries';
import type { CreateGalleryDto, UpdateGalleryDto } from './model/types';

export function useCreateGallery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGalleryDto) => galleryApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: galleryKeys.all }),
  });
}

export function useUpdateGallery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGalleryDto }) =>
      galleryApi.update(id, data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: galleryKeys.detail(vars.id) });
      qc.invalidateQueries({ queryKey: galleryKeys.all });
    },
  });
}

export function useDeleteGallery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => galleryApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: galleryKeys.all }),
  });
}
