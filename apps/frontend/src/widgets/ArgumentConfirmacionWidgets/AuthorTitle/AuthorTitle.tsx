import { type FC } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { type TAuthorTitleProps } from './AuthorTitle.models';
import { formatDateToMmDdYyyy } from '@/functions/formatDate';
import { Avatar } from '@libs/ui-components/Avatar';

export const AuthorTitle: FC<TAuthorTitleProps> = ({ avatar, nameFull, rating, createdDate }) => {
  const router = useRouter();
  return (
    <div className='flex flex-row justify-between'>
      <div className='mb-4 flex flex-row items-center'>
        <Avatar avatar={avatar ?? ''} alt={nameFull ?? ''} />
        <button
          onClick={() => {
            router.push('/test');
          }}
        >
          <span className='text-gray-t ml-4'>{nameFull ?? ''}</span>
        </button>

        <Image width={17} height={14} src='/img/diamond.png' className='ml-3' alt='' />
        <span className='ml-1 text-[#9B51E0]'>{rating}</span>
      </div>
      <span className='text-gray-t'>{formatDateToMmDdYyyy(createdDate ?? '')}</span>
    </div>
  );
};
