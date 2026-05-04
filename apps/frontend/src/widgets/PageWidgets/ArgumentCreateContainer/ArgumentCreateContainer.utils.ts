import { type TArgument } from '@/core/models/Argument.model';

export const itemArgumentNew: TArgument = {
  id: '',
  content: '',
  imgUrl: null,
  imgFile: null,
  createdDate: new Date().toString(),
  author: {
    id: '',
    name: '',
  },
  theme: '',
  countRefutations: 0,
  countComments: 0,
  countConfirmations: 0,
};
