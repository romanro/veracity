import { type FC } from 'react';
import { useDroppable } from '@dnd-kit/core';
import classNames from 'classnames';
import styles from './DropZone.module.scss';

interface IDropZoneProps {
  id: string;
  index: number;
  isVisible: boolean;
  disabled?: boolean;
}

export const DropZone: FC<IDropZoneProps> = ({ id, index, isVisible, disabled = false }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'insertion-drop',
      index,
    },
    disabled,
  });

  if (!isVisible || disabled) {
    return null;
  }

  return (
    <div ref={setNodeRef} className={classNames(styles.dropZone, isOver && styles.active)}>
      <div className={styles.line} />
      {isOver && (
        <div className={styles.dndPlaceholder}>
          <div className={styles.skeleton}>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </div>
  );
};
