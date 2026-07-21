import type { Pagination } from '@/shared/api';

export interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ContactCreateDto = {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
};

export interface ContactListParams {
  read?: 'true' | 'false';
  page?: number;
  limit?: number;
}

export interface ContactListResponse {
  messages: Contact[];
  pagination: Pagination;
}
