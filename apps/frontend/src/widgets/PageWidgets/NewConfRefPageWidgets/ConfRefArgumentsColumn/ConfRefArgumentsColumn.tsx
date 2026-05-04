import { memo, type FC, type MutableRefObject, useCallback } from 'react';
import {
  ConfRefArgumentsList,
  type TConfRefArgumentsListRef,
} from '@widgets/PageWidgets/NewConfRefPageWidgets/ConfRefArgumentsList';
import { type TListDocument } from '@widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionArgumentsList';

interface IConfRefArgumentsColumnProps {
  argumentsListRef: MutableRefObject<TConfRefArgumentsListRef | null>;
  onArgumentDeleted: (argumentId: string) => void;
  isDraggingArgument: boolean;
  isDraggingNode: boolean;
  draggedItemIndex?: number | null;
  initialList?: TListDocument;
  onListChange?: (list: TListDocument) => void;
  onValidityChange?: (isValid: boolean) => void;
}

export const ConfRefArgumentsColumn: FC<IConfRefArgumentsColumnProps> = memo(
  ({
    argumentsListRef,
    onArgumentDeleted,
    isDraggingArgument,
    isDraggingNode,
    draggedItemIndex,
    initialList,
    onListChange,
    onValidityChange,
  }) => {
    const handleArgumentDeleted = useCallback(
      (argumentId: string) => {
        onArgumentDeleted(argumentId);
      },
      [onArgumentDeleted]
    );

    return (
     
        <ConfRefArgumentsList
          ref={argumentsListRef}
          onArgumentDeleted={handleArgumentDeleted}
          isDraggingArgument={isDraggingArgument}
          isDraggingNode={isDraggingNode}
          draggedItemIndex={draggedItemIndex}
          initialList={initialList}
          onListChange={onListChange}
          onValidityChange={onValidityChange}
        />
   
    );
  }
);

ConfRefArgumentsColumn.displayName = 'ConfRefArgumentsColumn';
