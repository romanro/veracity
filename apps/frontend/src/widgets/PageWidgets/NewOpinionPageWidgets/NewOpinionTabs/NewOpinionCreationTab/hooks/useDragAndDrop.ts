import { useCallback, type MutableRefObject } from 'react';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import type { TNewOpinionArgumentsListRef, TListItem } from '../../../NewOpinionArgumentsList';
import type { NewOpinionCreationAction } from '../NewOpinionCreationTab.types';
import type { IDragNodeData } from '../NewOpinionDragOverlay';
import { createArgumentItem } from '../../../NewOpinionArgumentsList/NewOpinionArgumentsList.utils';

interface IUseDragAndDropProps {
  argumentsListRef: MutableRefObject<TNewOpinionArgumentsListRef | null>;
  dispatch: (action: NewOpinionCreationAction) => void;
}

export const useDragAndDrop = ({ argumentsListRef, dispatch }: IUseDragAndDropProps) => {
  const handleDragStart = useCallback((event: DragStartEvent) => {
    // Prevent drag start if an item is being edited
    if (argumentsListRef.current?.getEditingItem()) {
      return;
    }

    const { active } = event;

    // Handle QuoteLibrary item drag
    if (active.data.current?.item) {
      dispatch({ type: 'SET_ACTIVE_DRAG', payload: { type: 'argument', data: active.data.current.item } });
    }

    // Handle node reorder drag
    if (active.data.current?.type === 'node-reorder') {
      dispatch({ type: 'SET_ACTIVE_DRAG', payload: { type: 'node', data: active.data.current as IDragNodeData } });
    }
  }, [argumentsListRef, dispatch]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    dispatch({ type: 'END_DRAG' });

    // Prevent drop if an item is being edited
    if (argumentsListRef.current?.getEditingItem()) {
      return;
    }

    if (!over || !argumentsListRef.current) return;

    // Handle item reordering
    if (active.data.current?.type === 'node-reorder') {
      const activeId = active.id.toString().replace('reorder-', '');
      const listState = argumentsListRef.current.getListState();
      const activeIndex = listState.items.findIndex((item: TListItem) => item.id === activeId);

      if (activeIndex === -1) return;

      // Check if dropping on a drop zone
      if (over.id.toString().startsWith('drop-zone-')) {
        const targetIndex = over.data.current?.index;
        if (targetIndex !== undefined) {
          // Adjust target index if moving item down
          const adjustedIndex = targetIndex > activeIndex ? targetIndex - 1 : targetIndex;
          argumentsListRef.current.reorderItem(activeIndex, adjustedIndex);
        }
      }
      return;
    }

    // Handle QuoteLibrary argument drops
    const draggedItem = active.data.current?.item;
    if (!draggedItem || !draggedItem.id) return;

    const argumentItem = createArgumentItem(draggedItem);

    // Mark the argument as used BEFORE adding the item so it's available
    // in usedArguments when ArgumentItem renders after the list update.
    dispatch({ type: 'ADD_USED_ARGUMENT', payload: draggedItem });

    // Check if we're dropping on a drop zone (between items)
    if (over.id.toString().startsWith('drop-zone-')) {
      const insertionIndex = over.data.current?.index;
      if (insertionIndex !== undefined) {
        argumentsListRef.current.addItem(argumentItem, insertionIndex);
      }
    }
    // Fallback: check if we're dropping on the list root
    else if (over.id === 'opinion-list-root') {
      argumentsListRef.current.addItem(argumentItem);
    }
  }, [argumentsListRef, dispatch]);

  return { handleDragStart, handleDragEnd };
};