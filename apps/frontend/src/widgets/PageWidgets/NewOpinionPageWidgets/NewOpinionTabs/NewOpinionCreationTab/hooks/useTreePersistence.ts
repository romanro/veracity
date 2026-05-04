import { useRef, useMemo, useCallback, useEffect } from 'react';
import type { TDocumentRoot } from '../../../NewOpinionArgumentsTree/NewOpinionArgumentsTree.models';
import type { TArgument } from '@core/models/Argument.model';
import { loadTreeFromStorage, saveTreeToStorage } from '../NewOpinionCreationTab.storage';
import { TREE_SAVE_DEBOUNCE_MS } from '../NewOpinionCreationTab.constants';

interface IUseTreePersistenceParams {
  userId?: string;
  topicId?: string;
  versionId?: string;
}

/**
 * Custom hook to handle tree state persistence to localStorage
 * - Loads initial tree state and used arguments on mount
 * - Debounces saves to localStorage
 * - Cleans up pending saves on unmount
 */
export const useTreePersistence = ({ userId, topicId, versionId }: IUseTreePersistenceParams) => {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load initial state from localStorage
  const initialState = useMemo(() => {
    return loadTreeFromStorage(userId, topicId, versionId);
  }, [userId, topicId, versionId]);

  // Debounced save handler for tree and used arguments
  const handleStateChange = useCallback(
    (tree: TDocumentRoot, usedArguments: TArgument[]) => {
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Debounce save to localStorage
      saveTimeoutRef.current = setTimeout(() => {
        saveTreeToStorage(tree, usedArguments, userId, topicId, versionId);
        saveTimeoutRef.current = null;
      }, TREE_SAVE_DEBOUNCE_MS);
    },
    [userId, topicId, versionId]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    initialTree: initialState?.tree,
    initialUsedArguments: initialState?.usedArguments,
    handleStateChange,
  };
};
