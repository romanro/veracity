import { useDroppable, useDndContext } from '@dnd-kit/core';
import { type FC } from 'react';
import styles from './InsertionDropZone.module.scss';
import classNames from 'classnames';

type TInsertionDropZoneProps = {
  parentPath: string;
  insertionIndex: number;
  siblingPath?: string; // Path of the node this zone is positioned relative to
  insertBefore?: boolean; // Whether this zone inserts before the sibling
  hasParent?: boolean;
  isEditing?: boolean;
};

export const InsertionDropZone: FC<TInsertionDropZoneProps> = ({
  parentPath,
  insertionIndex,
  siblingPath,
  insertBefore = false,
  hasParent = true,
  isEditing = false,
}) => {
  const { active } = useDndContext();

  // Check if we're dragging a QuoteLibrary argument (has item data) or a node (has type: 'node-reorder')
  const isDraggingQuoteLibraryItem = active?.data.current?.item && !active?.data.current?.type;
  const isDraggingNodeReorder = active?.data.current?.type === 'node-reorder';

  // Only show insertion zones when dragging QuoteLibrary items AND not editing
  const shouldShow = isDraggingQuoteLibraryItem && !isDraggingNodeReorder && !isEditing;

  const { setNodeRef, isOver } = useDroppable({
    id: `insertion-${parentPath}-${insertionIndex}`,
    data: {
      parentPath,
      insertionIndex,
      siblingPath,
      insertBefore,
      nodeType: 'insertion',
    },
    disabled: !shouldShow,
  });

  if (!shouldShow) {
    return null;
  }

  return (
    <div
      ref={setNodeRef}
      className={classNames(
        styles.dropzone,
        `transition-all duration-300`,
        isOver && styles.active,
        hasParent && styles.hasParent
      )}
    >
      {isOver && (
        <div className={styles.dndPlaceholder}>
          <div className={styles.skeleton}>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </div>
  );
};
