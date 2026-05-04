import { type FC } from 'react';
import { type TCardArgumentSearchTextProps } from './CardArgumentSearchText.models';

export const CardArgumentSearchText: FC<TCardArgumentSearchTextProps> = ({ item }) => {
  return <p className='text-btn-1 pl-6 text-justify text-wrap'>{item.text}</p>;
};
