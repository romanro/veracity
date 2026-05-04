import { type TAuthor } from '@/core/models/Author.model';
import { getAuthorName } from '@/core/utils/authors/autors.utils';
import { Avatar } from '@libs/ui-components/Avatar';
import { formatDate } from '@libs/utils/date/dateFormat.utils';
import { type FC } from 'react';
import { Rating } from '@libs/ui-components/Rating/Rating';
import { getReliability } from '../../VersionsList/VersionPreview/VersionScore/VersionScore.model';

export const ArgumentSummaryHeader: FC<{ createdDate: string; author?: TAuthor }> = ({ createdDate, author }) => {
  const avatar = author?.avatar;
  const rating = getReliability(author?.rating ?? 0);

  return (
    <header className='z-2 flex w-[100%] pr-[10px] flex-row items-center justify-between'>
      <div className='flex flex-row items-center gap-2 text-sm text-(--color-text-secondary)'>
        <Avatar avatar={avatar} /> <span>{getAuthorName(author)}</span>
        <Rating rating={rating} />
      </div>
      <span className='text-sm text-(--color-text-secondary)'>{formatDate(createdDate, { includeTime: true })}</span>
    </header>
  );
};
