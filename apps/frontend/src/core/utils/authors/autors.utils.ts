import { type TAuthor } from '@/core/models/Author.model';

export const getAuthorName = (author: TAuthor | undefined) => {
  if (!author) return '';
  return author.name?.trim() || author.email || '';
};
