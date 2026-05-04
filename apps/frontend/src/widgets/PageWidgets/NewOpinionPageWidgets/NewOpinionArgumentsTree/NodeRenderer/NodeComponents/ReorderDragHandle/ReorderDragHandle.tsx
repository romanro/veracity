import { type FC } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';
import classNames from 'classnames';
import styles from './ReorderDragHandle.module.scss';
import type { TNode } from '../../../NewOpinionArgumentsTree.models';
import type { TArgument } from '@core/models/Argument.model';

interface TReorderDragHandleProps {
  node: TNode;
  className?: string;
  disabled?: boolean;
  argument?: TArgument;
}

export const ReorderDragHandle: FC<TReorderDragHandleProps> = ({ node, className, disabled = false, argument }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `reorder-${node.id}`,
    data: {
      type: 'node-reorder',
      node,
      nodeType: node.type,
      nodePath: node.path,
      argument,
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
