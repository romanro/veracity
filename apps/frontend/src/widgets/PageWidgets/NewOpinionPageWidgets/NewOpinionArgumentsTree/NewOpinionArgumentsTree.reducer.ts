import { useReducer, useMemo } from 'react';
import type { TDocumentRoot, TNode } from './NewOpinionArgumentsTree.models';
import {
  insertNodeAtPath,
  insertNodeAsSibling,
  recalculatePaths,
  removeNodeAtPath,
  updateNodeByPath,
  reorderNode,
  validateTree,
} from './NewOpinionArgumentsTree.utils';

type TTreeAction =
  | { type: 'ADD'; parentPath: string; newNode: TNode; index?: number }
  | { type: 'ADD_SIBLING'; siblingPath: string; newNode: TNode; insertBefore?: boolean }
  | { type: 'REMOVE'; path: string }
  | { type: 'UPDATE'; path: string; updater: (node: TNode) => TNode }
  | { type: 'REORDER'; fromPath: string; toParentPath: string; toIndex: number }
  | { type: 'RESET_PATHS' }
  | { type: 'SET_TREE'; tree: TDocumentRoot };

// Reducer
function treeReducer(state: TDocumentRoot, action: TTreeAction): TDocumentRoot {
  switch (action.type) {
    case 'ADD': {
      const updated = insertNodeAtPath(state, action.parentPath, action.newNode, action.index);
      return recalculatePaths(updated);
    }
    case 'ADD_SIBLING': {
      const updated = insertNodeAsSibling(state, action.siblingPath, action.newNode, action.insertBefore);
      return recalculatePaths(updated);
    }
    case 'REMOVE': {
      const updated = removeNodeAtPath(state, action.path);
      return recalculatePaths(updated);
    }
    case 'UPDATE': {
      const updated = updateNodeByPath(state, action.path, action.updater);
      return recalculatePaths(updated);
    }
    case 'REORDER': {
      const updated = reorderNode(state, action.fromPath, action.toParentPath, action.toIndex);
      return recalculatePaths(updated);
    }
    case 'RESET_PATHS': {
      return recalculatePaths(state);
    }
    case 'SET_TREE': {
      return recalculatePaths(action.tree);
    }
    default:
      return state;
  }
}

export function useTree(initial: TDocumentRoot) {
  const [state, dispatch] = useReducer(treeReducer, recalculatePaths(initial));

  // Memoized tree validity calculation
  const isValid = useMemo(() => validateTree(state), [state]);

  return {
    tree: state,
    isValid,
    addNode: (parentPath: string, newNode: TNode, index?: number) =>
      dispatch({ type: 'ADD', parentPath, newNode, index }),
    addSibling: (siblingPath: string, newNode: TNode, insertBefore?: boolean) =>
      dispatch({ type: 'ADD_SIBLING', siblingPath, newNode, insertBefore }),
    removeNode: (path: string) => dispatch({ type: 'REMOVE', path }),
    updateNode: (path: string, updater: (node: TNode) => TNode) => dispatch({ type: 'UPDATE', path, updater }),
    reorderNode: (fromPath: string, toParentPath: string, toIndex: number) =>
      dispatch({ type: 'REORDER', fromPath, toParentPath, toIndex }),
    resetPaths: () => dispatch({ type: 'RESET_PATHS' }),
    setTree: (tree: TDocumentRoot) => dispatch({ type: 'SET_TREE', tree }),
  };
}
