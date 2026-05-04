import { type FC } from 'react';
import { useDroppable, useDndContext } from '@dnd-kit/core';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import styles from './ReorderDropZone.module.scss';

interface TReorderDropZoneProps {
  parentPath: string;
  insertionIndex: number;
  isActive?: boolean;
  className?: string;
  isEditing?: boolean;
}

export const ReorderDropZone: FC<TReorderDropZoneProps> = ({
  parentPath,
  insertionIndex,
  isActive = false,
  className,
  isEditing = false,
}) => {
  const { t } = useTranslation('newOpinionPage');
  const { active } = useDndContext();

  // Check if we're dragging a node for reordering
  const isDraggingNodeReorder = active?.data.current?.type === 'node-reorder';
  const isDraggingQuoteLibraryItem = active?.data.current?.item && !active?.data.current?.type;

  // Only show reorder zones when dragging nodes AND not editing
  const shouldShow = isDraggingNodeReorder && !isDraggingQuoteLibraryItem && !isEditing;

  const { isOver, setNodeRef } = useDroppable({
    id: `reorder-drop-${parentPath}-${insertionIndex}`,
    data: {
      type: 'reorder-drop',
      parentPath,
      insertionIndex,
    },
    disabled: !shouldShow,
  });

  if (!shouldShow) {
    return null;
  }

  return (
    <div
      ref={setNodeRef}
      className={classNames(styles.reorderDropZone, isOver && styles.active, isActive && styles.visible, className)}
    >
      {isOver && (
        <div className={styles.dropIndicator}>
          <span className={styles.dropText}>{t('dropHereToReorder')}</span>
        </div>
      )}
    </div>
  );
};
