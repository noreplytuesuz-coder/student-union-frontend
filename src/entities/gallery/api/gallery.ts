import { apiClient } from '@/shared/api';
import type { CreateGalleryDto, Gallery, UpdateGalleryDto } from '../model/types';

export const galleryApi = {
  list: () => apiClient.get<Gallery[]>('/gallery').then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Gallery>(`/gallery/${id}`).then((r) => r.data),

  create: (data: CreateGalleryDto) =>
    apiClient.post<Gallery>('/gallery', data).then((r) => r.data),

  update: (id: string, data: UpdateGalleryDto) =>
    apiClient.patch<Gallery>(`/gallery/${id}`, data).then((r) => r.data),

  remove: (id: string) =>
    apiClient.delete<null>(`/gallery/${id}`).then((r) => r.data),
};
