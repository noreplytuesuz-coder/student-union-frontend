import type { Pagination } from '@/shared/api';

/** Minimal author reference returned for populated `createdBy`. */
export interface AuthorRef {
  name: string;
  email: string;
}

export interface News {
  _id: string;
  title: string;
  subTitle: string;
  description: string;
  tags: string[];
  image?: string;
  date: string;
  status?: 'draft' | 'published';
  createdBy: string | AuthorRef;
  createdAt: string;
  updatedAt: string;
}

export interface NewsListParams {
  search?: string;
  tag?: string;
  page?: number;
  limit?: number;
}

export interface NewsListResponse {
  news: News[];
  pagination: Pagination;
}

export type CreateNewsDto = {
  title: string;
  subTitle: string;
  description: string;
  tags: string[];
  image?: string;
  date: string;
};

export type UpdateNewsDto = Partial<CreateNewsDto>;
