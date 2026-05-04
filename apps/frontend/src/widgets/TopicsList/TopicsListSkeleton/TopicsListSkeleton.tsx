import { type FC } from 'react';
import { Skeleton } from '@/libs/ui-components/Skeleton';

export const TopicsListSkeleton: FC = () => {
  return (
    <div className='w-[700px] max-w-[700px]'>
      <Skeleton count={5} shimmerProps={{ width: '100%', height: 200 }} />
    </div>
  );
};
