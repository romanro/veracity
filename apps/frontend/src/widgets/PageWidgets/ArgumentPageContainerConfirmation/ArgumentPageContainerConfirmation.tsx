'use client';
import { useState, type FC } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { addArgument } from '@/store/argumentsSlice';
import { type TArgument } from '@/core/models/Argument.model';
import { CardArgumentSearch } from '@/widgets/Arguments/CardArgumentSearch';
import { Card } from '@libs/ui-components/Card';
import { type TArgumentPageContainerConfirmationProps } from './ArgumentPageContainerConfirmation.models';
import { ArgumentPageLeft } from '../ArgumentPageLeft';
import { ArgumentPageRight } from '../ArgumentPageRight';
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent } from '@dnd-kit/core';
import styles from './ArgumentPageContainerConfirmation.module.scss';
import classNames from 'classnames';

export const ArgumentPageContainerConfirmation: FC<TArgumentPageContainerConfirmationProps> = ({
  topic,
  version,
  argument,
  typeArguments,
  mainParams,
}) => {
  const { ready } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  const [activeDragItem, setActiveDragItem] = useState<TArgument | null>(null);
  const [droppedItemId, setDroppedItemId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.item) {
      setActiveDragItem(active.data.current.item);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over?.id === 'dropzone' && active.data.current?.item) {
      const draggedArgument = active.data.current.item;
      dispatch(addArgument(draggedArgument as TArgument));
      setDroppedItemId(draggedArgument.id);
    }
  };

  const handleItemDropped = (id: string) => {
    if (droppedItemId === id) {
      setDroppedItemId(null);
    }
  };

  const onClickCanel = () => {
    router.back();
  };

  if (!ready) {
    return <Card className='text-[var(--color-purple-600)] text-[var(--font-size-3xl)]'>Loading translations...</Card>;
  }

  return (
    <Card className='fixed flex w-full'>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <ArgumentPageLeft
          topic={topic}
          version={version}
          argument={argument}
          onClickCanel={onClickCanel}
          typeArguments={typeArguments}
        ></ArgumentPageLeft>

        <div className={classNames(styles.lineaVertical)}></div>
        <ArgumentPageRight
          mainParams={mainParams}
          onItemDropped={handleItemDropped}
          droppedItemId={droppedItemId}
        ></ArgumentPageRight>

        <DragOverlay>
          {activeDragItem ? (
            <div className={classNames(styles.dragOverlayWrapper)}>
              <CardArgumentSearch
                item={activeDragItem}
                newArgument={true}
                onContextMenu={false}
                className={classNames(styles.dragOverlayWrapper)}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Card>
  );
};
