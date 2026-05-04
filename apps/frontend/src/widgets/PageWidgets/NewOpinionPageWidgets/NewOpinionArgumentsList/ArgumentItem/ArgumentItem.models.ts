import type { TArgumentItem, THeadingItem, TTextItem } from '../NewOpinionArgumentsList.models';

export type TArgumentItemProps = {
  isFirstItem?: boolean;
  item: TArgumentItem;
  removeItem: (itemId: string) => void;
  isAnyItemEditing: boolean;
  onArgumentDeleted?: (argumentId: string) => void;
  addItemAfter: (item: THeadingItem | TTextItem) => void;
  setEditingItemId: (itemId: string | null) => void;
  showLine?: boolean;
};
