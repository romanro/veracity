import { type TAuthor } from './Author.model';
import { type TBookMark } from './BookMark.model';
import { type TVersion } from './Version.model';

export type TTopic = {
  id: string;
  title: string;
  dateCreated: Date;

  authors: TAuthor[];
  subject: string;
  versions: TVersion[];
  bookMark: TBookMark[];
  srcImg?: string;

  countComments: number;
  countAuthors: number;
};
