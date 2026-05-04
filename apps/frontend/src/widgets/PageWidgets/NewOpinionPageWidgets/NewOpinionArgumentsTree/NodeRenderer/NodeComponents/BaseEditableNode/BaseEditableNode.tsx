import { type FC, type ReactNode, type MouseEvent } from 'react';
import classNames from 'classnames';
import { UserDotAvatar } from '@libs/ui-components/UserDotAvatar';
import { ReorderDragHandle } from '../ReorderDragHandle/ReorderDragHandle';
import type { TNode } from '../../../NewOpinionArgumentsTree.models';
import styles from './NodeBase.module.scss';

export interface IBaseEditableNodeProps {
  node: TNode;
  isEditing?: boolean;
  inEditState: boolean;
  setNodeEditable: (e: MouseEvent<HTMLDivElement>) => void;
  showDragHandle?: boolean;
  showLine?: boolean;
  isFirstNode?: boolean;
  className?: string;
  children: ReactNode;
  renderToolButton?: () => ReactNode;
  renderAfter?: () => ReactNode;
}

export const BaseEditableNode: FC<IBaseEditableNodeProps> = ({
  node,
  isEditing = false,
  inEditState,
  setNodeEditable,
  showDragHandle = true,
  showLine = true,
  isFirstNode = false,
  className,
  children,
  renderToolButton,
  renderAfter,
}) => {
  return (
    <>
      <div
        className={classNames(styles.nodeBase, inEditState && styles.editing, className, 'node-container')}
        onClick={setNodeEditable}
      >
        <div className={classNames(styles.avatar)}>
          <UserDotAvatar size={22} />
        </div>
        {showDragHandle && <ReorderDragHandle node={node} disabled={isEditing} />}
        {showLine && <div className={classNames(styles.line, isFirstNode && styles.firstNode)} />}
        {renderToolButton?.()}
        <section className={styles.content}>{children}</section>
      </div>
      {renderAfter?.()}
    </>
  );
};
