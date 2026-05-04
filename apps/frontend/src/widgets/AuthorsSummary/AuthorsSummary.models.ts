import { type TAuthor } from '@/core/models/Author.model';

export type TAuthorsSummaryProps = {
  authors: TAuthor[];
  limit?: number;
};
