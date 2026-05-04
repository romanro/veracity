import { Heading1, Heading2, Heading3, Type } from 'lucide-react';
import type { TDropdownMenuOption } from '@libs/ui-components/DropdownMenu/DropdownMenu.models';
import type { THeadingNode, TNodeType } from '../../../NewOpinionArgumentsTree.models';

export const options: TDropdownMenuOption<TNodeType>[] = [
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

const optionByTypeMap: { [key in TNodeType]: TNodeType[] } = {
  heading1: ['heading1', 'text'],
  heading2: ['heading2', 'text'],
  heading3: ['heading3', 'text'],
  text: [],
  argument: [],
};

export const getOptionsByType = (type: TNodeType) => {
  return options.filter((option) => optionByTypeMap[type].includes(option.value));
};

export const canBeDeleted = (children: THeadingNode['children']): boolean => {
  if (children.length === 0) {
    return true;
  }

  return children.every((c) => ['text', 'argument'].includes(c.type));
};

export const canBeCancelled = (children: THeadingNode['children']): boolean => {
  if (children.length === 0) {
    return true;
  }

  return children.every((c) => ['text', 'argument'].includes(c.type));
};

export const isTextInNodeValid = (text: string): boolean => {
  return text?.length > 10;
};
