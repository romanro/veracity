import { type FC } from 'react';
import { Skeleton } from '@/libs/ui-components/Skeleton';
import { Card } from '@/libs/ui-components/Card';

export const ArgumentsListSkeleton: FC = () => {
  return (
    <Card className='flex w-[100%] flex-col items-center justify-center'>
      <Skeleton count={5} shimmerProps={{ width: '100%', height: 80 }} />
    </Card>
  );
};
