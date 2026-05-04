import { Asterisk } from 'lucide-react';
import { type FC } from 'react';

export const TabFiltersConsensus: FC = () => {
  return (
    <div className='flex items-center gap-2'>
      <Asterisk size={20} color='white' className='block rounded-full bg-(--color-purple-600)' /> <span>Consensus</span>
    </div>
  );
};
