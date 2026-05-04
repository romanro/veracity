import { useState, useImperativeHandle, forwardRef, useEffect, useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import type {
  TListItem,
  TListDocument,
  TArgumentItem,
  TTextItem,
  THeadingItem,
} from '@widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionArgumentsList/NewOpinionArgumentsList.models';
import { ArgumentItem } from '@widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionArgumentsList/ArgumentItem/ArgumentItem';
import { EditableItem } from '@widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionArgumentsList/EditableItem/EditableItem';
import { DropZone } from '@widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionArgumentsList/DropZone/DropZone';
import { AddItemButton } from '@widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionArgumentsList/AddItemButton/AddItemButton';
import { useGetProfile } from '@core/api/hooks/useGetProfile';
import type { TConfRefArgumentsListProps, TConfRefArgumentsListRef } from './ConfRefArgumentsList.models';
import { isArgumentItem, createTextItem } from './ConfRefArgumentsList.utils';
import { useList } from './ConfRefArgumentsList.reducer';
import { initialListDocument } from './ConfRefArgumentsList.mock';
import { Card } from '@libs/ui-components/Card';

export const ConfRefArgumentsList = forwardRef<TConfRefArgumentsListRef, TConfRefArgumentsListProps>(
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

    useEffect(() => {
      onValidityChange?.(isValid);
    }, [isValid, onValidityChange]);

    useEffect(() => {
      onListChange?.(list);
    }, [list, onListChange]);

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

    const { setNodeRef: setDroppableRef } = useDroppable({
      id: 'confref-list-root',
      data: {
        type: 'list-root',
      },
    });

    const isDropZoneDisabled = (dropZoneIndex: number): boolean => {
      if (draggedItemIndex === null || draggedItemIndex === undefined) return false;
      return dropZoneIndex === draggedItemIndex || dropZoneIndex === draggedItemIndex + 1;
    };

    return (
      <div className='flex flex-col gap-[10px]'>
        <Card className='!p-4'>
          <div ref={setDroppableRef} className='relative flex flex-col py-2.5'>
            <DropZone
              id='drop-zone-0'
              index={0}
              isVisible={isDraggingArgument || isDraggingNode}
              disabled={isDropZoneDisabled(0)}
            />

            {list.items.map((item, idx) => {
              const { id } = item;

              return (
                <div key={id} >
                  {isArgumentItem(item, data) ? (
                    <ArgumentItem
                      item={item as TArgumentItem}
                      removeItem={removeItemById}
                      isAnyItemEditing={!!editingItemId}
                      onArgumentDeleted={onArgumentDeleted}
                      isFirstItem={idx === 0}
                      addItemAfter={(newItem) => addItemAfter(item, newItem)}
                      setEditingItemId={setEditingItemId}
                      showLine={false}
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
                      showTypeSelect={false}
                      showLine={false}
                    />
                  )}
                  <DropZone
                    id={`drop-zone-${idx + 1}`}
                    index={idx + 1}
                    isVisible={isDraggingArgument || isDraggingNode}
                    disabled={isDropZoneDisabled(idx + 1)}
                  />
                </div>
              );
            })}
          </div>
        </Card>
        {!editingItemId && (
          <Card className='!pt-0 !pb-6 !px-4'>
            <AddItemButton onClick={addRootItem} disabled={!!editingItemId} />
          </Card>
        )}
      </div>
    );
  }
);

ConfRefArgumentsList.displayName = 'ConfRefArgumentsList';
