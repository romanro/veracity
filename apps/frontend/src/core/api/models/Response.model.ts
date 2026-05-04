import { type TPagination } from './Pagination.model';

export type TSIngleResponse<T> = T;

export type TMultiResponse<T> = TPagination & {
  data: T[];
};
