'use client';

import { type FC } from 'react';
import { type TArgumentButtonImgProps } from './ArgumentButtonImg.models';
import { formatDateToMmDdYyyy } from '@/functions/formatDate';
import { Rating } from '../../Rating/Rating';

export const ArgumentButtonImg: FC<TArgumentButtonImgProps> = ({ item }) => {
  return (
    <button>
      <h2 className='text-gray-t mb-4 flex flex-row justify-between'>
        <Rating rating={item.author?.rating ?? 0} />
        <p>{formatDateToMmDdYyyy(item.createdDate)}</p>
      </h2>

      <p className='text-justifyfont-normal text-btn-1 mb-4 max-w-[1100px] text-justify text-base text-wrap'>
        {item.text}
      </p>
    </button>
  );
};
