import { type TAuthor } from '@core/models/Author.model';
import { Avatar } from '@libs/ui-components/Avatar';
import { type FC } from 'react';

export const TabFiltersAuthor: FC<{ author: TAuthor }> = ({ author }) => {
  const { avatar, name, email } = author;

  return (
    <div className='flex items-center gap-2'>
      <Avatar avatar={avatar} alt={name} />
      <span>{name || email}</span>
    </div>
  );
};
