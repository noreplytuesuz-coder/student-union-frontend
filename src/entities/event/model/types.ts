import type { Pagination } from '@/shared/api';

export type EventType =
  | 'workshop'
  | 'seminar'
  | 'competition'
  | 'cultural'
  | 'sports'
  | 'volunteer'
  | 'other';

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export type ParticipationStatus = 'pending' | 'confirmed' | 'removed';

export interface ParticipationUser {
  _id: string;
  name: string;
  email: string;
  points?: number;
  image?: string;
}

export interface EventParticipation {
  user: ParticipationUser;
  status: ParticipationStatus;
  pointsAwarded: number;
  requestedAt: string;
  confirmedAt?: string;
}

export interface ParticipationSummary {
  total: number;
  pending: number;
  confirmed: number;
  removed: number;
}

export interface EventParticipationsResponse {
  participations: EventParticipation[];
  summary: ParticipationSummary;
}

export interface MyRegistration {
  event: {
    _id: string;
    title: string;
    date: string;
    location: string;
    image?: string;
  };
  status: ParticipationStatus;
  requestedAt: string;
  confirmedAt: string | null;
}

/** Minimal author reference returned for populated `createdBy`. */
export interface AuthorRef {
  name: string;
  email: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  type: EventType;
  date: string;
  location: string;
  image?: string;
  capacity: number;
  status: EventStatus;
  participations: EventParticipation[];
  createdBy: string | AuthorRef;
  createdAt: string;
  updatedAt: string;
}

export interface EventListParams {
  search?: string;
  type?: EventType;
  page?: number;
  limit?: number;
}

export interface EventListResponse {
  events: Event[];
  pagination: Pagination;
}

export interface CalendarEvent {
  _id: string;
  title: string;
  type: EventType;
  date: string;
  location: string;
  status: EventStatus;
  capacity: number;
  participations: EventParticipation[];
}

export interface CalendarResponse {
  year: number;
  month: number;
  events: CalendarEvent[];
}

export type CreateEventDto = {
  title: string;
  description: string;
  type: EventType;
  date: string;
  location: string;
  image?: string;
  capacity: number;
  status?: EventStatus;
};

export type UpdateEventDto = Partial<CreateEventDto>;
