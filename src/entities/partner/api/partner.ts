import { apiClient } from '@/shared/api';
import type {
  CreatePartnerDto,
  Partner,
  UpdatePartnerDto,
} from '../model/types';

export const partnerApi = {
  list: () => apiClient.get<Partner[]>('/partners').then((r) => r.data),

  create: (data: CreatePartnerDto) =>
    apiClient.post<Partner>('/partners', data).then((r) => r.data),

  update: (id: string, data: UpdatePartnerDto) =>
    apiClient.patch<Partner>(`/partners/${id}`, data).then((r) => r.data),

  remove: (id: string) =>
    apiClient.delete<null>(`/partners/${id}`).then((r) => r.data),
};
