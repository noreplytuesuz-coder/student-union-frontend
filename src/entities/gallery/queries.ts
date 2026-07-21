import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { galleryApi } from './api/gallery';

export const galleryKeys = {
  all: ['gallery'] as const,
  detail: (id: string) => ['gallery', 'detail', id] as const,
};

export function useGalleries() {
  return useQuery({
    queryKey: galleryKeys.all,
    queryFn: () => galleryApi.list(),
    placeholderData: keepPreviousData,
  });
}

export function useGallery(id: string | undefined) {
  return useQuery({
    queryKey: galleryKeys.detail(id ?? ''),
    queryFn: () => galleryApi.getById(id as string),
    enabled: Boolean(id),
  });
}
