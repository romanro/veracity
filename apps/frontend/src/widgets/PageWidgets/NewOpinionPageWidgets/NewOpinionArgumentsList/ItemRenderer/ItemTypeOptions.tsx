import { Heading1, Heading2, Heading3, Type } from 'lucide-react';
import type { TDropdownMenuOption } from '@libs/ui-components/DropdownMenu/DropdownMenu.models';
import type { TItemType } from '../NewOpinionArgumentsList.models';

// All available item type options for selection
export const allItemTypeOptions: TDropdownMenuOption<TItemType>[] = [
  {
    label: (
      <div className='flex items-center gap-2'>
        <Type size={18} />
        <span>Argument</span>
      </div>
    ),
    value: 'text',
    id: 'text',
  },
  {
    label: (
      <div className='flex items-center gap-2'>
        <Heading1 size={18} />
        <span>Heading 1</span>
      </div>
    ),
    value: 'heading1',
    id: 'heading1',
  },
  {
    label: (
      <div className='flex items-center gap-2'>
        <Heading2 size={18} />
        <span>Heading 2</span>
      </div>
    ),
    value: 'heading2',
    id: 'heading2',
  },
  {
    label: (
      <div className='flex items-center gap-2'>
        <Heading3 size={18} />
        <span>Heading 3</span>
      </div>
    ),
    value: 'heading3',
    id: 'heading3',
  },
];

// Options available in edit mode for type switching (text and all headings)
export const editModeTypeOptions = allItemTypeOptions;

// Validation helper
export function isItemTextValid(text: string): boolean {
  return text?.trim().length > 0;
}
