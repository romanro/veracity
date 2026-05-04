import type { LucideIcon } from 'lucide-react';
import type { FC } from 'react';

type TBadgeProps = { icon: LucideIcon; count?: number };
export const Badge: FC<TBadgeProps> = ({ icon: Icon, count = 0 }) => {
  return (
    <li className='flex flex-row items-center gap-1 text-(--color-ghost-text)'>
      <Icon size={20} className='text-(--color-ghost-text)' />
      <span className='text-sm font-medium text-(--color-ghost-text)'>{count}</span>
    </li>
  );
};
