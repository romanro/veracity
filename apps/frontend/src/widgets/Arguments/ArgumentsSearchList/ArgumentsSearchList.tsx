import { type FC } from 'react';
import { type TArgumentsSearchListProps } from './ArgumentsSearchList.models';
import { CardArgumentSearch } from '../CardArgumentSearch';
import { ArgumentsListSkeleton } from '../ArgumentsListSkeleton';
import { ArgumentsListEmpty } from '../ArgumentsListEmpty/ArgumentsListEmpty';

export const ArgumentsSearchList: FC<TArgumentsSearchListProps> = ({
  data = [],
  isLoading,
  onContextMenu,
  onClick,
}) => {
  const onClickContextmenu = () => {
    console.warn('Context menu clicked');
  };
  const isEmpty = data.length === 0;

  if (isLoading) return <ArgumentsListSkeleton />;
  if (isEmpty) return <ArgumentsListEmpty />;

  return (
    <ul className='overflow-hidden pt-2 pb-2'>
      {data.map((argument, index) => (
        <li key={`${argument.id}-${index}`}>
          <CardArgumentSearch
            item={argument}
            onContextMenu={onContextMenu}
            showContextMenu={onClickContextmenu}
            onClick={onClick}
          />
        </li>
      ))}
    </ul>
  );
};
