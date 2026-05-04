import { useEffect, useRef, type FC } from 'react';
import { CardArgumentCreate } from '../CardArgumentCreate';
import { type TArgumentsCreateListProps } from './ArgumentsCreateList.models';
import { useListArguments } from '@/libs/hooks/useListArguments/useListArguments';
import { useDroppable } from '@dnd-kit/core';

export const ArgumentsCreateList: FC<TArgumentsCreateListProps> = ({ onContextMenu, onEnterDeleteArgument }) => {
  const listNewArgumentsWrite = useListArguments();
  const { setNodeRef } = useDroppable({
    id: 'dropzone',
  });
  const ulRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (listNewArgumentsWrite.length > 0) {
      const lastLi = ulRef.current?.lastElementChild;
      lastLi?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [listNewArgumentsWrite]);

  return (
    <ul
      ref={(node) => {
        setNodeRef(node);
        ulRef.current = node;
      }}
      className='max-h-full overflow-y-auto p-4 pt-2 pb-2'
    >
      <div className='min-h1 p-2'></div>
      {listNewArgumentsWrite.map((argument) => (
        <li key={argument.id + argument.createdDate}>
          <CardArgumentCreate
            item={argument}
            onContextMenu={onContextMenu}
            showContextMenu={() => {}}
            onEnterDeleteArgument={onEnterDeleteArgument}
          />
        </li>
      ))}
    </ul>
  );
};
