import { memo, type FC, type MutableRefObject, useCallback } from 'react';
import { NewOpinionArgumentsList, type TNewOpinionArgumentsListRef, type TListDocument } from '../../../NewOpinionArgumentsList';
import { Card } from '@libs/ui-components/Card';

interface IArgumentsColumnProps {
  argumentsListRef: MutableRefObject<TNewOpinionArgumentsListRef | null>;
  onArgumentDeleted: (argumentId: string) => void;
  isDraggingArgument: boolean;
  isDraggingNode: boolean;
  draggedItemIndex?: number | null;
  initialList?: TListDocument;
  onListChange?: (list: TListDocument) => void;
  onValidityChange?: (isValid: boolean) => void;
}

export const ArgumentsColumn: FC<IArgumentsColumnProps> = memo(
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
      <Card className='!p-4'>
        <NewOpinionArgumentsList
          ref={argumentsListRef}
          onArgumentDeleted={handleArgumentDeleted}
          isDraggingArgument={isDraggingArgument}
          isDraggingNode={isDraggingNode}
          draggedItemIndex={draggedItemIndex}
          initialList={initialList}
          onListChange={onListChange}
          onValidityChange={onValidityChange}
        />
      </Card>
    );
  }
);

ArgumentsColumn.displayName = 'ArgumentsColumn';
