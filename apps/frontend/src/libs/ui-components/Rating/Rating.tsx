import { Gem } from 'lucide-react';
import type { FC } from 'react';

type TRatingProps = { rating: number };
export const Rating: FC<TRatingProps> = ({ rating }) => {
  return (
    <span className='flex items-center gap-1 text-sm text-(--color-purple-500)'>
      <Gem size={16} />
      {rating}
    </span>
  );
};
