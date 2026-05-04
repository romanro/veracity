import { type FC } from 'react';
import { type TArgumentsListProps } from './ArgumentsList.models';
import { ArgumentSummary } from './ArgumentSummary/ArgumentSummary';
import { Skeleton } from '@/libs/ui-components/Skeleton';
import { EmptyList } from '@/libs/ui-components/EmptyList';

export const ArgumentsList: FC<TArgumentsListProps> = ({ data = [], isLoading }) => {
  if (isLoading) return <Skeleton count={5} shimmerProps={{ width: '100%', height: 150 }} />;

  if (data?.length < 1) return <EmptyList title='No arguments found' />;

  return (
    <ul className='block !px-2 !py-6'>
      {data?.map((argument) => {
        const { id } = argument;
        return (
          <li key={id}>
            <ArgumentSummary argument={argument} />
          </li>
        );
      })}
    </ul>
  );
};
