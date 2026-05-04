'use client';
import { ShimmerPlaceholder } from '@libs/ui-components/ShimmerPlaceholder';
import { type FC, useRef, useReducer, useCallback, useMemo, useEffect, useState } from 'react';
import { DndContext, pointerWithin, rectIntersection } from '@dnd-kit/core';
import type { TListDocument } from '../../NewOpinionArgumentsList/NewOpinionArgumentsList.models';
import { type TNewOpinionArgumentsListRef } from '../../NewOpinionArgumentsList';
import { newOpinionCreationReducer } from './NewOpinionCreationTab.reducer';
import { initialState, type TNewOpinionCreationTabProps } from './NewOpinionCreationTab.types';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useOpinionData } from './hooks/useOpinionData';
import { useArgumentAnimation } from './hooks/useArgumentAnimation';
import { useOpinionStrength } from './hooks/useOpinionStrength';
import { StaticHeader } from './components/StaticHeader';
import { ArgumentsColumn } from './components/ArgumentsColumn';
import { QuoteLibraryColumn } from './components/QuoteLibraryColumn';
import { AnimationOverlay } from './components/AnimationOverlay';
import { OpinionStrengthIndicator } from './components/OpinionStrengthIndicator';
import { NewOpinionDragOverlay } from './NewOpinionDragOverlay';
import { Skeleton } from '@libs/ui-components/Skeleton';

export const NewOpinionCreationTab: FC<TNewOpinionCreationTabProps> = ({
  children,
  topic,
  version,
  isLoading,
  onCancel,
}) => {
  // ==================== State & Refs ====================
  const argumentsListRef = useRef<TNewOpinionArgumentsListRef>(null);
  const [currentList, setCurrentList] = useState<TListDocument | null>(null);
  const [state, dispatch] = useReducer(newOpinionCreationReducer, initialState);

  // ==================== Custom Hooks ====================
  const { handleDragStart, handleDragEnd } = useDragAndDrop({ argumentsListRef, dispatch });

  const { initialList, initialUsedArguments, handleStateChange, isLoadingFromServer } = useOpinionData({
    topicId: topic?.id,
    versionId: version?.id,
  });

  const { handleArgumentReuse } = useArgumentAnimation({ argumentsListRef, dispatch });

  const opinionStrength = useOpinionStrength(currentList);

  // ==================== Effects ====================
  // Restore usedArguments from localStorage on mount
  useEffect(() => {
    if (initialUsedArguments && initialUsedArguments.length > 0) {
      dispatch({ type: 'SET_USED_ARGUMENTS', payload: initialUsedArguments });
    }
  }, [initialUsedArguments]);

  // Save to localStorage whenever list or usedArguments change
  useEffect(() => {
    if (currentList) {
      handleStateChange(currentList, state.usedArguments);
    }
  }, [currentList, state.usedArguments, handleStateChange]);

  // ==================== Callbacks ====================
  const handleListChange = useCallback((list: TListDocument) => {
    // Update list state - this will trigger re-render and recalculate opinion strength
    setCurrentList(list);
  }, []);

  const handleValidityChange = useCallback((isValid: boolean) => {
    dispatch({ type: 'SET_TREE_VALIDITY', payload: isValid });
  }, []);

  const handleArgumentDeleted = useCallback((argumentId: string) => {
    dispatch({ type: 'REMOVE_USED_ARGUMENT', payload: argumentId });
  }, []);

  // ==================== Derived State ====================
  const isDraggingArgument = useMemo(() => state.activeDrag?.type === 'argument', [state.activeDrag]);
  const isDraggingNode = useMemo(() => state.activeDrag?.type === 'node', [state.activeDrag]);
  const draggedItemIndex = useMemo(() => {
    if (state.activeDrag?.type === 'node') {
      const node = state.activeDrag.data.node;
      // Check if node has index property (TListItem from NewOpinionArgumentsList)
      return 'index' in node && typeof node.index === 'number' ? node.index : null;
    }
    return null;
  }, [state.activeDrag]);

  // Custom collision detection: use pointerWithin first (better for small drop zones), fallback to rectIntersection
  const collisionDetectionStrategy = useCallback((args: any) => {
    // First, try pointer-based detection (works better for small drop zones)
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }

    // Fallback to rectangle intersection
    return rectIntersection(args);
  }, []);

  // ==================== Render ====================
  if (isLoading) return <ShimmerPlaceholder className='w-full gap-4 !p-4' height={300} />;

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={collisionDetectionStrategy}>
      <div className="h-[calc(100vh-var(--header-height))] max-h-[calc(100vh-var(--header-height))] grid grid-cols-[61%_38%] gap-[calc(1%-10px)] overflow-hidden max-md:grid-cols-1 max-md:grid-rows-[1fr_1fr] max-md:p-2">
        <div className="flex flex-col gap-4 min-h-0 overflow-auto pb-[25px] pr-[10px] max-md:order-1">
          {children}
          <StaticHeader
            argumentsListRef={argumentsListRef}
            topic={topic}
            version={version}
            onCancel={onCancel}
            isTreeValid={state.isTreeValid}
          />
          {isLoadingFromServer ? (
             <Skeleton count={5} shimmerProps={{ width: '100%', height: 80 }} />
          ) : (
            <>
              <OpinionStrengthIndicator
                reusedCount={opinionStrength.reusedCount}
                totalCount={opinionStrength.totalCount}
              />
              <ArgumentsColumn
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
        <div className="flex flex-col min-h-0 overflow-hidden pb-[15px] max-md:order-2">
          <QuoteLibraryColumn usedArguments={state.usedArguments} onArgumentReuse={handleArgumentReuse} />
        </div>
      </div>
      <NewOpinionDragOverlay activeDrag={state.activeDrag} />
      <AnimationOverlay animatingArgument={state.animatingArgument} animationStartPos={state.animationStartPos} />
    </DndContext>
  );
};
