import type { TArgument } from '@core/models/Argument.model';
import type { TUserProfileResponse } from '@core/api/models/Profile.api.models';
import type {
  TListDocument,
  TListItem,
  THeadingItem,
  TTextItem,
  TArgumentItem,
  TItemType,
} from '@widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionArgumentsList/NewOpinionArgumentsList.models';

export function isHeadingItem(item: TListItem): item is THeadingItem {
  return item.type.startsWith('heading');
}

export function isTextItem(item: TListItem): item is TTextItem {
  return item.type === 'text' || item.type === 'argument';
}

export function isArgumentItem(item: TListItem, userProfile?: TUserProfileResponse): item is TArgumentItem {
  if (item.type !== 'argument') {
    return false;
  } else {
    if (!item.metaData?.originalArgument?.isEdit) {
      return true;
    }
    return String(item.metaData?.author.id) !== String(userProfile?.id);
  }
}

export function isEditableItem(item: TListItem): item is THeadingItem | TTextItem {
  return isHeadingItem(item) || isTextItem(item);
}

export function recalculateIndices(list: TListDocument): TListDocument {
  return {
    ...list,
    items: list.items.map((item, index) => ({
      ...item,
      index,
    })),
  };
}

export function insertItemAtIndex(list: TListDocument, item: TListItem, index: number): TListDocument {
  const items = [...list.items];
  const insertAt = Math.max(0, Math.min(index, items.length));
  items.splice(insertAt, 0, item);

  return recalculateIndices({
    ...list,
    items,
  });
}

export function removeItemAtIndex(list: TListDocument, index: number): TListDocument {
  const items = list.items.filter((_, i) => i !== index);

  return recalculateIndices({
    ...list,
    items,
  });
}

export function removeItemById(list: TListDocument, itemId: string): TListDocument {
  const items = list.items.filter((item) => item.id !== itemId);

  return recalculateIndices({
    ...list,
    items,
  });
}

export function updateItemAtIndex(
  list: TListDocument,
  index: number,
  updater: (item: TListItem) => TListItem
): TListDocument {
  const items = list.items.map((item, i) => (i === index ? updater(item) : item));

  return recalculateIndices({
    ...list,
    items,
  });
}

export function updateItemById(
  list: TListDocument,
  itemId: string,
  updater: (item: TListItem) => TListItem
): TListDocument {
  const items = list.items.map((item) => (item.id === itemId ? updater(item) : item));

  return recalculateIndices({
    ...list,
    items,
  });
}

export function findItemById(list: TListDocument, itemId: string): TListItem | null {
  return list.items.find((item) => item.id === itemId) || null;
}

export function reorderItem(list: TListDocument, fromIndex: number, toIndex: number): TListDocument {
  const items = [...list.items];

  if (fromIndex < 0 || fromIndex >= items.length || toIndex < 0 || toIndex >= items.length) {
    return list;
  }

  const [movedItem] = items.splice(fromIndex, 1);
  items.splice(toIndex, 0, movedItem);

  return recalculateIndices({
    ...list,
    items,
  });
}

export function changeItemType(item: TListItem, newType: TItemType): TListItem {
  if (!isEditableItem(item)) {
    return item;
  }

  return {
    ...item,
    type: newType,
  } as TListItem;
}

const generateItemId = () => crypto.randomUUID();

export function createHeadingItem(
  level: 1 | 2 | 3 | 4 | 5,
  title: string = '',
  author?: { id: string; name: string }
): THeadingItem {
  return {
    id: generateItemId(),
    type: `heading${level}` as THeadingItem['type'],
    title,
    index: 0,
    ...(author && {
      metaData: {
        author,
        createdDate: new Date(),
      },
    }),
  };
}

export function createTextItem(title: string = '', author?: { id: string; name: string }): TTextItem {
  return {
    id: generateItemId(),
    type: 'text',
    title,
    index: 0,
    ...(author && {
      metaData: {
        author,
        createdDate: new Date(),
      },
    }),
  };
}

export function createArgumentItem(argument: TArgument): TArgumentItem {
  return {
    id: generateItemId(),
    type: 'argument',
    originalArgumentId: argument.id,
    index: 0,
    metaData: {
      author: {
        id: String(argument.author.id),
        name: argument.author.name,
        avatar: argument.author.avatar,
      },
      createdDate: new Date(),
      originalArgument: argument,
    },
  };
}

export function validateList(list: TListDocument): boolean {
  if (!list.items || list.items.length === 0) {
    return false;
  }

  return list.items.every((item) => isItemValid(item));
}

function isItemValid(item: TListItem): boolean {
  if (item.type === 'argument') {
    return true;
  }

  if (isTextItem(item)) {
    return !!item.title?.trim();
  }

  if (isHeadingItem(item)) {
    return !!item.title?.trim();
  }

  return true;
}
