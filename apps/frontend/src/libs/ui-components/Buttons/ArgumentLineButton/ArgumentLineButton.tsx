'use client';

import { type FC } from 'react';

import { type TArgumentLineButtonProps } from './ArgumentLineButton.models';
import { BadgeCheck, BadgeMinus, Bookmark, Ellipsis, MessageCircleMore } from 'lucide-react';

import { Badge } from '../../Badge';
import { IconButton } from '../IconButton/IconButton';
import { ShareButton } from '../ShareButton';

export const ArgumentLineButton: FC<TArgumentLineButtonProps> = ({
  disabled: _disabled = false,
  item,
  showContextMenu,
}) => {
  return (
    <div className='item-center flex justify-between pl-6'>
      <ul className='flex flex-row items-center gap-2'>
        <Badge icon={BadgeCheck} count={item.countConfirmations} />
        <Badge icon={BadgeMinus} count={item.countRefutations} />
        <Badge icon={MessageCircleMore} count={item.countComments} />
      </ul>

      <ul className='flex flex-row items-center gap-2'>
        <IconButton icon={Bookmark} />
        <ShareButton />
        <IconButton icon={Ellipsis} onClick={showContextMenu} />
      </ul>
    </div>
  );
};
