import type { TArgument } from '@core/models/Argument.model';

export type TNewOpinionArgumentsListProps = {
  onArgumentDeleted?: (argumentId: string) => void;
  isDraggingArgument?: boolean;
  isDraggingNode?: boolean;
  draggedItemIndex?: number | null;
  onValidityChange?: (isValid: boolean) => void;
  initialList?: TListDocument;
  onListChange?: (list: TListDocument) => void;
};

export type TNewOpinionArgumentsListRef = {
  getList: () => TListDocument;
  addItem: (item: TListItem, index?: number) => void;
  removeItem: (itemId: string) => void;
  reorderItem: (fromIndex: number, toIndex: number) => void;
  getEditingItem: () => string | null;
  getListValidity: () => boolean;
  getListState: () => TListDocument;
  setListState: (list: TListDocument) => void;
};

export type TItemType = 'text' | 'argument' | 'heading1' | 'heading2' | 'heading3';

type TBaseListItem = {
  id: string;
  index: number;
  type: TItemType; 
  imgFile?: string | null;
  text?: string;
  metaData?: {
    author: { id: string; name: string; avatar?: string };
    createdDate: Date;
    originalArgument?: TArgument;
  };
};

// Text item - editable text content
export type TTextItem = TBaseListItem & {
  type: 'text';
  title: string;

  originalArgumentId?: string;
};

// Argument item - reference to existing argument
export type TArgumentItem = TBaseListItem & {
  type: 'argument';
  originalArgumentId?: string;
};

// Heading items (H1-H5)
export type THeadingItem = TBaseListItem & {
  type: 'heading1' | 'heading2' | 'heading3';
  title: string;
};

// Union type for all list items
export type TListItem = TTextItem | TArgumentItem | THeadingItem;

// Root document structure
export type TListDocument = {
  id: 'root';
  items: TListItem[];
};
