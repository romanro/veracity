import type { THeadingItem, TItemType, TTextItem } from '../NewOpinionArgumentsList.models';

export type TEditableItemProps = {
  item: THeadingItem | TTextItem;
  addItemAfter: (item: THeadingItem | TTextItem) => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, updater: (item: THeadingItem | TTextItem) => THeadingItem | TTextItem) => void;
  changeItemType: (itemId: string, newType: TItemType) => void;
  editingItemId: string | null;
  setEditingItemId: (itemId: string | null) => void;
  isAnyItemEditing: boolean;
  showTypeSelect?: boolean;
  showLine?: boolean;
};
