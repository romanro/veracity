import { useReducer, useMemo } from 'react';
import type {
  TListDocument,
  TListItem,
  TItemType,
} from '@widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionArgumentsList/NewOpinionArgumentsList.models';
import {
  insertItemAtIndex,
  removeItemAtIndex,
  removeItemById,
  updateItemAtIndex,
  updateItemById,
  reorderItem,
  recalculateIndices,
  validateList,
  changeItemType,
} from './ConfRefArgumentsList.utils';

type TListAction =
  | { type: 'ADD_ITEM'; item: TListItem; index?: number }
  | { type: 'REMOVE_ITEM'; index: number }
  | { type: 'REMOVE_ITEM_BY_ID'; itemId: string }
  | { type: 'UPDATE_ITEM'; index: number; updater: (item: TListItem) => TListItem }
  | { type: 'UPDATE_ITEM_BY_ID'; itemId: string; updater: (item: TListItem) => TListItem }
  | { type: 'REORDER_ITEM'; fromIndex: number; toIndex: number }
  | { type: 'CHANGE_ITEM_TYPE'; itemId: string; newType: TItemType }
  | { type: 'SET_LIST'; list: TListDocument };

function listReducer(state: TListDocument, action: TListAction): TListDocument {
  switch (action.type) {
    case 'ADD_ITEM': {
      const index = action.index !== undefined ? action.index : state.items.length;
      return insertItemAtIndex(state, action.item, index);
    }
    case 'REMOVE_ITEM': {
      return removeItemAtIndex(state, action.index);
    }
    case 'REMOVE_ITEM_BY_ID': {
      return removeItemById(state, action.itemId);
    }
    case 'UPDATE_ITEM': {
      return updateItemAtIndex(state, action.index, action.updater);
    }
    case 'UPDATE_ITEM_BY_ID': {
      return updateItemById(state, action.itemId, action.updater);
    }
    case 'REORDER_ITEM': {
      return reorderItem(state, action.fromIndex, action.toIndex);
    }
    case 'CHANGE_ITEM_TYPE': {
      return updateItemById(state, action.itemId, (item) => changeItemType(item, action.newType));
    }
    case 'SET_LIST': {
      return recalculateIndices(action.list);
    }
    default:
      return state;
  }
}

export function useList(initial: TListDocument) {
  const [state, dispatch] = useReducer(listReducer, recalculateIndices(initial));

  const isValid = useMemo(() => validateList(state), [state]);

  const getList = () => state;

  return {
    list: state,
    isValid,
    addItem: (item: TListItem, index?: number) => dispatch({ type: 'ADD_ITEM', item, index }),
    removeItem: (index: number) => dispatch({ type: 'REMOVE_ITEM', index }),
    removeItemById: (itemId: string) => dispatch({ type: 'REMOVE_ITEM_BY_ID', itemId }),
    updateItem: (index: number, updater: (item: TListItem) => TListItem) =>
      dispatch({ type: 'UPDATE_ITEM', index, updater }),
    updateItemById: (itemId: string, updater: (item: TListItem) => TListItem) =>
      dispatch({ type: 'UPDATE_ITEM_BY_ID', itemId, updater }),
    reorderItem: (fromIndex: number, toIndex: number) => dispatch({ type: 'REORDER_ITEM', fromIndex, toIndex }),
    changeItemType: (itemId: string, newType: TItemType) => dispatch({ type: 'CHANGE_ITEM_TYPE', itemId, newType }),
    setList: (list: TListDocument) => dispatch({ type: 'SET_LIST', list }),
    getList,
  };
}
