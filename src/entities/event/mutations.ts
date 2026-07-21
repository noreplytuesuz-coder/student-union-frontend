import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventApi } from './api/event';
import { eventKeys } from './queries';
import type { CreateEventDto, UpdateEventDto } from './model/types';

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEventDto) => eventApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: eventKeys.all }),
  });
}

export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventDto }) =>
      eventApi.update(id, data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: eventKeys.detail(vars.id) });
      qc.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eventApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: eventKeys.all }),
  });
}

export function useParticipateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eventApi.participate(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: eventKeys.detail(id) });
      qc.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}

export function useWithdrawEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eventApi.withdraw(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: eventKeys.detail(id) });
      qc.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}

export function useConfirmParticipation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, userId }: { eventId: string; userId: string }) =>
      eventApi.confirmParticipation(eventId, userId),
    onSuccess: (_data, { eventId }) => {
      qc.invalidateQueries({ queryKey: eventKeys.participations(eventId) });
      qc.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
    },
  });
}

export function useRemoveParticipation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, userId }: { eventId: string; userId: string }) =>
      eventApi.removeParticipation(eventId, userId),
    onSuccess: (_data, { eventId }) => {
      qc.invalidateQueries({ queryKey: eventKeys.participations(eventId) });
      qc.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
    },
  });
}

export function useAdjustParticipationPoints() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      userId,
      points,
    }: {
      eventId: string;
      userId: string;
      points: number;
    }) => eventApi.adjustParticipationPoints(eventId, userId, points),
    onSuccess: (_data, { eventId }) => {
      qc.invalidateQueries({ queryKey: eventKeys.participations(eventId) });
    },
  });
}
