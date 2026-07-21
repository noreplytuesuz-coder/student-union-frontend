import { apiClient } from '@/shared/api';
import type {
  Contact,
  ContactCreateDto,
  ContactListParams,
  ContactListResponse,
} from '../model/types';

export const contactApi = {
  create: (data: ContactCreateDto) =>
    apiClient.post<Contact>('/contact', data).then((r) => r.data),

  list: (params: ContactListParams = {}) =>
    apiClient
      .get<ContactListResponse>('/contact', { params })
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Contact>(`/contact/${id}`).then((r) => r.data),

  remove: (id: string) =>
    apiClient.delete<null>(`/contact/${id}`).then((r) => r.data),
};
