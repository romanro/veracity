import { useState, useImperativeHandle, forwardRef, useEffect, useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import type {
  TListItem,
  TListDocument,
  TNewOpinionArgumentsListRef,
  TNewOpinionArgumentsListProps,
  TArgumentItem,
  TTextItem,
  THeadingItem,
} from './NewOpinionArgumentsList.models';
import { isArgumentItem } from './NewOpinionArgumentsList.utils';
import { useList } from './NewOpinionArgumentsList.reducer';
import { initialListDocument } from './NewOpinionArgumentsList.mock';
import { ArgumentItem } from './ArgumentItem/ArgumentItem';
import { EditableItem } from './EditableItem/EditableItem';
import { DropZone } from './DropZone/DropZone';
import { AddItemButton } from './AddItemButton/AddItemButton';
import { createTextItem } from './NewOpinionArgumentsList.utils';
import styles from './NewOpinionArgumentsList.module.scss';
import { useGetProfile } from '@core/api/hooks/useGetProfile';

export const NewOpinionArgumentsList = forwardRef<TNewOpinionArgumentsListRef, TNewOpinionArgumentsListProps>(
  (
    {
      onArgumentDeleted,
      isDraggingArgument = false,
      isDraggingNode = false,
      draggedItemIndex = null,
      onValidityChange,
      initialList,
      onListChange,
    },
    ref
  ) => {
    const { list, isValid, addItem, removeItemById, updateItemById, reorderItem, changeItemType, setList, getList } =
      useList(initialList || initialListDocument);

    const { data } = useGetProfile();

    const [editingItemId, setEditingItemId] = useState<string | null>(null);

    // Notify parent when validity changes
    useEffect(() => {
      onValidityChange?.(isValid);
    }, [isValid, onValidityChange]);

    // Notify parent when list changes
    useEffect(() => {
      onListChange?.(list);
    }, [list, onListChange]);

    // Expose API via ref
    useImperativeHandle(ref, () => ({
      addItem: (item: TListItem, index?: number) => addItem(item, index),
      removeItem: (itemId: string) => removeItemById(itemId),
      reorderItem,
      getEditingItem: () => editingItemId,
      getListValidity: () => isValid,
      getListState: () => list,
      setListState: (newList: TListDocument) => setList(newList),
      getList,
    }));

    // Add item after a specific item
    const addItemAfter = useCallback(
      (currentItem: TListItem, newItem: TListItem) => {
        const currentIndex = list.items.findIndex((item) => item.id === currentItem.id);
        if (currentIndex !== -1) {
          addItem(newItem, currentIndex + 1);
        } else {
          addItem(newItem);
        }
      },
      [list.items, addItem]
    );

    const addRootItem = () => {
      const author = data ? { id: String(data.id), name: data.name } : undefined;
      const newItem = createTextItem('', author);
      addItem(newItem);
      setEditingItemId(newItem.id);
    };

    // Setup droppable for the entire list
    const { setNodeRef: setDroppableRef } = useDroppable({
      id: 'opinion-list-root',
      data: {
        type: 'list-root',
      },
    });

    // Helper to check if a drop zone should be disabled
    // Drop zone at index i should be disabled if:
    // - It's immediately before the dragged item (index i === draggedItemIndex)
    // - It's immediately after the dragged item (index i === draggedItemIndex + 1)
    const isDropZoneDisabled = (dropZoneIndex: number): boolean => {
      if (draggedItemIndex === null || draggedItemIndex === undefined) return false;
      return dropZoneIndex === draggedItemIndex || dropZoneIndex === draggedItemIndex + 1;
    };


    return (
      <div ref={setDroppableRef} className={styles.listContainer}>
        {/* Drop zone at the beginning */}
        <DropZone
          id='drop-zone-0'
          index={0}
          isVisible={isDraggingArgument || isDraggingNode}
          disabled={isDropZoneDisabled(0)}
        />

        {list.items.map((item, idx) => {
          const { id } = item;

          return (
            <div key={id}>
            {isArgumentItem(item, data) ? (
              <ArgumentItem
                item={item as TArgumentItem}
                removeItem={removeItemById}
                isAnyItemEditing={!!editingItemId}
                onArgumentDeleted={onArgumentDeleted}
                isFirstItem={idx === 0}
                addItemAfter={(newItem) => addItemAfter(item, newItem)}
                setEditingItemId={setEditingItemId}
              />
            ) : (
              <EditableItem
                item={item as TTextItem | THeadingItem}
                addItemAfter={(newItem) => addItemAfter(item, newItem)}
                removeItem={removeItemById}
                updateItem={(itemId, updater) => updateItemById(itemId, updater as any)}
                changeItemType={changeItemType}
                editingItemId={editingItemId}
                setEditingItemId={setEditingItemId}
                isAnyItemEditing={!!editingItemId}
              />
            )}
            {/* Drop zone after each item */}
            <DropZone
              id={`drop-zone-${idx + 1}`}
              index={idx + 1}
              isVisible={isDraggingArgument || isDraggingNode}
              disabled={isDropZoneDisabled(idx + 1)}
            />
          </div>
          )
        })}

        {/* Add item button */}
        {!editingItemId && <AddItemButton onClick={addRootItem} disabled={!!editingItemId} />}
      </div>
    );
  }
);

NewOpinionArgumentsList.displayName = 'NewOpinionArgumentsList';
