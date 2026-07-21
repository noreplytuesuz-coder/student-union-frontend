import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { eventApi } from './api/event';
import type { EventListParams } from './model/types';

export const eventKeys = {
  all: ['events'] as const,
  list: (params: EventListParams) => ['events', 'list', params] as const,
  detail: (id: string) => ['events', 'detail', id] as const,
  calendar: (year?: number, month?: number) =>
    ['events', 'calendar', year, month] as const,
  participations: (id: string) => ['events', id, 'participations'] as const,
  myRegistrations: ['events', 'my-registrations'] as const,
};

export function useEvents(params: EventListParams = {}) {
  return useQuery({
    queryKey: eventKeys.list(params),
    queryFn: () => eventApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: eventKeys.detail(id ?? ''),
    queryFn: () => eventApi.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useEventCalendar(year?: number, month?: number) {
  return useQuery({
    queryKey: eventKeys.calendar(year, month),
    queryFn: () => eventApi.calendar(year, month),
  });
}

export function useEventParticipations(id: string | undefined) {
  return useQuery({
    queryKey: eventKeys.participations(id ?? ''),
    queryFn: () => eventApi.getParticipations(id as string),
    enabled: Boolean(id),
  });
}

export function useMyRegistrations() {
  return useQuery({
    queryKey: eventKeys.myRegistrations,
    queryFn: () => eventApi.getMyRegistrations(),
  });
}
