import { useCallback } from 'react';
import type { TListItem } from '../../../NewOpinionArgumentsList/NewOpinionArgumentsList.models';

// Constants
const PENDING_PUBLISH_KEY = 'pending-publish-action';
const EXPIRATION_TIME_MS = 5 * 60 * 1000; // 5 minutes

// Types
interface IPendingPublishState {
  userId?: string | number;
  versionId: string;
  topicId?: string;
  topic?: string;
  version?: string;
  items: TListItem[];
  timestamp: number;
}

// Helper function to check if we're in a browser environment
const isBrowser = (): boolean => typeof window !== 'undefined';

/**
 * Save pending publish action to localStorage
 */
const savePendingPublish = (data: Omit<IPendingPublishState, 'timestamp'>): void => {
  if (!isBrowser()) return;

  try {
    const state: IPendingPublishState = {
      ...data,
      timestamp: Date.now(),
    };
    localStorage.setItem(PENDING_PUBLISH_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save pending publish state:', error);
  }
};

/**
 * Get pending publish action from localStorage
 * Returns null if not found, expired, or invalid
 */
const getPendingPublish = (): IPendingPublishState | null => {
  if (!isBrowser()) return null;

  try {
    const stored = localStorage.getItem(PENDING_PUBLISH_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as IPendingPublishState;

    // Check if expired
    if (Date.now() - parsed.timestamp > EXPIRATION_TIME_MS) {
      clearPendingPublish();
      return null;
    }

    return parsed;
  } catch (error) {
    console.warn('Failed to read pending publish state:', error);
    return null;
  }
};

/**
 * Clear pending publish action from localStorage
 */
const clearPendingPublish = (): void => {
  if (!isBrowser()) return;

  try {
    localStorage.removeItem(PENDING_PUBLISH_KEY);
  } catch (error) {
    console.warn('Failed to clear pending publish state:', error);
  }
};

/**
 * Custom hook for managing pending publish actions across OAuth redirects
 *
 * @returns Object with methods to set and check pending publish state
 *
 * @example
 * const { setPendingPublish, checkAndClearPendingPublish } = usePendingPublish();
 *
 * // Before opening sign-in modal
 * setPendingPublish({
 *   versionId: version.id,
 *   topicId: topic?.id,
 *   topic: topic?.title,
 *   version: version?.title,
 *   items: argumentsListRef.current.getList().items
 * });
 *
 * // After sign-in (in useEffect)
 * const pendingData = checkAndClearPendingPublish(versionId);
 * if (pendingData) {
 *   executePublish(pendingData);
 * }
 */
export const usePendingPublish = () => {
  /**
   * Set a pending publish action with complete opinion data
   */
  const setPendingPublish = useCallback((data: Omit<IPendingPublishState, 'timestamp'>) => {
    savePendingPublish(data);
  }, []);

  /**
   * Check if there's a pending publish action for the given versionId
   * If found and valid, clears it and returns the saved data
   * If not found, expired, or different versionId, returns null
   */
  const checkAndClearPendingPublish = useCallback(
    (versionId: string): Omit<IPendingPublishState, 'timestamp'> | null => {
      const pendingPublish = getPendingPublish();

      if (!pendingPublish) return null;

      // Validate versionId matches
      if (pendingPublish.versionId !== versionId) {
        return null;
      }

      // Clear the pending action
      clearPendingPublish();

      // Return data without timestamp
      const { ...data } = pendingPublish;
      return data;
    },
    []
  );

  return {
    setPendingPublish,
    checkAndClearPendingPublish,
  };
};
