import { useRef, useMemo, useCallback, useEffect } from 'react';
import type { TListDocument } from '../../../NewOpinionArgumentsList/NewOpinionArgumentsList.models';
import type { TArgument } from '@core/models/Argument.model';
import { loadListFromStorage, saveListToStorage } from '../NewOpinionCreationTab.storage';
import { TREE_SAVE_DEBOUNCE_MS } from '../NewOpinionCreationTab.constants';

interface IUseListPersistenceParams {
  userId?: string;
  topicId?: string;
  versionId?: string;
}

/**
 * Custom hook to handle list state persistence to localStorage
 * - Loads initial list state and used arguments on mount
 * - Debounces saves to localStorage
 * - Cleans up pending saves on unmount
 */
export const useListPersistence = ({ userId, topicId, versionId }: IUseListPersistenceParams) => {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load initial state from localStorage
  const initialState = useMemo(() => {
    return loadListFromStorage(userId, topicId, versionId);
  }, [userId, topicId, versionId]);

  // Debounced save handler for list and used arguments
  const handleStateChange = useCallback(
    (list: TListDocument, usedArguments: TArgument[]) => {
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Debounce save to localStorage
      saveTimeoutRef.current = setTimeout(() => {
        saveListToStorage(list, usedArguments, userId, topicId, versionId);
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
    initialList: initialState?.list,
    initialUsedArguments: initialState?.usedArguments,
    handleStateChange,
  };
};
