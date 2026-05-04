import { type TArgument } from './Argument.model';
import { type TAuthor } from './Author.model';
import { type TBookMark } from './BookMark.model';
import { type TCount } from './Count.model';

export type TVersion = Partial<TCount> & {
  id: string;
  countVersions: number;
  verasity: string;
  reliability: number;
  title: string;
  description: string;
  srcImg: string;
  createdDate: string;
  bookMarks: TBookMark[];
  arguments: TArgument[];
  approve: string;
  refuse: string;
  authors?: TAuthor[];
  author?: TAuthor;
  numberVersionInTheme?: number;
  topicId?: string;
  classNameBody?: string;
  argumentId?: string;
};
