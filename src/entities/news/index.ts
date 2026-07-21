export * from './model/types';
export { newsApi } from './api/news';
export { useNews, useNewsDetail, newsKeys } from './queries';
export {
  useCreateNews,
  useUpdateNews,
  useDeleteNews,
} from './mutations';
