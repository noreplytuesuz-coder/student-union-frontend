import { apiClient } from '@/shared/api';
import type {
  CreateUserDto,
  UpdateUserDto,
  User,
} from '../model/types';

export const userApi = {
  list: () => apiClient.get<User[]>('/user').then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<User>(`/user/${id}`).then((r) => r.data),

  create: (data: CreateUserDto) =>
    apiClient.post<User>('/user', data).then((r) => r.data),

  update: (id: string, data: UpdateUserDto) =>
    apiClient.patch<User>(`/user/${id}`, data).then((r) => r.data),

  remove: (id: string) =>
    apiClient.delete<null>(`/user/${id}`).then((r) => r.data),
};
