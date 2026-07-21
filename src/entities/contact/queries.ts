import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { contactApi } from './api/contact';
import type { ContactListParams } from './model/types';

export const contactKeys = {
  all: ['contacts'] as const,
  list: (params: ContactListParams) => ['contacts', 'list', params] as const,
  detail: (id: string) => ['contacts', 'detail', id] as const,
};

export function useContacts(params: ContactListParams = {}) {
  return useQuery({
    queryKey: contactKeys.list(params),
    queryFn: () => contactApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useContact(id: string | undefined) {
  return useQuery({
    queryKey: contactKeys.detail(id ?? ''),
    queryFn: () => contactApi.getById(id as string),
    enabled: Boolean(id),
  });
}
