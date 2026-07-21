import { apiClient } from '@/shared/api';
import type {
  CalendarResponse,
  CreateEventDto,
  Event,
  EventListParams,
  EventListResponse,
  EventParticipationsResponse,
  MyRegistration,
  UpdateEventDto,
} from '../model/types';

export const eventApi = {
  list: (params: EventListParams = {}) =>
    apiClient
      .get<EventListResponse>('/events', { params })
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Event>(`/events/${id}`).then((r) => r.data),

  calendar: (year?: number, month?: number) =>
    apiClient
      .get<CalendarResponse>('/events/calendar', {
        params: { year, month },
      })
      .then((r) => r.data),

  create: (data: CreateEventDto) =>
    apiClient.post<Event>('/events', data).then((r) => r.data),

  update: (id: string, data: UpdateEventDto) =>
    apiClient.patch<Event>(`/events/${id}`, data).then((r) => r.data),

  remove: (id: string) =>
    apiClient.delete<null>(`/events/${id}`).then((r) => r.data),

  participate: (id: string) =>
    apiClient.post<null>(`/events/${id}/participate`).then((r) => r.data),

  withdraw: (id: string) =>
    apiClient.delete<null>(`/events/${id}/participate`).then((r) => r.data),

  getParticipations: (id: string) =>
    apiClient
      .get<EventParticipationsResponse>(`/events/${id}/participations`)
      .then((r) => r.data),

  getMyRegistrations: () =>
    apiClient.get<MyRegistration[]>('/events/my').then((r) => r.data),

  confirmParticipation: (id: string, userId: string) =>
    apiClient
      .patch<null>(`/events/${id}/participations/${userId}/confirm`)
      .then((r) => r.data),

  removeParticipation: (id: string, userId: string) =>
    apiClient
      .patch<null>(`/events/${id}/participations/${userId}/remove`)
      .then((r) => r.data),

  adjustParticipationPoints: (id: string, userId: string, points: number) =>
    apiClient
      .patch<null>(`/events/${id}/participations/${userId}/points`, { points })
      .then((r) => r.data),
};
