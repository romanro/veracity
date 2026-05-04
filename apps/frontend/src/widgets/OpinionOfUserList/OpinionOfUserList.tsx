'use client';

import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { type TOpinionOfUserListProps } from './OpinionOfUserList.models';
import { useInfiniteOpinionArguments } from './useGetOpinionArguments';
import { Skeleton } from '@/libs/ui-components/Skeleton';
import { EmptyList } from '@/libs/ui-components/EmptyList';
import { OpinionItem } from './OpinionItem';
import { useArgumentSearchParams } from '@/widgets/PageWidgets/ConsensusPageWidgets/useArgumentSearchParams';
import { FetchNextPageButton } from '@/libs/ui-components/FetchNextPageButton';

export const OpinionOfUserList: FC<TOpinionOfUserListProps> = ({ versionId, userId }) => {
  const { t } = useTranslation('consensusPage');
  const { userId: urlUserId } = useArgumentSearchParams();
  const effectiveUserId = urlUserId || userId;
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteOpinionArguments({
    versionId,
    userId: effectiveUserId,
  });

  if (isLoading) {
    return <Skeleton count={3} shimmerProps={{ width: '100%', height: 80 }} />;
  }

  if (error) {
    return <EmptyList title={`Error: ${error.message}`} />;
  }

  const items = data?.pages.flatMap((page) => page.arguments.data.map((item, index) => ({ ...item, index }))) ?? [];

  if (items.length === 0) {
    return <EmptyList title={t('noOpinionArgumentsFound')} />;
  }

  return (
    <>
      <ul className='block !pt-6'>
        {items.map((item) => <OpinionItem key={item.id} item={item} />)}
      </ul>
      <FetchNextPageButton
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      />
    </>
  );
};
