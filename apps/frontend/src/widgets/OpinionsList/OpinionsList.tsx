import { type FC } from 'react';
import { type ArgumentTab, useInfiniteOpinions } from './useInfiniteOpinions';
import { OpinionSummary } from './OpinionSummary';
import { Card } from '@libs/ui-components/Card';
import { FetchNextPageButton } from '@libs/ui-components/FetchNextPageButton';
import { OpinionsListSkeleton } from './OpinionsListSkeleton';
import { OpinionsListEmpty } from './OpinionsListEmpty';

type TOpinionsListProps = {
  argumentId?: string | number;
  mode?: ArgumentTab;
};
export const OpinionsList: FC<TOpinionsListProps> = ({ argumentId, mode = 'approve' }) => {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteOpinions({
    argumentId,
    mode,
    perPage: 10,
  });

  if (isLoading) return <OpinionsListSkeleton />;

  const flatOpinions = data ? data.pages.flat() : [];

  const hasOpinions = flatOpinions?.length > 0;

  if (!hasOpinions) return <OpinionsListEmpty />;

  return (
    <Card>
      <ul className='!p-4'>
        {flatOpinions?.map?.((opinion) => (
          <li key={`${mode}_${opinion.id}`}>
            <OpinionSummary opinion={opinion} />
          </li>
        ))}
        <li>
          <FetchNextPageButton
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
          />
        </li>
      </ul>
    </Card>
  );
};
