'use client';

import { type FC, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { DndContext, pointerWithin, rectIntersection } from '@dnd-kit/core';
import { type DehydratedState } from '@tanstack/react-query';
import { SSRReactQueryProvider } from '@core/providers/ReactQueryProvider/SSRReactQueryProvider';
import { newOpinionCreationReducer } from '@widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionTabs/NewOpinionCreationTab/NewOpinionCreationTab.reducer';
import { initialState } from '@widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionTabs/NewOpinionCreationTab/NewOpinionCreationTab.types';
import { type TNewOpinionArgumentsListRef } from '@widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionArgumentsList';
import { type TListDocument } from '@widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionArgumentsList/NewOpinionArgumentsList.models';
import { QuoteLibraryColumn } from '@widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionTabs/NewOpinionCreationTab/components/QuoteLibraryColumn';
import { NewOpinionDragOverlay } from '@widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionTabs/NewOpinionCreationTab/NewOpinionDragOverlay';
import { AnimationOverlay } from '@widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionTabs/NewOpinionCreationTab/components/AnimationOverlay';
import { OpinionStrengthIndicator } from '@widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionTabs/NewOpinionCreationTab/components/OpinionStrengthIndicator';
import { ConfRefArgumentsColumn } from '@widgets/PageWidgets/NewConfRefPageWidgets/ConfRefArgumentsColumn';
import { useArgumentAnimation } from '@widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionTabs/NewOpinionCreationTab/hooks/useArgumentAnimation';
import { useDragAndDrop } from '@widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionTabs/NewOpinionCreationTab/hooks/useDragAndDrop';
import { useOpinionData } from '@widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionTabs/NewOpinionCreationTab/hooks/useOpinionData';
import { useOpinionStrength } from '@widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionTabs/NewOpinionCreationTab/hooks/useOpinionStrength';
import { ConfRefHeader } from '@widgets/PageWidgets/NewConfRefPageWidgets/ConfRefHeader';
import { useLocaleRouter } from '@/libs/hooks/useLocaleRouter';
import { Skeleton } from '@libs/ui-components/Skeleton';
import { type TArgument } from '@core/models/Argument.model';
import { type TTopic } from '@core/models/Topic.model';
import { type TVersion } from '@core/models/Version.model';

type TNewConfRefContainerProps = {
  dehydratedState: DehydratedState;
  mainParams: {
    topicId: string;
    versionId: string;
    argumentId: string;
    locale: string;
  };
  type: string;
  topic?: TTopic;
  version?: TVersion;
  argument?: TArgument;
};

export const NewConfRefContainer: FC<TNewConfRefContainerProps> = ({
  dehydratedState,
  mainParams,
  type,
  topic,
  version,
  argument,
}) => {
  const argumentsListRef = useRef<TNewOpinionArgumentsListRef>(null);
  const [currentList, setCurrentList] = useState<TListDocument | null>(null);
  const [state, dispatch] = useReducer(newOpinionCreationReducer, initialState);
  const { pushLocalePath } = useLocaleRouter();

  const { handleDragStart, handleDragEnd } = useDragAndDrop({ argumentsListRef, dispatch });
  const { handleArgumentReuse } = useArgumentAnimation({ argumentsListRef, dispatch });

  const { initialList, initialUsedArguments, handleStateChange, isLoadingFromServer } = useOpinionData({
    topicId: mainParams.topicId,
    versionId: mainParams.versionId,
  });

  const opinionStrength = useOpinionStrength(currentList);

  useEffect(() => {
    if (initialUsedArguments && initialUsedArguments.length > 0) {
      dispatch({ type: 'SET_USED_ARGUMENTS', payload: initialUsedArguments });
    }
  }, [initialUsedArguments]);

  useEffect(() => {
    if (currentList) {
      handleStateChange(currentList, state.usedArguments);
    }
  }, [currentList, state.usedArguments, handleStateChange]);

  const handleListChange = useCallback((list: TListDocument) => {
    setCurrentList(list);
  }, []);

  const handleValidityChange = useCallback((isValid: boolean) => {
    dispatch({ type: 'SET_TREE_VALIDITY', payload: isValid });
  }, []);

  const handleArgumentDeleted = useCallback((argumentId: string) => {
    dispatch({ type: 'REMOVE_USED_ARGUMENT', payload: argumentId });
  }, []);

  const handleCancel = useCallback(() => {
    pushLocalePath(
      `/topics/${mainParams.topicId}/versions/${mainParams.versionId}/arguments/${mainParams.argumentId}`
    );
  }, [pushLocalePath, mainParams]);

  const isDraggingArgument = useMemo(() => state.activeDrag?.type === 'argument', [state.activeDrag]);
  const isDraggingNode = useMemo(() => state.activeDrag?.type === 'node', [state.activeDrag]);
  const draggedItemIndex = useMemo(() => {
    if (state.activeDrag?.type === 'node') {
      const node = state.activeDrag.data.node;
      return 'index' in node && typeof node.index === 'number' ? node.index : null;
    }
    return null;
  }, [state.activeDrag]);

  const collisionDetectionStrategy = useCallback((args: any) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }
    return rectIntersection(args);
  }, []);

  return (
    <SSRReactQueryProvider dehydratedState={dehydratedState}>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={collisionDetectionStrategy}
      >
        <div className='grid h-[calc(100vh-var(--header-height))] max-h-[calc(100vh-var(--header-height))] grid-cols-[61%_38%] gap-[calc(1%-10px)] overflow-hidden max-md:grid-cols-1 max-md:grid-rows-[1fr_1fr] max-md:p-2'>
          <div className='flex min-h-0 flex-col gap-4 overflow-auto pb-[25px] pr-[10px] max-md:order-1'>
            <ConfRefHeader
              argument={argument}
              topic={topic}
              version={version}
              type={type}
              isTreeValid={state.isTreeValid}
              argumentsListRef={argumentsListRef}
              argumentId={mainParams.argumentId}
              topicId={mainParams.topicId}
              versionId={mainParams.versionId}
              onCancel={handleCancel}
            />
            {isLoadingFromServer ? (
              <Skeleton count={5} shimmerProps={{ width: '100%', height: 80 }} />
            ) : (
              <>
                <OpinionStrengthIndicator
                  reusedCount={opinionStrength.reusedCount}
                  totalCount={opinionStrength.totalCount}
                />
                <ConfRefArgumentsColumn
                  argumentsListRef={argumentsListRef}
                  onArgumentDeleted={handleArgumentDeleted}
                  isDraggingArgument={isDraggingArgument}
                  isDraggingNode={isDraggingNode}
                  draggedItemIndex={draggedItemIndex}
                  initialList={initialList}
                  onListChange={handleListChange}
                  onValidityChange={handleValidityChange}
                />
              </>
            )}
          </div>
          <div className='flex min-h-0 flex-col overflow-hidden pb-[15px] max-md:order-2'>
            <QuoteLibraryColumn usedArguments={state.usedArguments} onArgumentReuse={handleArgumentReuse} />
          </div>
        </div>
        <NewOpinionDragOverlay activeDrag={state.activeDrag} />
        <AnimationOverlay animatingArgument={state.animatingArgument} animationStartPos={state.animationStartPos} />
      </DndContext>
    </SSRReactQueryProvider>
  );
};
