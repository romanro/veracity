import { type TAuthor } from './Author.model';
import { type TCount } from './Count.model';
import { type TOpinionItem } from './Opinion.model';

type TPaginatedOpinions = {
  page: number;
  perPage: number;
  pages: number;
  total: number;
  data: TOpinionItem[];
};

export type TArgument = TCount & {
  id: string;
  content: string;
  createdDate: string;
  author: TAuthor;
  type?: string;
  theme: string;
  text?: string;
  imgUrl?: string | null;
  imgFile?: File | null;
  description?: string;
  myArgument?: boolean;
  systemArgument?: boolean;
  approve?: TPaginatedOpinions;
  refuse?: TPaginatedOpinions;
  //order?: number;
  levelHeader?: number;
  nameHeader?: string;
  status?: string;
  authors?: TAuthor[];
  topicId?: string;
  versionId?: string;
  title?: string;
  isQuoted?: boolean;
  isNew?: boolean;
  rating?: number;
  relatedArguments?: TArgument[];
  isEdit?: boolean;
};
