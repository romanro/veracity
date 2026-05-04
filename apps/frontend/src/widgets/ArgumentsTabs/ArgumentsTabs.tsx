import { useMemo, type FC } from 'react';
import { type TArgumentsTabsProps } from './ArgumentsTabs.models';
import { Card } from '@libs/ui-components/Card';
import styles from './ArgumentsTabs.module.scss';
import { TabFilters } from './TabFilters/TabFilters';
import { ArgumentsList } from '../ArgumentsList';
import { useArgumentSearchParams } from '../PageWidgets/ConsensusPageWidgets/useArgumentSearchParams';
import { FetchNextPageButton } from '@libs/ui-components/FetchNextPageButton';
import { CommentsTab } from '../CommentTab';
import dynamic from 'next/dynamic';
import { Skeleton } from '@libs/ui-components/Skeleton';

const OpinionOfUserList = dynamic(() => import('../OpinionOfUserList').then((mod) => mod.OpinionOfUserList), {
  ssr: true,
  loading: () => <Skeleton count={3} shimmerProps={{ width: '100%', height: 80 }} />,
});

export const ArgumentsTabs: FC<TArgumentsTabsProps> = ({
  args,
  authors,
  isLoading,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  versionId,
}) => {
  const { tabId, userId } = useArgumentSearchParams();

  const selectedTabId = useMemo(() => (tabId ? tabId : 'arguments'), [tabId]);

  return (
    <div className='flex flex-col gap-1 pb-6'>
      <Card className={styles.tabsCard}>
        <TabFilters authors={authors} />
      </Card>
      {selectedTabId === 'arguments' ? (
        <Card className={styles.listCard}>
          {userId && versionId ? (
            <>
            <OpinionOfUserList versionId={versionId} userId={userId} />
            </>
          ) : (
            <>
              <ArgumentsList data={args} isLoading={isLoading} />
              <FetchNextPageButton
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
              />
            </>
          )}
        </Card>
      ) : (
        <Card className={styles.listCard}>
          <CommentsTab />
        </Card>
      )}
    </div>
  );
};
