import type { TArgument } from '@core/models/Argument.model';
import type { TUserProfileResponse } from '@core/api/models/Profile.api.models';
import type {
  TListDocument,
  TListItem,
  THeadingItem,
  TTextItem,
  TArgumentItem,
  TItemType,
} from './NewOpinionArgumentsList.models';

// Helper type guards
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
    return  String(item.metaData?.author.id) !== String(userProfile?.id);
  }
  
}

// Helper to check if item can be edited (heading or text)
export function isEditableItem(item: TListItem): item is THeadingItem | TTextItem {
  return isHeadingItem(item) || isTextItem(item);
}

/**
 * Recalculates indices for all items in the list
 */
export function recalculateIndices(list: TListDocument): TListDocument {
  return {
    ...list,
    items: list.items.map((item, index) => ({
      ...item,
      index,
    })),
  };
}

/**
 * Inserts a new item at the specified index
 * @param list - the list document
 * @param item - the item to insert
 * @param index - position to insert at
 */
export function insertItemAtIndex(list: TListDocument, item: TListItem, index: number): TListDocument {
  const items = [...list.items];
  const insertAt = Math.max(0, Math.min(index, items.length));
  items.splice(insertAt, 0, item);

  return recalculateIndices({
    ...list,
    items,
  });
}

/**
 * Removes an item at the specified index
 * @param list - the list document
 * @param index - index of item to remove
 */
export function removeItemAtIndex(list: TListDocument, index: number): TListDocument {
  const items = list.items.filter((_, i) => i !== index);

  return recalculateIndices({
    ...list,
    items,
  });
}

/**
 * Removes an item by its ID
 * @param list - the list document
 * @param itemId - ID of item to remove
 */
export function removeItemById(list: TListDocument, itemId: string): TListDocument {
  const items = list.items.filter((item) => item.id !== itemId);

  return recalculateIndices({
    ...list,
    items,
  });
}

/**
 * Updates an item at the specified index
 * @param list - the list document
 * @param index - index of item to update
 * @param updater - function to update the item
 */
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

/**
 * Updates an item by its ID
 * @param list - the list document
 * @param itemId - ID of item to update
 * @param updater - function to update the item
 */
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

/**
 * Finds an item by its ID
 * @param list - the list document
 * @param itemId - ID of item to find
 */
export function findItemById(list: TListDocument, itemId: string): TListItem | null {
  return list.items.find((item) => item.id === itemId) || null;
}

/**
 * Reorders an item from one position to another
 * @param list - the list document
 * @param fromIndex - current index of the item
 * @param toIndex - target index for the item
 */
export function reorderItem(list: TListDocument, fromIndex: number, toIndex: number): TListDocument {
  const items = [...list.items];

  // Validate indices
  if (fromIndex < 0 || fromIndex >= items.length || toIndex < 0 || toIndex >= items.length) {
    return list;
  }

  // Remove item from current position
  const [movedItem] = items.splice(fromIndex, 1);

  // Insert at new position
  items.splice(toIndex, 0, movedItem);

  return recalculateIndices({
    ...list,
    items,
  });
}

/**
 * Changes an item's type (e.g., H1 to H3, or Text to H2)
 * Only works for editable items (headings and text)
 * @param item - the item to change
 * @param newType - the new type
 */
export function changeItemType(item: TListItem, newType: TItemType): TListItem {
  if (!isEditableItem(item)) {
    return item; // Can't change argument items
  }

  // If changing to/from text, preserve title
  return {
    ...item,
    type: newType,
  } as TListItem;
}

// ==================== Factory Functions ====================

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
    index: 0, // Will be recalculated on insert
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
    index: 0, // Will be recalculated on insert
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

// ==================== Validation ====================

/**
 * Validates the entire list
 * Returns false if:
 * - List is empty (no items)
 * - Any text item has empty title
 * - Any heading item has empty title
 * - Argument items are always considered valid
 */
export function validateList(list: TListDocument): boolean {
  // Check if list is empty
  if (!list.items || list.items.length === 0) {
    return false;
  }

  // Validate each item
  return list.items.every((item) => isItemValid(item));
}

/**
 * Validates a single item
 */
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

// ==================== Opinion Strength ====================

/**
 * Opinion strength metrics based on argument reuse
 */
export interface IOpinionStrength {
  reusedCount: number;
  newTextCount: number;
  totalCount: number;
  strengthPercentage: number;
}

/**
 * Calculate opinion strength based on reused vs new arguments
 * Stronger opinion = more reused arguments from existing sources
 * Weaker opinion = more new text arguments
 * Note: Heading items are not counted in the strength calculation
 */
export function calculateOpinionStrength(list: TListDocument): IOpinionStrength {
  let reusedCount = 0;
  let newTextCount = 0;

  list.items.forEach((item) => {
    if ((item as TArgumentItem)?.originalArgumentId) {
      reusedCount++;
    } else if (isTextItem(item)) {
      // Only count text items, not headings
      newTextCount++;
    }
    // Headings are excluded from the calculation
  });

  const totalCount = reusedCount + newTextCount;
  const strengthPercentage = totalCount > 0 ? Math.round((reusedCount / totalCount) * 100) : 0;

  return {
    reusedCount,
    newTextCount,
    totalCount,
    strengthPercentage,
  };
}
