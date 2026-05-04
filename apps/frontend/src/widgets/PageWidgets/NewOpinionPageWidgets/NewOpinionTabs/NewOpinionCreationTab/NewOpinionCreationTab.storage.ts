import type { TDocumentRoot } from '../../NewOpinionArgumentsTree/NewOpinionArgumentsTree.models';
import type { TListDocument } from '../../NewOpinionArgumentsList/NewOpinionArgumentsList.models';
import type { TArgument } from '@core/models/Argument.model';

/**
 * Structure stored in localStorage containing both tree and used arguments
 */
interface IStoredOpinionState {
  tree: TDocumentRoot;
  usedArguments: TArgument[];
}

/**
 * Structure stored in localStorage containing both list and used arguments
 */
interface IStoredOpinionListState {
  list: TListDocument;
  usedArguments: TArgument[];
}

/**
 * Generate localStorage key for tree state based on user, topic, and version IDs
 */
export const getTreeStorageKey = (userId?: string, topicId?: string, versionId?: string): string | null => {
  if (!userId || !topicId || !versionId) return null;
  return `opinion-tree-${userId}-${topicId}-${versionId}`;
};

/**
 * Load tree state and used arguments from localStorage
 */
export const loadTreeFromStorage = (
  userId?: string,
  topicId?: string,
  versionId?: string
): { tree: TDocumentRoot; usedArguments: TArgument[] } | undefined => {
  const key = getTreeStorageKey(userId, topicId, versionId);
  if (!key || typeof window === 'undefined') return undefined;

  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) return undefined;

    const parsed = JSON.parse(stored) as IStoredOpinionState;

    // Validate the stored structure
    if (
      parsed &&
      typeof parsed === 'object' &&
      'tree' in parsed &&
      'usedArguments' in parsed &&
      parsed.tree &&
      typeof parsed.tree === 'object' &&
      'type' in parsed.tree &&
      'path' in parsed.tree &&
      parsed.tree.type === 'root' &&
      Array.isArray(parsed.usedArguments)
    ) {
      return {
        tree: parsed.tree,
        usedArguments: parsed.usedArguments,
      };
    }
  } catch (error) {
    console.warn(`Error loading tree from localStorage (key: ${key}):`, error);
  }

  return undefined;
};

/**
 * Save tree state and used arguments to localStorage
 */
export const saveTreeToStorage = (
  tree: TDocumentRoot,
  usedArguments: TArgument[],
  userId?: string,
  topicId?: string,
  versionId?: string
): void => {
  const key = getTreeStorageKey(userId, topicId, versionId);
  if (!key || typeof window === 'undefined') return;

  try {
    const stateToStore: IStoredOpinionState = {
      tree,
      usedArguments,
    };
    const serialized = JSON.stringify(stateToStore);
    window.localStorage.setItem(key, serialized);
  } catch (error) {
    console.warn(`Error saving tree to localStorage (key: ${key}):`, error);
  }
};

// ==================== List Storage Functions ====================

/**
 * Generate localStorage key for list state based on user, topic, and version IDs
 */
export const getListStorageKey = (userId?: string, topicId?: string, versionId?: string): string | null => {
  if (!userId || !topicId || !versionId) return null;
  return `opinion-list-${userId}-${topicId}-${versionId}`;
};

/**
 * Load list state and used arguments from localStorage
 */
export const loadListFromStorage = (
  userId?: string,
  topicId?: string,
  versionId?: string
): { list: TListDocument; usedArguments: TArgument[] } | undefined => {
  const key = getListStorageKey(userId, topicId, versionId);
  if (!key || typeof window === 'undefined') return undefined;

  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) return undefined;

    const parsed = JSON.parse(stored) as IStoredOpinionListState;

    // Validate the stored structure
    if (
      parsed &&
      typeof parsed === 'object' &&
      'list' in parsed &&
      'usedArguments' in parsed &&
      parsed.list &&
      typeof parsed.list === 'object' &&
      'id' in parsed.list &&
      'items' in parsed.list &&
      parsed.list.id === 'root' &&
      Array.isArray(parsed.list.items) &&
      Array.isArray(parsed.usedArguments)
    ) {
      return {
        list: parsed.list,
        usedArguments: parsed.usedArguments,
      };
    }
  } catch (error) {
    console.warn(`Error loading list from localStorage (key: ${key}):`, error);
  }

  return undefined;
};

/**
 * Save list state and used arguments to localStorage
 */
export const saveListToStorage = (
  list: TListDocument,
  usedArguments: TArgument[],
  userId?: string,
  topicId?: string,
  versionId?: string
): void => {
  const key = getListStorageKey(userId, topicId, versionId);
  if (!key || typeof window === 'undefined') return;

  try {
    const stateToStore: IStoredOpinionListState = {
      list,
      usedArguments,
    };
    const serialized = JSON.stringify(stateToStore);
    window.localStorage.setItem(key, serialized);
  } catch (error) {
    console.warn(`Error saving list to localStorage (key: ${key}):`, error);
  }
};
