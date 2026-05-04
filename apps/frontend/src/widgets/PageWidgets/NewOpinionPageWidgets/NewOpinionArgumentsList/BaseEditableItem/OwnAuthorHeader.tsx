import { type FC } from 'react';
import { Avatar } from '@libs/ui-components/Avatar';
import { formatDate } from '@libs/utils/date/dateFormat.utils';

type TOwnAuthorHeaderProps = {
  authorName?: string;
  avatar?: string;
  createdDate: string;
};

export const OwnAuthorHeader: FC<TOwnAuthorHeaderProps> = ({ authorName, avatar, createdDate }) => (
  <header className='z-2 flex w-[100%] pl-[5px] pr-[15px] pt-[12px] flex-row items-center justify-between'>
    <div className='flex flex-row items-center gap-2 text-sm text-(--color-text-secondary)'>
      <Avatar avatar={avatar} size={20} />
      <span>{authorName ?? ''}</span>
    </div>
    <span className='text-sm text-(--color-text-secondary)'>
      {formatDate(createdDate, { includeTime: true })}
    </span>
  </header>
);
