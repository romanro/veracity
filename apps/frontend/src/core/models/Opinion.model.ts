import { type TAuthor } from './Author.model';

export type TOpinionItem = {
  id: string | number;
  text: string;
  textEn: string | null;
  textRu: string | null;
  imgUrl: string | null;
  rating: number;
  countRefutations: number;
  countComments: number;
  countConfirmations: number;
  createdDate: string;
  children: TOpinionItem[];
  author: TAuthor;
};
