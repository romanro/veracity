import type { TListDocument, TListItem } from '@widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionArgumentsList';

export type TConfRefArgumentsListProps = {
  onArgumentDeleted?: (argumentId: string) => void;
  isDraggingArgument?: boolean;
  isDraggingNode?: boolean;
  draggedItemIndex?: number | null;
  onValidityChange?: (isValid: boolean) => void;
  initialList?: TListDocument;
  onListChange?: (list: TListDocument) => void;
};

export type TConfRefArgumentsListRef = {
  getList: () => TListDocument;
  addItem: (item: TListItem, index?: number) => void;
  removeItem: (itemId: string) => void;
  reorderItem: (fromIndex: number, toIndex: number) => void;
  getEditingItem: () => string | null;
  getListValidity: () => boolean;
  getListState: () => TListDocument;
  setListState: (list: TListDocument) => void;
};
