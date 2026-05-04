import { type FC } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';
import classNames from 'classnames';
import styles from './ReorderDragHandle.module.scss';
import type { TListItem } from '../NewOpinionArgumentsList.models';

interface TReorderDragHandleProps {
  item: TListItem;
  className?: string;
  disabled?: boolean;
}

export const ReorderDragHandle: FC<TReorderDragHandleProps> = ({ item, className, disabled = false }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `reorder-${item.id}`,
    data: {
      type: 'node-reorder',
      // Include item data in a format compatible with drag overlay
      node: item, // The overlay expects 'node' prop
      nodeType: item.type, // The overlay expects 'nodeType' prop
      nodePath: item.index.toString(), // For compatibility
    },
    disabled,
  });

  if (disabled) {
    return null;
  }

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={classNames(
        styles.dragHandle,
        'cursor-grab active:cursor-grabbing',
        isDragging && styles.dragging,
        className
      )}
      type='button'
      title='Drag to reorder'
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <GripVertical size={16} />
    </button>
  );
};
