import { useMemo, type FC, type ReactNode, type MouseEvent } from 'react';
import classNames from 'classnames';
import { UserDotAvatar } from '@libs/ui-components/UserDotAvatar';
import { OwnAuthorHeader } from './OwnAuthorHeader';
import { ReorderDragHandle } from '../ReorderDragHandle/ReorderDragHandle';
import { AddItemAfterButton } from '../AddItemAfterButton/AddItemAfterButton';
import type { TListItem } from '../NewOpinionArgumentsList.models';
import styles from './BaseEditableItem.module.scss';


export type TBaseEditableItemProps = {
  item: TListItem;
  isEditing?: boolean;
  inEditState: boolean;
  isAnyItemEditing?: boolean;
  setItemEditable: (e: MouseEvent<HTMLDivElement>) => void;
  onAddItemClick: (e: MouseEvent) => void;
  showDragHandle?: boolean;
  showAuthorHeader?: boolean;
  showLine?: boolean;
  children: ReactNode;
  renderAfter?: () => ReactNode;
};

export const BaseEditableItem: FC<TBaseEditableItemProps> = ({
  item,
  isEditing = false,
  inEditState,
  isAnyItemEditing,
  setItemEditable,
  onAddItemClick,
  showDragHandle = true,
  showAuthorHeader = false,
  showLine = true,
  children,
  renderAfter,
}) => {
  const { author, formattedCreatedDate } = useMemo(() => {
    const auth = item.metaData?.originalArgument?.author ?? item.metaData?.author;
    const date = item.metaData?.originalArgument?.createdDate ?? item.metaData?.createdDate ?? '';
    return { author: auth, formattedCreatedDate: date instanceof Date ? date.toISOString() : date };
  }, [item.metaData]);

  const isFirstItem = item.index === 0;
  return (
    <>
      <div
        className={classNames(styles.itemBase, inEditState && styles.editing, 'item-container')}
        onClick={setItemEditable}
      >
        {showAuthorHeader ? (
            <OwnAuthorHeader authorName={author?.name} avatar={author?.avatar} createdDate={formattedCreatedDate} />
        ) : (
            <div className={classNames(styles.avatar)}>
              <UserDotAvatar size={22} />
            </div>
        )}
        {showDragHandle && <ReorderDragHandle item={item} disabled={isEditing} />}
        {showLine && (
          <div className={classNames(styles.line, isFirstItem && styles.firstNode, inEditState && styles.editing)} />
        )}
        <AddItemAfterButton onClick={onAddItemClick} disabled={isAnyItemEditing} className={styles.addButton} />
        <section className={classNames(styles.content,inEditState && styles.editingContent, showAuthorHeader && styles.contentWithHeader)}>
          {children}
        </section>
      </div>
      {renderAfter?.()}
    </>
  );
};
