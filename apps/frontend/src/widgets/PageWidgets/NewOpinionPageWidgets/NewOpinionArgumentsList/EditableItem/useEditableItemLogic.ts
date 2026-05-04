import { useCallback, useRef, useState, useEffect, type MouseEvent } from 'react';
import type { THeadingItem, TTextItem, TItemType } from '../NewOpinionArgumentsList.models';
import { isTextItem } from '../NewOpinionArgumentsList.utils';
import { createHeadingItem } from '../NewOpinionArgumentsList.utils';
import type { TDropdownMenuOption } from '@libs/ui-components/DropdownMenu/DropdownMenu.models';

interface IUseEditableItemLogicProps {
  item: THeadingItem | TTextItem;
  addItemAfter: (item: THeadingItem | TTextItem) => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, updater: (item: THeadingItem | TTextItem) => THeadingItem | TTextItem) => void;
  changeItemType: (itemId: string, newType: TItemType) => void;
  editingItemId: string | null;
  setEditingItemId: (itemId: string | null) => void;
  isAnyItemEditing: boolean;
}

export const useEditableItemLogic = ({
  item,
  addItemAfter,
  removeItem,
  updateItem,
  changeItemType,
  editingItemId,
  setEditingItemId,
  isAnyItemEditing,
}: IUseEditableItemLogicProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const tittle = item.title ?? item.text ?? item.metaData?.originalArgument?.text ?? '';
  const [value, setValue] = useState(tittle);
  const [tempImgFile, setTempImgFile] = useState<string | null>(null);

  const inEditState = editingItemId === item.id;

  // Initialize value and image when entering edit mode
  useEffect(() => {
    if (inEditState) {
      setValue(tittle);
      // Initialize image for text items
      if (isTextItem(item)) {
        setTempImgFile(item.imgFile || null);
      }
      // Focus input after a brief delay
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [inEditState, item]);

  // Handle entering edit mode
  const setItemEditable = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (isAnyItemEditing) return;
      e.stopPropagation();
      setEditingItemId(item.id);
    },
    [isAnyItemEditing, item.id, setEditingItemId]
  );

  // Handle image cropped
  const handleImageCropped = useCallback((_blob: Blob, _url: string, base64: string) => {
    setTempImgFile(base64);
  }, []);

  // Handle image remove
  const handleImageRemove = useCallback(() => {
    setTempImgFile(null);
  }, []);

  // Handle saving changes
  const onSave = useCallback(() => {
    updateItem(item.id, (currentItem) => {
      const updated: any = {
        ...currentItem,
        title: value.trim(),
      };

      // Only update imgFile for text items
      if (isTextItem(currentItem)) {
        updated.imgFile = tempImgFile || undefined;
      }

      return updated;
    });

    setEditingItemId(null);
  }, [item.id, value, tempImgFile, updateItem, setEditingItemId]);

  // Handle canceling edit
  const onCancel = useCallback(() => {
    setValue(tittle);
    // Reset image to original value
    if (isTextItem(item)) {
      setTempImgFile(item.imgFile || null);
    }
    if (item.title === '' || item.text === '') {
      removeItem(item.id);
    }
    setEditingItemId(null);
  }, [item, removeItem, setEditingItemId]);

  // Handle deleting item
  const onDelete = useCallback(() => {
    removeItem(item.id);
    setEditingItemId(null);
  }, [item.id, removeItem, setEditingItemId]);

  // Handle type change
  const onTypeChanged = useCallback(
    (option: TDropdownMenuOption<TItemType>) => {
      // First, save the current value
      updateItem(item.id, (currentItem) => {
        const updated: any = {
          ...currentItem,
          title: value.trim(),
        };

        // Only update imgFile for text items
        if (isTextItem(currentItem)) {
          updated.imgFile = tempImgFile || undefined;
        }

        return updated;
      });

      // Then change the type
      changeItemType(item.id, option.value);
    },
    [item.id, value, tempImgFile, updateItem, changeItemType]
  );

  // Handle adding new item after this one
  const onAddItemClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      if (isAnyItemEditing) return;

      // Create new H1 heading by default
      const newItem = createHeadingItem(1, '');
      addItemAfter(newItem);
      // Set the new item to edit mode
      setTimeout(() => setEditingItemId(newItem.id), 0);
    },
    [isAnyItemEditing, addItemAfter, setEditingItemId]
  );

  return {
    // State
    inputRef,
    value,
    setValue,
    tempImgFile,
    inEditState,

    // Handlers
    setItemEditable,
    handleImageCropped,
    handleImageRemove,
    onSave,
    onCancel,
    onDelete,
    onTypeChanged,
    onAddItemClick,
  };
};
