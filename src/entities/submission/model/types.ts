import type { Pagination } from '@/shared/api';

export type SubmissionStatus = 'pending' | 'accepted' | 'rejected';

export interface Submission {
  _id: string;
  name: string;
  email: string;
  department: string;
  interests: string;
  whyJoin: string;
  image?: string;
  status: SubmissionStatus;
  reviewedBy?: string | { name: string };
  reviewedAt?: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SubmissionCreateDto = {
  name: string;
  email: string;
  department: string;
  interests: string;
  whyJoin: string;
};

export interface SubmissionListParams {
  status?: SubmissionStatus;
  page?: number;
  limit?: number;
}

export interface SubmissionListResponse {
  submissions: Submission[];
  pagination: Pagination;
}
